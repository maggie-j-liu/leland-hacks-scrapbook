import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { HiOutlineLogout } from "react-icons/hi";
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

          {status === "loading" ? null : (
            <div className="relative flex items-center space-x-2 rounded-lg py-1 px-2 dark:bg-gray-700 sm:space-x-3 sm:px-3">
              {status === "unauthenticated" ? (
                <Link href="sign-in">
                  <a>Sign In</a>
                </Link>
              ) : (
                <>
                  <ProfilePicture
                    username={session!.user.username}
                    image={session!.user.image}
                    id={session!.user.id}
                    variant="small"
                  />
                  <div>
                    {session!.user.name ? (
                      <p className="font-extrabold dark:text-white">
                        {session?.user.name}
                      </p>
                    ) : null}
                    <p className="text-xs font-bold">
                      @{session!.user.username}
                    </p>
                  </div>

                  <button
                    className="peer"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    <HiOutlineLogout className="h-6 w-6" />
                  </button>
                  <div className="absolute -bottom-4 right-0 rounded px-2 py-0.5 text-sm opacity-0 duration-200 peer-hover:opacity-100 peer-hover:duration-150 dark:bg-primary-500/50">
                    Sign Out
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
      <div className="h-6" />
    </>
  );
};
