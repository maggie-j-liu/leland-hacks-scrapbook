import { ProjectCardType } from "../index";
import { ProjectGrid } from "../../components/ProjectGrid";
import prisma from "../../lib/db";
import Link from "next/link";
import { ProjectCard } from "../../components/ProjectCard";
import Select from "react-select";
import { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

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
}: {
  projects: ProjectCardType[];
  selectFormatted: any;
}) => {
  const [choices, setChoices] = useState<any[]>([null, null, null]);
  const [options, setOptions] = useState(selectFormatted);
  console.log(choices);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-md sm:max-w-7xl">
        <div className="space-y-2">
          {choices.map((_, j) => (
            <div key={j} className="flex items-center space-x-2">
              <p className="text-2xl">{emojiData[j]}</p>
              <Select
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

                  let optionsCopy = options.filter(
                    (option: any) => option.value !== selectedOption.value
                  );

                  if (tempStore) {
                    optionsCopy.push(tempStore);
                  }

                  setOptions([...optionsCopy]);
                }}
                className="w-full"
              />
            </div>
          ))}
        </div>

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
                      }}
                    />
                  ) : (
                    <ProjectCard
                      className={`border-4 ${borderColors[i]}`}
                      project={projects.find((p) => p.id === choice.value)!}
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

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let projects = await prisma.project.findMany({
    include: {
      contributors: true,
      files: true,
    },
  });

  const selectFormatted = projects.map((project) => {
    return { value: project.id, label: project.title };
  });

  console.log(selectFormatted);

  return {
    props: { projects, selectFormatted }, // will be passed to the page component as props
  };
}

export default JudgeProjects;
