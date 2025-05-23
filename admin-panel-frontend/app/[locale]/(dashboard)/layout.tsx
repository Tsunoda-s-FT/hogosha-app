"use client";

import { Link } from "@/navigation";
import { Bell, CircleUser, Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ToggleMode } from "@/components/toggle-mode";
import { useTranslations } from "next-intl";
import { signIn, signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import NavLinks from "@/components/NavLinks";
import LanguageSelect from "@/components/LanguageSelect";
import { useState } from "react";

const handleSignOut = async () => {
  return await signOut({ callbackUrl: "/" });
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession({
    required: true,
  });
  const t = useTranslations("app");
  const tName = useTranslations("names");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const user = session?.user as User;

  if (session?.error === "RefreshAccessTokenError") handleSignOut();

  return (
    <div className="flex min-h-screen w-full">
      <div className="fixed top-0 bottom-0 left-0 z-20 hidden md:block w-[220px] lg:w-[280px] border-r bg-muted/40 overflow-y-auto">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold leading-none"
            >
              <Package2 className="h-6 w-6" />
              <span className="">{session && session?.schoolName}</span>
            </Link>
            {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">{t("notifications")}</span>
            </Button> */}
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLinks user={user} />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 md:ml-[220px] lg:ml-[280px] min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-[280px] max-w-[80vw]">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-5"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="">{session && session?.schoolName}</span>
                </Link>
                <NavLinks user={user} onLinkClick={() => setIsSheetOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="sm:flex gap-2 hidden">
            <LanguageSelect />
            <ToggleMode />
          </div>
          <div className="flex items-center justify-end w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="cursor-pointer">
                    {user && tName("name", { ...user })}
                  </span>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">{t("account")}</span>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <div>{t("account")}</div>
                    <div className="text-gray-600">{user?.email}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">{t("settings")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>{t("support")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => await signOut()}>
                  {t("logout")}
                </DropdownMenuItem>
                <div className="sm:hidden">
                  <DropdownMenuSeparator />
                  <div className="flex gap-2">
                    <LanguageSelect />
                    <ToggleMode />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
