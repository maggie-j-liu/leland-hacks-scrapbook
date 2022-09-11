import { ProjectCardType } from "../index";
import { ProjectGrid } from "../../components/ProjectGrid";
import prisma from "../../lib/db";
import Link from "next/link";
import { ProjectCard } from "../../components/ProjectCard";
import Select from "react-select";
import { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { useSession, signIn } from "next-auth/react";
import { Vote } from "@prisma/client";

const emojiData = ["🥇", "🥈", "🥉"];
const textData = ["First", "Second", "Third"];
const borderColors = [
  "border-yellow-400",
  "border-gray-400",
  "border-yellow-700",
];

const JudgeProjects = ({
  projects,
  selectFormatted,
  currentVotes,
}: {
  projects: ProjectCardType[];
  selectFormatted: any;
  currentVotes: ({ value: string; label: string } | null)[];
}) => {
  const { data: session } = useSession();
  const [choices, setChoices] = useState<
    ({ value: string; label: string } | null)[]
  >(() => {
    if (currentVotes) {
      return currentVotes;
    }
    return [null, null, null];
  });
  const [options, setOptions] =
    useState<{ value: string; label: string }[]>(selectFormatted);
  const [submitting, setSubmitting] = useState(false);

  const submitVotes = async () => {
    setSubmitting(true);
    if (choices.some((choice) => choice === null)) {
      return;
    }
    await fetch("/api/submit-votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        votes: choices.map((choice) => choice!.value),
      }),
    });
    setSubmitting(false);
  };

  if (!session) {
    return (
      <p className="px-4 text-center text-xl">
        You must be{" "}
        <Link href="/sign-in">
          <a className="dark:text-primary-200 hover:dark:text-primary-300">
            signed in
          </a>
        </Link>{" "}
        to judge.
      </p>
    );
  }
  return (
    <div className="px-4 pb-8">
      <div className="mx-auto max-w-md sm:max-w-7xl">
        <h1 className="mb-8 text-center text-3xl text-primary-200">
          Your Votes
        </h1>
        <div className="space-y-2">
          {choices.map((_, j) => (
            <div key={j} className="flex items-center space-x-2">
              <p className="text-2xl">{emojiData[j]}</p>
              <Select
                isDisabled={submitting}
                classNamePrefix="react-select"
                placeholder={`${textData[j]} choice`}
                isSearchable={true}
                isClearable={true}
                value={choices[j]}
                options={options}
                onChange={(selectedOption) => {
                  const tempStore = choices[j];
                  let choicesCopy = choices;
                  choicesCopy[j] = selectedOption;
                  setChoices([...choicesCopy]);

                  let optionsCopy = options;
                  if (selectedOption) {
                    optionsCopy = options.filter(
                      (option) => option.value !== selectedOption.value
                    );
                  }

                  if (tempStore) {
                    optionsCopy.push(tempStore);
                  }
                  optionsCopy.sort((a, b) => a.label.localeCompare(b.label));

                  setOptions([...optionsCopy]);
                }}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-md bg-secondary-300 px-4 py-1.5 text-black duration-300 hover:duration-100 enabled:hover:bg-primary-200 disabled:cursor-not-allowed disabled:saturate-50"
          onClick={(e) => {
            e.preventDefault();
            submitVotes();
          }}
          disabled={submitting || choices.some((choice) => choice === null)}
        >
          Submit
        </button>

        <div className="mt-8">
          <ProjectGrid>
            {choices.map((choice, i) => {
              return (
                <div className="relative rounded-lg " key={i}>
                  <div className="absolute origin-top -rotate-[20deg] text-5xl duration-300 hover:rotate-[20deg] hover:duration-100">
                    {emojiData[i]}
                  </div>
                  {choice === null ? (
                    <ProjectCard
                      className={`border-4 ${borderColors[i]}`}
                      project={{
                        title: `Your ${textData[i]} choice`,
                        description: "",
                        contributors: [],
                        files: [],
                        ship: true,
                      }}
                      noBorder
                    />
                  ) : (
                    <ProjectCard
                      className={`border-4 ${borderColors[i]}`}
                      project={projects.find((p) => p.id === choice.value)!}
                      noBorder
                    />
                  )}
                </div>
              );
            })}
          </ProjectGrid>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      props: { session },
    };
  }

  const rawCurrentVotes = await prisma.vote.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      place: "asc",
    },
  });

  const projects = await prisma.project.findMany({
    where: {
      ship: true,
    },
    include: {
      contributors: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
      files: true,
    },
  });

  let selectFormatted = projects
    .map((project) => {
      return { value: project.id, label: project.title };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  let currentVotes: { value: string; label: string }[] = [];
  if (rawCurrentVotes.length === 3) {
    for (const vote of rawCurrentVotes) {
      const project = projects.find((p) => p.id === vote.projectId);
      if (project) {
        currentVotes.push({
          value: vote.projectId,
          label: project.title,
        });
      }
    }
  }
  if (currentVotes.length === 3) {
    selectFormatted = selectFormatted.filter(
      (option) => !currentVotes!.some((vote) => vote.value === option.value)
    );
  }

  return {
    props: {
      session,
      projects,
      selectFormatted,
      currentVotes: currentVotes.length === 3 ? currentVotes : null,
    }, // will be passed to the page component as props
  };
};

export default JudgeProjects;
