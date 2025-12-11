"use client";
import Link from "next/link";
import { navItems } from "@/components/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  return (
    <aside className="group fixed inset-x-0 bottom-0 z-40 w-full shrink-0 border-t px-2 py-2 sm:absolute sm:inset-y-0 sm:max-w-[70px] sm:border-r sm:border-t-0 sm:py-6 sm:hover:max-w-[250px] lg:sticky lg:max-w-[250px] bg-sidebar text-sidebar-foreground">
      <ul className="flex justify-around gap-y-2 sm:sticky sm:top-[106px] sm:min-h-[calc(100vh-130px)] sm:flex-col">
        {navItems.map((item, i, arr) => (
          <li
            key={item.name}
            className={cn(
              item.mobileView ? "" : "hidden sm:block",
              arr.length - i === 2 ? "mt-auto" : "",
            )}
          >
            <Link
              href={`/${item.name.toLocaleLowerCase()}`}
              className="flex flex-col items-center justify-center py-1 sm:w-full sm:flex-row sm:border sm:p-1.5 sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 bg-background text-foreground">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                {item.icon}
              </span>
              <span className="block sm:hidden sm:group-hover:inline lg:inline">
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
