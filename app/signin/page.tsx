"use client";

import { AddToHomeScreenBanner } from "@/components/AddToHomeScreenBanner";
import { Button } from "@/components/Button";
import { Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useCallback } from "react";
import { ArrowsClockwise, Notepad, UsersThree } from "@phosphor-icons/react";
import logo from "@/public/icons/logo.png";
import Image from "next/image";

export default function SignInPage() {
  const handleLinkedinClick = useCallback(
    () =>
      signIn("linkedin", { callbackUrl: "/dashboard" }, { prompt: "login" }),
    []
  );

  const handleGoogleClick = useCallback(
    () => signIn("google", { callbackUrl: "/dashboard" }, { prompt: "login" }),
    []
  );

  return (
    <main className="relative flex flex-1 flex-col justify-center items-center h-screen gap-14">
      <div className="flex flex-col items-center">
        <Image src={logo} alt="Logo" width={186} height={186} />
        <Typography variant="h2">Lil&apos; Networking App</Typography>
      </div>

      <div className="space-y-6">
        <div className="flex space-x-4 items-center">
          <Notepad
            color="white"
            size={32}
            className="md:w-10 md:h-10 lg:w-12 lg:h-12"
          />
          <Typography variant="h3">Build Networking Habits</Typography>
        </div>
        <div className="flex space-x-4 items-center">
          <UsersThree
            color="white"
            size={32}
            className="md:w-10 md:h-10 lg:w-12 lg:h-12"
          />
          <Typography variant="h3">Maintain Relationships</Typography>
        </div>
        <div className="flex space-x-4 items-center">
          <ArrowsClockwise
            color="white"
            size={32}
            className="md:w-10 md:h-10 lg:w-12 lg:h-12"
          />
          <Typography variant="h3">Stay Connected</Typography>
        </div>
      </div>

      <div className="flex justify-center flex-col mt-16 gap-8">
        <Button variant="contained" onClick={handleLinkedinClick}>
          Sign in with LinkedIn
        </Button>
        <Button variant="contained" onClick={handleGoogleClick}>
          &nbsp;Sign in with Google&nbsp;
        </Button>
      </div>
      <AddToHomeScreenBanner addBottomPadding={false} />
    </main>
  );
}
