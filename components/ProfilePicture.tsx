const ProfilePicture = ({
  username,
  image,
  className,
}: {
  username: string;
  image: string;
  className: string;
}) => {
  return (
    <img
      alt={`@${username}'s profile picture`}
      src={image}
      className={`${className} aspect-square rounded-full`}
      referrerPolicy="no-referrer"
    />
  );
};

export default ProfilePicture;
