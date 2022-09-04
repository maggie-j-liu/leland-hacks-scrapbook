import { useState } from "react";
import { useSession } from "next-auth/react";
import { File } from "@prisma/client";
import ContributorCard from "../../components/ContributorCard";
import { ProjectCard } from "../../components/ProjectCard";

interface Contributor {
  id: string;
  name: string;
  username: string;
  image: string;
}
const CreateProject = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [contributorSearch, setContributorSearch] = useState("");
  const [contributorSearchError, setContributorSearchError] = useState("");
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: session, status } = useSession();

  const searchForUser = async () => {
    if (contributorSearch.length === 0) {
      return;
    }
    if (
      contributors.find((c) => c.username === contributorSearch) ||
      contributorSearch === session!.user?.username
    ) {
      setContributorSearch("");
      setContributorSearchError("");
      return;
    }
    const res = await fetch("/api/search-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: contributorSearch.trim() }),
    });
    if (!res.ok) {
      if (res.status == 404) {
        setContributorSearchError(
          "User not found. Make sure you entered the username correctly."
        );
      } else {
        setContributorSearchError("Something went wrong :(. Please try again.");
      }
    } else {
      setContributorSearchError("");
      const contributor = await res.json();
      setContributors((cList) => [...cList, contributor]);
      setContributorSearch("");
    }
  };

  const removeContributor = (contributorId: string) => {
    setContributors((cList) => cList.filter((c) => c.id !== contributorId));
  };

  const createProject = async () => {
    await fetch("/api/create-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        contributors: contributors.map((c) => c.id),
        files,
      }),
    });
  };

  if (status === "loading") {
    return null;
  }
  if (status === "unauthenticated") {
    return <div>Please sign in</div>;
  }

  return (
    <div className="px-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-x-8 lg:flex-row">
        <div className="flex-grow space-y-8">
          <div className="flex flex-col">
            <label htmlFor="title" className="font-semibold">
              Title of Project
            </label>
            <input
              type="text"
              name="title"
              className="rounded-lg border-2 border-primary-300 px-2 py-1 dark:bg-gray-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y flex flex-col">
            <label htmlFor="description" className="font-semibold">
              Description
            </label>
            <textarea
              name="description"
              className="rounded-lg border-2 border-primary-300 px-2 py-1 dark:bg-gray-800"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y flex flex-col">
              <label htmlFor="contributors" className="font-semibold">
                Contributors
              </label>
              <input
                name="contributors"
                type="text"
                value={contributorSearch}
                onChange={(e) => setContributorSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    searchForUser();
                  }
                }}
                placeholder="Type project member's username here"
                className="rounded-lg border-2 border-primary-300 px-2 py-1 dark:bg-gray-800"
              />
              {contributorSearchError.length > 0 ? (
                <p>{contributorSearchError}</p>
              ) : null}
            </div>

            <div className="space-y-4">
              <ContributorCard
                username={session!.user.username}
                image={session!.user.image}
              />
              {contributors.map((contributor) => {
                return (
                  <ContributorCard
                    {...contributor}
                    key={contributor.id}
                    onDelete={() => removeContributor(contributor.id)}
                  />
                );
              })}
            </div>
          </div>

          <input
            name="image"
            type="file"
            className="mx-auto block w-full"
            accept="image/*, video*/"
            multiple
            onChange={async (e) => {
              if (e.target.files) {
                const fd = new FormData();
                Array.from(e.target.files).forEach((file, i) => {
                  fd.append(file.name, file);
                });

                const media = await fetch("/api/upload-files", {
                  method: "POST",
                  body: fd,
                });

                const newFiles = await media.json();
                setFiles((f) => [...f, ...newFiles]);
                e.target.value = "";
                // console.log(e.target.files);
              }
            }}
          />

          {files.map((file: any) => {
            return (
              <div key={file.url}>
                <img className="w-32" src={file.url} alt="uploaded image" />
              </div>
            );
          })}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              createProject();
            }}
          >
            Submit
          </button>
        </div>

        <div className="w-full max-w-md">
          <ProjectCard
            project={{
              title: title.length > 0 ? title : "[Your title here!]",
              description:
                description.length > 0
                  ? description
                  : `Your description here!
Markdown is supported.

Use \`#\` to create headings, like so:
# Heading 1

You can also \\*\\***bold**\\*\\*, \\**italicize*\\*, and \\~\\~~~strikethrough~~\\~\\~ text.

Add links like this: \\[[Leland Hacks Website](https://lelandhacks.com)\\](https://lelandhacks.com)
`,
              contributors: [session!.user, ...contributors],
              files,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
