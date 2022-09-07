import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { signIn } from "next-auth/react";
import { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  return (
    <div>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            signIn("email", { email });
          }
        }}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          signIn("email", { email });
        }}
      >
        Send Magic Link
      </button>
      <div>OR</div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          signIn("google");
        }}
      >
        Sign in with Google
      </button>
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
