import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "../lib/db";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectGrid } from "../components/ProjectGrid";
import { VoteType } from "@prisma/client";

const Votes = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const projects = props.projects!;
  return (
    <div>
      <h1>Votes</h1>
      <ProjectGrid>
        {projects.map((project) => (
          <div key={project.id}>
            points: {project.calculatedPoints}
            <br />
            normal points: {project.rawPoints.normal}
            <br />
            admin points: {project.rawPoints.admin}
            <ProjectCard project={project} />
          </div>
        ))}
      </ProjectGrid>
    </div>
  );
};

export default Votes;

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
      props: {},
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      admin: true,
    },
  });
  if (!user?.admin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
  const voteToPoints = {
    [VoteType.FIRST]: 3,
    [VoteType.SECOND]: 2,
    [VoteType.THIRD]: 1,
  };
  const projects = await prisma.project.findMany({
    include: {
      votes: {
        select: {
          place: true,
          user: {
            select: {
              admin: true,
            },
          },
        },
      },
      contributors: {
        select: {
          name: true,
          username: true,
          image: true,
          id: true,
        },
      },
      files: true,
    },
  });
  let totalNormalVotes = 0;
  let totalAdminVotes = 0;
  const projectsWithRawPoints = projects.map((project) => {
    const projectPoints = project.votes.reduce(
      (acc, vote) => {
        const votePoints = voteToPoints[vote.place];
        if (vote.user.admin) {
          totalAdminVotes++;
        } else {
          totalNormalVotes++;
        }
        return {
          normal: acc.normal + (vote.user.admin ? 0 : votePoints),
          admin: acc.admin + (vote.user.admin ? votePoints : 0),
        };
      },
      {
        normal: 0,
        admin: 0,
      }
    );
    return {
      ...project,
      rawPoints: projectPoints,
    };
  });
  const adminMupltiplier =
    totalAdminVotes === 0 ? 0 : totalNormalVotes / totalAdminVotes;
  const projectsWithCalculatedPoints = projectsWithRawPoints.map((project) => {
    return {
      ...project,
      calculatedPoints:
        project.rawPoints.normal + project.rawPoints.admin * adminMupltiplier,
    };
  });

  // console.log(JSON.stringify(projectsWithCalculatedPoints, null, 2));
  projectsWithCalculatedPoints.sort(
    (a, b) => b.calculatedPoints - a.calculatedPoints
  );
  return {
    props: {
      projects: projectsWithCalculatedPoints,
      session,
    },
  };
};
