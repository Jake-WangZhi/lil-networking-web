"use client";

import { Button } from "@/components/Button";
import { Typography } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen flex-col justify-center px-8 space-y-4">
      <h1 className="flex flex-col text-light-blue text-start text-5xl font-bold tracking-tight leading-72 md:text-7xl">
        <span className="text-3xl md:text-5xl leading-48">Lil</span>
        <span className="text-white">Networking</span>
        App
      </h1>
      <div className="w-1/12 h-[202px] border-l-4 border-light-blue"></div>
      <Typography variant="h3">
        Build networking habits & <br />
        reach your goals
      </Typography>
      <div className="flex justify-center !mt-32">
        <Button
          variant="contained"
          onClick={() => signIn("linkedin", { callbackUrl: "/dashboard" })}
        >
          Sign in with LinkedIn
        </Button>
      </div>
    </main>
  );
}
