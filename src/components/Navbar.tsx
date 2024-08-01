"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { LogoutCard } from "./LogoutCard"; // Import LogoutCard component

export function NavBar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [showLogoutCard, setShowLogoutCard] = useState(false); // State to control LogoutCard visibility

  return (
    <div className="flex items-center min-w-full w-full fixed justify-center p-2 z-[50] mt-[2rem]">
      <div className="flex justify-between md:w-[720px] w-[95%] border dark:border-zinc-900 dark:bg-black bg-opacity-10 relative backdrop-filter backdrop-blur-lg bg-gray-900 border-white border-opacity-20 rounded-xl p-2 shadow-lg">
        <Dialog>
          <SheetTrigger className="min-[825px]:hidden p-2 transition flex justify-center items-center">
            <MenuIcon />
            <Link href={session ? "/dashboard" : "/"} className="pl-2 ml-24">
              <span className="text-black font-extrabold text-lg">
                Feedback <span className="text-red-600 mt-4">Fusion</span>
              </span>
            </Link>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className=" mt-64">
                <Link href="/dashboard" className="pl-2">
                  <span className="text-black font-extrabold text-md">
                    Feedback <span className="text-red-600 mt-4">Fusion</span>
                  </span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 z-[99] mt-8">
              <DialogClose asChild>
                <Link href="/">
                  <Button variant="outline" className="w-full font-bold">
                    Home
                  </Button>
                </Link>
              </DialogClose>

              {session ? (
                <DialogClose asChild>
                  <Link href="/">
                    <Button
                      onClick={() => signOut()}
                      className="w-full font-bold text-red-600 hover:text-red-600"
                      variant="outline"
                    >
                      Logout
                    </Button>
                  </Link>
                </DialogClose>
              ) : (
                <DialogClose asChild>
                  <Link href="/sign-in">
                    <Button className="w-full font-bold" variant="outline">
                      Login
                    </Button>
                  </Link>
                </DialogClose>
              )}

              {!session && (
                <DialogClose asChild>
                  <Link href="/sign-up">
                    <Button
                      onClick={() => signOut()}
                      className="w-full font-bold"
                      variant="outline"
                    >
                      Register
                    </Button>
                  </Link>
                </DialogClose>
              )}
            </div>
          </SheetContent>
        </Dialog>
        <NavigationMenu>
          <NavigationMenuList className="max-[825px]:hidden">
            <Link href="/" className="pl-2">
              <span className="text-black font-extrabold text-xl">
                Feedback <span className="text-red-500 mt-4">Fusion</span>
              </span>
            </Link>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex-grow flex items-center justify-center">
          {session ? (
            <span className="mr-4 hidden md:inline">
              Welcome,{" "}
              <span className="text-red-600 font-bold">
                {user?.username || user?.email}
              </span>
            </span>
          ) : (
            <div className="flex items-center ml-auto">
              <Link href="/sign-in">
                <Button
                  className="hidden md:inline w-auto text-black bg-[#f8f6f6] font-bold"
                  variant="ghost"
                >
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  className="hidden md:inline bg-[#f8f6f6] ml-4 font-bold"
                  variant="ghost"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center">
          {session && (
            <Button
              onClick={() => setShowLogoutCard(true)} // Show LogoutCard on click
              className="hidden md:inline w-full md:w-auto text-black font-bold bg-[#f0efef]"
              variant="ghost"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
      {showLogoutCard && (
        <LogoutCard
          onConfirm={() => {
            signOut();
            setShowLogoutCard(false);
          }}
          onCancel={() => setShowLogoutCard(false)}
        />
      )}
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
