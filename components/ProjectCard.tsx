import { Media } from "../pages/api/upload-files";

interface ProjectCardProps {
  id: string;
  contributors: User[];
  files: Media[];
  description: string;
  title: string;
  demo?: string;
  github?: string;
}

interface User {
  id?: string;
  name: string;
  username: string;
  email?: string;
  emailVerified?: null;
  image: string;
}

export const ProjectCard = ({ project }: { project: ProjectCardProps }) => {
  return (
    <div className="w-fit space-y-4 rounded-lg bg-gray-800 p-6">
      <h3 className="text-xl font-semibold">{project.title}</h3>
      {/* {JSON.stringify(project)} */}
      <img src={project.files[0].url} className="max-w-lg rounded-lg" />
      <div className="flex space-x-2">
        {project.contributors.map((contributor, i) => {
          return (
            <div key={i} className="group">
              <img src={contributor.image} className=" h-8 w-8 rounded-full" />

              <div className="absolute mt-1 rounded-md bg-[#4E4C59] px-2 font-semibold opacity-0 transition ease-in-out group-hover:opacity-100">
                @{contributor.username}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
