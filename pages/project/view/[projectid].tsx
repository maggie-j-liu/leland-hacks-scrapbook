import { ProjectCardProps } from "../../../components/ProjectCard";
import prisma from "../../../lib/db";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ViewProject = ({ project }: { project: ProjectCardProps }) => {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-5xl font-black">{project.title}</h1>

      <div className="flex items-center space-x-6 overflow-y-auto">
        {project.files?.map((file) => {
          return <img src={file.url} className="max-h-xl max-h-40" />;
        })}
      </div>
      <ReactMarkdown
        children={project.description}
        remarkPlugins={[remarkGfm]}
        className="prose text-white prose-headings:text-white"
      />
    </div>
  );
};

export default ViewProject;

export async function getServerSideProps(context: any) {
  const { projectid } = context.params;

  let project = await prisma.project.findUnique({
    where: {
      id: projectid,
    },
    include: {
      files: true,
      contributors: true,
    },
  });

  if (!project) {
    return {
      notFound: true,
    };
  }

  console.log(project);

  return {
    props: { project }, // will be passed to the page component as props
  };
}
