import { useSession } from "next-auth/react";
import Link from "next/link";

export const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <nav className="flex justify-between px-4 py-2">
        <Link href="/">
          <a className="flex items-center space-x-4">
            <img src="/lelandhacks.svg" className="h-auto w-8" />
            <h3 className="hidden text-xl font-extrabold sm:block">
              Submissions
            </h3>
          </a>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-6">
          <Link href="/project/create">
            <a>
              <span className="hidden sm:inline">Create </span>Post
            </a>
          </Link>
          <div className="flex items-center space-x-2 rounded-lg py-1 px-2 dark:bg-gray-700 sm:space-x-3 sm:px-3">
            <img src={session?.user.image} className="h-8 w-8 rounded-full" />
            <div>
              <p className="font-extrabold dark:text-white">
                {session?.user.name}
              </p>
              <p className="text-xs font-bold">@{session?.user.username}</p>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-6" />
    </>
  );
};
