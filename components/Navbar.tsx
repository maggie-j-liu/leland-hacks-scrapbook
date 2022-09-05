import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import ProfilePicture from "./ProfilePicture";

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
            {status === "loading" ? null : status === "unauthenticated" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  signIn("google");
                }}
              >
                Sign In
              </button>
            ) : (
              <>
                <ProfilePicture
                  username={session!.user.username}
                  image={session!.user.image}
                  className="w-8"
                />
                <div>
                  <p className="font-extrabold dark:text-white">
                    {session?.user.name}
                  </p>
                  <p className="text-xs font-bold">@{session?.user.username}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="h-6" />
    </>
  );
};
