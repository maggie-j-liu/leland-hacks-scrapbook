import { ProjectCardType } from "../pages";
import { Media } from "../pages/api/upload-files";
import remarkGfm from "remark-gfm";
import Markdown from "./Markdown";
import { File, User } from "@prisma/client";

export const ProjectCard = ({
  project,
}: {
  project: {
    title: string;
    description: string;
    contributors: Omit<User, "email" | "emailVerified">[];
    files: File[];
  };
}) => {
  return (
    <div className="mb-4 w-full space-y-4 rounded-lg p-6 dark:bg-gray-800">
      <h3 className="text-center text-xl font-semibold">{project.title}</h3>
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
