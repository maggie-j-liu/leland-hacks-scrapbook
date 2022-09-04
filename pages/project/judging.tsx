import { ProjectCardType } from "../index";
import { ProjectGrid } from "../../components/ProjectGrid";
import prisma from "../../lib/db";
import Link from "next/link";
import { ProjectCard } from "../../components/ProjectCard";
import Select from "react-select";
import { useState } from "react";

const emojiData = ["🥇", "🥈", "🥉"];
const textData = ["First", "Second", "Third"];

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
      <div className="mx-auto max-w-md space-y-2 sm:max-w-7xl">
        {choices.map((_, j) => (
          <div key={j} className="flex items-center space-x-2">
            <p className="text-2xl">{emojiData[j]}</p>
            <Select
              placeholder={`${textData[j]} choice`}
              isSearchable={true}
              value={choices[j]}
              options={options}
              onChange={(selectedOption) => {
                let choicesCopy = choices;
                choicesCopy[j] = selectedOption;
                setChoices([...choicesCopy]);

                let optionsCopy = options.filter(
                  (option: any) => option.value !== selectedOption.value
                );
                setOptions([...optionsCopy]);
              }}
              className="w-full text-black"
            />
          </div>
        ))}

        <ProjectGrid>
          {choices.map((choice, i) => {
            if (choice === null) {
              return (
                <ProjectCard
                  key={i}
                  project={{
                    title: `Your ${textData[i]} choice`,
                    description: "",
                    contributors: [],
                    files: [],
                  }}
                />
              );
            }
            const project = projects.find((p) => p.id === choice.value);
            return <ProjectCard key={i} project={project!} />;
          })}
        </ProjectGrid>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
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
