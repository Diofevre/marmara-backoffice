"use client";

import * as React from "react";
import { Menu, X, ChefHat, ListOrdered, TicketPercent, BlendIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

// Sample data
const data = {
  teams: [
    {
      name: "MARMARA SPRA",
      logo: ChefHat,
      plan: "Burger and Pizza",
    },
  ],
  navMain: [
    {
      title: "Menues - Dishes",
      url: "/menues",
      icon: ChefHat,
      isActive: true,
    },
    {
      title: "Promotions",
      url: "/promotions",
      icon: TicketPercent,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ListOrdered,
      isActive: true,
    },
    {
      title: "Pack",
      url: "/packs",
      icon: BlendIcon,
      isActive: true,
    },
  ],
};

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="border-r border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-1.5 rounded-md bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 w-64`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-none h-16 flex items-center px-8">
            <Link href="/">
              <h1 className="text-base font-semibold text-gray-800 dark:text-white uppercase">
                {data.teams[0].name}
              </h1>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-8">
              <div>
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-4">
                  Navigation
                </h2>
                <div className="space-y-1">
                  {data.navMain.map((item) => (
                    <Link
                      key={item.url}
                      href={item.url}
                      className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        pathname === item.url
                          ? "bg-[#FE724C]/5 dark:bg-indigo-900/50 text-black dark:text-indigo-300 border-l-2 border-[#FE724C]"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <span className="mr-3">
                        <item.icon className="w-5 h-5" />
                      </span>
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
          <div className="flex-none px-6 py-2">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8",
                  userButtonAvatarImage: "rounded-full",
                },
              }}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}