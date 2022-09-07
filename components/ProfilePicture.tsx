import Avatar from "boring-avatars";
const ProfilePicture = ({
  username,
  id,
  image,
  variant,
}: {
  username: string;
  id: string;
  image: string | null;
  variant: "small" | "large";
}) => {
  if (image) {
    return (
      <img
        alt={`@${username}'s profile picture`}
        src={image}
        className={`${
          variant === "small" ? "w-8" : "w-10"
        } aspect-square rounded-full`}
        referrerPolicy="no-referrer"
      />
    );
  } else {
    return (
      <Avatar name={id} variant="marble" size={variant === "small" ? 32 : 40} />
    );
  }
};

export default ProfilePicture;
