"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()

  const handleRedirect = () => {
    router.push('/signin')
  }

  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground">
      <div className="mx-auto my-8 flex w-full max-w-sm flex-col px-4">
        <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">
          signup to youtube
        </div>

        <div className="grid w-full max-w-sm items-center gap-3 mt-3">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>

        <div className="grid w-full max-w-sm items-center gap-3 mt-3">
          <Label htmlFor="username">UserName</Label>
          <Input type="text" id="username" placeholder="UserName" />
        </div>

        <div className="grid w-full max-w-sm items-center gap-3 mt-3">
          <Label htmlFor="fullname">FullName</Label>
          <Input type="text" id="fullname" placeholder="Fullname" />
        </div>

        <div className="grid w-full max-w-sm items-center gap-3 mt-3">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" placeholder="Password" />
        </div>

        <Button className="mt-5">Sign Up</Button>

        <p className="my-14 text-sm font-light">
          Already registered?
          <span className="cursor-pointer font-bold hover:underline" onClick={handleRedirect}> Sign in to your account</span>
        </p>
      </div>
    </div>
  )
}