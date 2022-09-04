import { useSession, signIn, signOut } from "next-auth/react";
import { ProjectCard } from "../components/ProjectCard";
import Masonry from "react-masonry-css";
import prisma from "../lib/db";
import Link from "next/link";
import { File, Project, User } from "@prisma/client";

const breakpointColumnsObj = {
  default: 3,
  1023: 2,
  639: 1,
};

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
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <div className="mx-auto max-w-md sm:max-w-7xl">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {projects.map((project) => {
              return (
                <Link key={project.id} href={`/project/view/${project.id}`}>
                  <a>
                    <ProjectCard project={project} />
                  </a>
                </Link>
              );
            })}
          </Masonry>
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
