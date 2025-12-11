"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <>
      <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">
        welcome to youtube
      </div>

      <div className="grid w-full max-w-sm items-center gap-3 mt-3">
        <Label htmlFor="email">Email</Label>
        <Input className="bg-input" type="email" id="email" placeholder="Email" />
      </div>

      <div className="grid w-full max-w-sm items-center gap-3 mt-3">
        <Label htmlFor="password">Password</Label>
        <Input className="bg-input" type="password" id="password" placeholder="Password" />
      </div>

      <Button className="mt-5">Sign In</Button>

      <p className="my-14 text-sm font-light">
        Don't have an account?
        <Link
          className="cursor-pointer font-bold hover:underline"
          href={"/signup"}
        >
          {" "}
          Sign up to new account
        </Link>
      </p>
    </>
  );
}
