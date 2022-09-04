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
  const { data: session } = useSession();
  if (session) {
    console.log(session);
    return (
      <div className="px-4">
        <div className="mx-auto max-w-md sm:max-w-7xl">
          <ProjectGrid>
            {projects.map((project) => {
              return (
                <Link key={project.id} href={`/project/view/${project.id}`}>
                  <a>
                    <ProjectCard project={project} />
                  </a>
                </Link>
              );
            })}
          </ProjectGrid>
        </div>
      </div>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
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
