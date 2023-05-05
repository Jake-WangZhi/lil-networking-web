"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";

// Prisma does not support Edge without the Data Proxy currently
export const runtime = "nodejs"; // default
export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [router, session]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <ClipLoader color="#36d7b7" />
    </main>
  );
}
