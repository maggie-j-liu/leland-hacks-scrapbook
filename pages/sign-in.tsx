import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { SiGoogle } from "react-icons/si";
import { HiOutlineMail } from "react-icons/hi";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const signInWithEmail = () => {
    if (
      emailInputRef.current !== null &&
      !emailInputRef.current.validity.valid
    ) {
      setError(emailInputRef.current.validationMessage);
      return;
    }
    signIn("email", { email });
    setError("");
    setEmail("");
  };
  return (
    <div className="px-4">
      <h1 className="text-center text-3xl text-primary-200">Sign In</h1>
      <h2 className="mx-auto mb-8 max-w-lg text-center text-primary-50">
        Sign in with the email you registered with. If you need to use a
        different email, let an organizer know!
      </h2>
      <div className="mx-auto w-80">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-secondary-300 to-green-300 py-2 px-2 text-black duration-300 hover:scale-110 hover:duration-150"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            signIn("google");
          }}
        >
          <SiGoogle />
          Sign in with Google
        </button>
        <div className="my-8 w-full text-center">OR</div>
        <label htmlFor="email">Email</label>
        <input
          ref={emailInputRef}
          className="h-11 w-full rounded-md border-2 bg-gray-700 py-2 px-4 invalid:border-red-200 focus:outline-none valid:focus:border-primary-200"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              signInWithEmail();
            }
          }}
        />
        {error.length > 0 ? (
          <p className="text-sm text-red-300">{error}</p>
        ) : null}
        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-primary-300 to-orange-300 px-2 py-2 text-black duration-300 hover:scale-110 hover:duration-150"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            signInWithEmail();
          }}
        >
          <HiOutlineMail className="h-6 w-6" />
          Send Magic Link
        </button>
      </div>
    </div>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
