import { useSession, signIn, signOut } from "next-auth/react";
import { ProjectCard } from "../components/ProjectCard";

import Masonry from "react-masonry-css";

import prisma from "../lib/db";

const breakpointColumnsObj = {
  default: 2,
  1100: 2,
  700: 2,
  500: 1,
};

export default function Home({ projects }: { projects: any }) {
  const { data: session } = useSession();
  if (session) {
    console.log(session);
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid w-fit"
          columnClassName="masonry-grid-column"
        >
          {projects.map((project: any) => {
            return (
              <a href={`/project/view/${project.id}`}>
                <ProjectCard project={project} />
              </a>
            );
          })}
        </Masonry>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export async function getServerSideProps(context: any) {
  let projects = await prisma.project.findMany({
    include: {
      contributors: true,
      files: true,
    },
  });

  for (const project in projects) {
    projects[project].contributors = projects[project].contributors.map(
      (contributor) => ({
        id: "",
        name: contributor.name,
        username: contributor.username,
        image: contributor.image,
        email: "",
        emailVerified: null,
      })
    );
  }
  return {
    props: { projects }, // will be passed to the page component as props
  };
}
