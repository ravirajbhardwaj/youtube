"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  return (
    <>
      <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">
        signup to youtube
      </div>

      <div className="grid w-full max-w-sm items-center gap-3 mt-3">
        <Label htmlFor="email">Email</Label>
        <Input className="bg-input" type="email" id="email" placeholder="Email" />
      </div>

      <div className="grid w-full max-w-sm items-center gap-3 mt-3">
        <Label htmlFor="username">UserName</Label>
        <Input className="bg-input" type="text" id="username" placeholder="UserName" />
      </div>

      <div className="grid w-full max-w-sm items-center gap-3 mt-3">
        <Label htmlFor="fullname">FullName</Label>
        <Input className="bg-input" type="text" id="fullname" placeholder="Fullname" />
      </div>

      <div className="grid w-full max-w-sm items-center gap-3 mt-3">
        <Label htmlFor="password">Password</Label>
        <Input className="bg-input" type="password" id="password" placeholder="Password" />
      </div>

      <Button className="mt-5">Sign Up</Button>

      <p className="my-14 text-sm font-light">
        Already registered?
        <Link
          className="cursor-pointer font-bold hover:underline"
          href={"/signin"}
        >
          {" "}
          Sign in to your account
        </Link>
      </p>
    </>
  );
}
