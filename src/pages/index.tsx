import { type NextPage } from "next";
import Head from "next/head";
//import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';

//import { api } from "~/utils/api";
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { status } = useSession();

  const [email, setEmail] = useState('');
  const router = useRouter();

  const emailRegex = /([A-Za-z0-9-_.])+@([A-Za-z0-9-_.])+\.([A-Za-z])+/;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!emailRegex.test(email)) {
      return;
    }

    signIn('email', { email: email, callbackUrl: '/profile' }).then(res => {
      console.log(res);
    }).catch(err => {
      console.error(err);
    })
  }

  useEffect(() => {
    if (status === 'authenticated' && router) {
      void router.push(`/profile`);
    }
  }, [status, router]);

  return (
    <>
      <Head>
        <title>I Choose Who?</title>
        <meta
          name="description"
          content="The premier app for type comparisons and battle strategy"
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="relative flex min-h-screen flex-col items-center bg-gradient-to-t from-[#c6f2ff] to-[#ffffff]">
        <div className="mt-10 flex min-w-full flex-col items-center rounded-lg py-5 md:w-2/3 md:min-w-min md:max-w-5xl shadow-inner shadow-zinc-400/30 bg-[#c6f2ff]/25">
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src="/logo.png"
            style={{ maxWidth: "500px" }}
            alt="I choose Who in the Pokemon Font"
          />
          <div className="mt-10">
            <form
              onSubmit={submit}
            >
            <input
              type='email'
              className='mr-5 py-1 px-2 rounded shadow-inner shadow-zinc-400/30 text-zinc-600'
              placeholder='email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="btn"
            >
              Sign in
            </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
