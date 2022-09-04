import { useSession } from "next-auth/react";
import Link from "next/link";

export const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <div className="mb-6 flex justify-between px-4 py-2">
      <div className="flex items-center space-x-4">
        <img src="/lelandhacks.svg" className="h-auto w-10" />
        <h3 className="text-xl font-extrabold">Submissions</h3>
      </div>
      <div className="flex items-center space-x-6">
        <Link href="/project/create">
          <a>Create Post</a>
        </Link>
        <div className="flex items-center space-x-3 rounded-lg px-6 dark:bg-gray-800">
          <img src={session?.user.image} className="h-10 w-10 rounded-full" />
          <div>
            <p className="font-extrabold dark:text-white">
              {session?.user.name}
            </p>
            <p className="text-xs font-bold">@{session?.user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
