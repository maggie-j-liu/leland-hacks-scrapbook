interface ProjectCardProps {
  id: string;
  contributors: User[];
  files: File[];
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

export const ProjectCard: React.FC<ProjectCardProps> = (project) => {};
