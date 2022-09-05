import { HiOutlineTrash } from "react-icons/hi";
import ProfilePicture from "./ProfilePicture";

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
    <div className="mx-auto flex max-w-4xl items-center justify-between rounded-lg px-3 py-2 dark:bg-gray-700">
      <div className="flex items-center space-x-4">
        <ProfilePicture username={username} image={image} className="w-10" />
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
            className="text-red-300 transition ease-in-out hover:-translate-y-1"
          />
        </button>
      ) : null}
    </div>
  );
};

export default ContributorCard;
