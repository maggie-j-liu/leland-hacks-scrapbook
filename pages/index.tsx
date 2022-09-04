import { useSession, signIn, signOut } from "next-auth/react";
import { ProjectCard } from "../components/ProjectCard";
import prisma from "../lib/db";
export default function Home({ projects }: { projects: any }) {
  const { data: session } = useSession();
  if (session) {
    console.log(session);
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        {projects.map((project: any) => {
          return <ProjectCard project={project} />;
        })}
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
