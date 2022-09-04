import { useSession } from "next-auth/react";

export const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <div className="flex items-center space-x-3 px-4 py-2 dark:bg-gray-800">
        <img src={session?.user.image} className="h-8 w-8 rounded-full" />
        <div>
          <p className="font-bold dark:text-white">{session?.user.name}</p>
          <p className="text-sm font-semibold">@{session?.user.username}</p>
        </div>
      </div>
    </div>
  );
};
