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
    <div className="px-4">
      <div className="mx-auto max-w-md sm:max-w-7xl">
        <h1 className="mb-8 text-center text-3xl text-secondary-200">Votes</h1>
        <div>
          total peer votes: {props.totalNormalVotes} ~ total peers voted:{" "}
          {props.totalNormalVotes! / 3}
        </div>
        <div>
          total judge votes: {props.totalAdminVotes} ~ total judges voted:{" "}
          {props.totalAdminVotes! / 3}
        </div>
        <div>key: final score / peer points / judge points</div>
        <div className="h-6" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id}>
              {project.calculatedPoints.toFixed(5)} / {project.rawPoints.normal}{" "}
              / {project.rawPoints.admin}
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Votes;

export const getServerSideProps = async ({
  req,
  res,
  query,
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
    where: {
      ship: true,
      beginner: query.beginner === "true" ? true : undefined,
    },
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
  const projectsWithCalculatedPoints = projectsWithRawPoints.map((project) => {
    return {
      ...project,
      calculatedPoints:
        (totalNormalVotes === 0
          ? 0
          : project.rawPoints.normal / totalNormalVotes) +
        (totalAdminVotes === 0 ? 0 : project.rawPoints.admin / totalAdminVotes),
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
      totalAdminVotes,
      totalNormalVotes,
    },
  };
};
