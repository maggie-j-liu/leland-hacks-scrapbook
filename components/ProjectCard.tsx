import { ProjectCardType } from "../pages";
import { Media } from "../pages/api/upload-files";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const ProjectCard = ({ project }: { project: ProjectCardType }) => {
  return (
    <div className="mb-4 w-full space-y-4 rounded-lg p-6 dark:bg-gray-800">
      <h3 className="text-center text-xl font-semibold">{project.title}</h3>
      {/* {JSON.stringify(project)} */}
      <ReactMarkdown
        className="prose dark:prose-invert"
        remarkPlugins={[remarkGfm]}
      >
        {project.description}
      </ReactMarkdown>
      <img
        alt="project image"
        src={project.files[0].url}
        className="mx-auto w-full max-w-sm rounded-lg"
      />
      <div className="flex space-x-2">
        {project.contributors.map((contributor, i) => {
          return (
            <div key={i} className="group">
              <img
                alt={`@${contributor.username}'s profile picture`}
                src={contributor.image!}
                className="h-8 w-8 rounded-full"
              />

              <div className="absolute mt-1 rounded-md px-2 font-semibold opacity-0 transition ease-in-out group-hover:opacity-100 dark:bg-[#4E4C59]">
                @{contributor.username}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
