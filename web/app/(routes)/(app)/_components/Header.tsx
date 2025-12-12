"use client";

import {
  CircleQuestionMark,
  Heart,
  History,
  Home,
  ListVideo,
  SearchIcon,
  Settings,
  TableOfContents,
  UserCheck,
  Video,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  {
    name: "Home",
    mobileView: true,
    icon: <Home />,
  },
  {
    name: "Liked Videos",
    mobileView: false,
    icon: <Heart />,
  },
  {
    name: "History",
    mobileView: true,
    icon: <History />,
  },
  {
    name: "My Content",
    mobileView: false,
    icon: <Video />,
  },
  {
    name: "Collections",
    mobileView: true,
    icon: <ListVideo />,
  },
  {
    name: "Subscribers",
    mobileView: true,
    icon: <UserCheck />,
  },
  {
    name: "Support",
    mobileView: false,
    icon: <CircleQuestionMark />,
  },
  {
    name: "Settings",
    mobileView: false,
    icon: <Settings />,
  },
];

export default function Header() {
  const [avatar, setAvatar] = useState("");

  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full border-b px-4 bg-background text-foreground">
      <nav className="mx-auto flex max-w-7xl items-center py-2">
        <div className="mr-4 w-12 shrink-0 sm:w-16">
          <Image src="/youtube.png" width={40} height={40} alt="Logo" />
        </div>
        <div className="relative mx-auto hidden w-full max-w-md overflow-hidden sm:block">
          <Input
            className="bg-input w-full py-1 pl-8 pr-3 outline-none sm:py-2"
            placeholder="Search"
            id="search"
          />
          <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2">
            <SearchIcon className="h-4 w-4" />
          </span>
        </div>
        <Button className="ml-auto sm:hidden bg-background text-foreground">
          <SearchIcon className="h-6 w-6" />
        </Button>
        <ModeToggle />
        <Button className="group peer ml-4 flex w-6 shrink-0 flex-wrap gap-y-1.5 sm:hidden bg-background text-foreground">
          <TableOfContents />
        </Button>
        <div className="fixed inset-y-0 right-0 flex w-full max-w-xs shrink-0 translate-x-full flex-col border-l duration-200 hover:translate-x-0 peer-focus:translate-x-0 sm:static sm:ml-4 sm:w-auto sm:translate-x-0 sm:border-none bg-background text-foreground">
          <div className="relative flex w-full items-center justify-between border-b px-4 py-2 sm:hidden">
            <Button className="inline-block w-8 bg-background text-foreground">
              <XCircleIcon className="h-6" />
            </Button>
          </div>
          <ul className="my-4 flex w-full flex-wrap gap-2 px-4 sm:hidden bg-background text-foreground">
            {navItems
              .filter((item) => !item.mobileView)
              .map((item) => (
                <li
                  key={item.name}
                  className="w-full bg-background text-foreground"
                >
                  <Button className="flex w-full items-center justify-start gap-x-4 border px-4 py-1.5 text-left bg-background text-foreground">
                    <span className="inline-block w-full max-w-5 group-hover:mr-4 lg:mr-4">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Button>
                </li>
              ))}
          </ul>
          <div className="mb-8 mt-auto flex w-full flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0">
            <Avatar>
              <AvatarImage src={avatar} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>
    </header>
  );
}
