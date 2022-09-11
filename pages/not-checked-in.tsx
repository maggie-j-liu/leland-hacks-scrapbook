import Link from "next/link";

const NotCheckedIn = () => {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-md sm:max-w-5xl">
        <p className="mt-4 text-xl">
          You don&apos;t seem to be checked in to Leland Hacks.{" "}
          <Link href="/sign-in">
            <a className="dark:text-primary-200 dark:hover:text-primary-300">
              Sign in
            </a>
          </Link>{" "}
          with the email you registered with, or ask an organizer to place your
          email on the allowlist.
        </p>
      </div>
    </div>
  );
};

export default NotCheckedIn;
