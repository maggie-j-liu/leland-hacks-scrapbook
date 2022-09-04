import { ProjectCardType } from "../index";
import { ProjectGrid } from "../../components/ProjectGrid";
import prisma from "../../lib/db";
import Link from "next/link";
import { ProjectCard } from "../../components/ProjectCard";
import Select from "react-select";
import { useState } from "react";

const JudgeProjects = ({
  projects,
  selectFormatted,
}: {
  projects: ProjectCardType[];
  selectFormatted: any;
}) => {
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [thirdChoice, setThirdChoice] = useState(null);

  const [chosen, setChosen] = useState([]);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-md sm:max-w-7xl">
        <div className="flex items-center space-x-2">
          <p className="text-xl">🥇</p>
          <Select
            placeholder="First choice"
            isSearchable={true}
            options={selectFormatted}
            onChange={(selectedOption) => {
              setFirstChoice(selectedOption);
            }}
            className="text-black"
          />
        </div>
        {firstChoice && (
          <ProjectCard
            project={
              projects.filter((project) => {
                return project.id === firstChoice?.value;
              })[0]
            }
          />
        )}

        {thirdChoice && (
          <ProjectCard
            project={
              projects.filter((project) => {
                return project.id === thirdChoice?.value;
              })[0]
            }
          />
        )}
        <ProjectGrid>
          {projects.map((project) => {
            return <ProjectCard project={project} />;
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
