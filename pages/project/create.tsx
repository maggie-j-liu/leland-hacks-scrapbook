import { HiOutlineTrash } from "react-icons/hi";
import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";
import { useSession } from "next-auth/react";

const ContributorCard = ({
  username,
  image,
  onDelete,
}: {
  username: string;
  image: string;
  onDelete?: Function;
}) => {
  return (
    <div className="mx-auto flex max-w-4xl items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-800">
      <div className="flex items-center space-x-4">
        <img
          alt={`@${username}'s profile picture`}
          src={image}
          className="h-12 w-12"
          referrerPolicy="no-referrer"
        />
        <div className="space-y py-2">
          <p className="font-medium">@{username}</p>
        </div>
      </div>
      {onDelete ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <HiOutlineTrash
            size={20}
            color="red"
            className="transition ease-in-out hover:-translate-y-1"
          />
        </button>
      ) : null}
    </div>
  );
};
interface Contributor {
  id: string;
  name: string;
  username: string;
  image: string;
}
const CreateProject = () => {
  const [files, setFiles] = useState<any>([]);
  const [contributorSearch, setContributorSearch] = useState("");
  const [contributorSearchError, setContributorSearchError] = useState("");
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const { data: session, status } = useSession();
  console.log(session);

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

  if (status === "loading") {
    return null;
  }
  if (status === "unauthenticated") {
    return <div>Please sign in</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="space-y flex flex-col">
        <label htmlFor="title" className="font-semibold">
          Title of Project
        </label>
        <input
          type="text"
          name="title"
          className="rounded-lg border border-primary-300 px-2 py-1"
        />
      </div>

      <div className="space-y flex flex-col">
        <label htmlFor="description" className="font-semibold">
          Description
        </label>
        <textarea
          name="description"
          className="rounded-lg border border-primary-300 px-2 py-1"
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
            className="rounded-lg border border-primary-300 px-2 py-1"
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
      {/* <FileUploader
        name="file"
        handleChange={(file: any) => {
          files.length > 0 ? setFiles([...files, file]) : setFiles([file]);
          console.log(file, files);
        }}
        multiple
        types={["JPG", "PNG", "GIF", "MP4"]}
        classes="mx-auto"
      /> */}

      <input
        name="image"
        type="file"
        className="mx-auto"
        accept="image/*, video*/"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            const fd = new FormData();
            Array.from(e.target.files).forEach((file) => {
              fd.append("files", file);
            });

            fetch("/api/upload-files", {
              method: "POST",
              body: fd,
            });

            console.log(e.target.files);
          }
        }}
      />
    </div>
  );
};

export default CreateProject;
