"use clinet"
import Image from "next/image"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Input } from "./ui/input";
import { Search } from "lucide-react";


export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-white px-4 bg-background text-foreground">
      <nav className="mx-auto flex max-w-7xl items-center py-2">
        <div className="mr-4 w-12 shrink-0 sm:w-16">
          <Image src={"/favicon.ico"} alt="youtube" width={40} height={20} />
        </div>
        <div className="relative mx-auto hidden w-full max-w-md overflow-hidden sm:block">
          <Input className="w-full border bg-transparent py-1 pl-8 pr-3 outline-none sm:py-2"
            placeholder="Search" />
          <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2">
            <Search className="h-4 w-4" />
          </span>
        </div>
        <button className="ml-auto sm:hidden">
          <Search className="h-4 w-4" />
        </button>
        <div className="fixed inset-y-0 right-0 flex w-full max-w-xs shrink-0 translate-x-full flex-col border-l  duration-200 hover:translate-x-0 peer-focus:translate-x-0 sm:static sm:ml-4 sm:w-auto sm:translate-x-0 sm:border-none">
          <Avatar className="mb-8 mt-auto flex w-full flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0 rounded-lg" >
            <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
          </Avatar>
        </div>
      </nav>
    </header>
  )
}
