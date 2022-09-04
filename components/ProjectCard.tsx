import Markdown from "./Markdown";
import { File, User } from "@prisma/client";
import Link from "next/link";

export const ProjectCard = ({
  project,
  className = "",
}: {
  project: {
    id?: string;
    title: string;
    description: string;
    contributors: Omit<User, "email" | "emailVerified">[];
    files: File[];
  };
  className?: string;
}) => {
  return (
    <div
      className={`${className} mb-4 w-full space-y-4 rounded-lg p-6 dark:bg-gray-800`}
    >
      {"id" in project ? (
        <Link href={`/project/view/${project.id}`}>
          <a className="mx-auto block w-fit">
            <h2 className="text-center text-xl font-semibold hover:underline">
              {project.title}
            </h2>
          </a>
        </Link>
      ) : (
        <h2 className="text-center text-xl font-semibold">{project.title}</h2>
      )}

      {/* {JSON.stringify(project)} */}
      <Markdown>{project.description}</Markdown>
      {project.files.map((file) => {
        return (
          <img
            key={file.url}
            alt="project image"
            src={file.url}
            className="mx-auto w-full max-w-sm rounded-lg"
          />
        );
      })}

      <div className="flex space-x-2">
        {project.contributors.map((contributor, i) => {
          return (
            <div key={i}>
              <img
                alt={`@${contributor.username}'s profile picture`}
                src={contributor.image!}
                className="peer h-8 w-8 rounded-full"
              />
              <div className="absolute mt-1 -translate-x-[calc(50%-1rem)] rounded-md px-2 font-semibold opacity-0 transition ease-in-out peer-hover:opacity-100 dark:bg-[#4E4C59]">
                @{contributor.username}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
