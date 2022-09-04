import { HiOutlineTrash } from "react-icons/hi";

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
        <img
          alt={`@${username}'s profile picture`}
          src={image}
          className="h-10 w-10 rounded-full"
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

export default ContributorCard;
