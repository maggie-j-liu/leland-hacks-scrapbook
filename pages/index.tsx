import { useSession, signIn, signOut } from "next-auth/react";
import { ProjectCard } from "../components/ProjectCard";
import Masonry from "react-masonry-css";
import prisma from "../lib/db";
import Link from "next/link";
import { File, Project, User } from "@prisma/client";
import { ProjectGrid } from "../components/ProjectGrid";

export type ProjectCardType = Project & {
  contributors: User[];
  files: File[];
};

export default function Home({ projects }: { projects: ProjectCardType[] }) {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-md sm:max-w-7xl">
        <ProjectGrid>
          {projects.map((project) => {
            return <ProjectCard key={project.id} project={project} />;
          })}
        </ProjectGrid>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  let projects = await prisma.project.findMany({
    include: {
      contributors: true,
      files: true,
    },
  });

  return {
    props: { projects }, // will be passed to the page component as props
  };
}
