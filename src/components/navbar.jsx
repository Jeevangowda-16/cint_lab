"use client";

import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const { isAuthenticated, isAdmin } = useAdminAuth();

    return (
        <nav className="sticky top-6 z-50">
            <div className="max-w-[90rem] mx-auto px-4 md:px-6 lg:px-10">

                <div className="
      flex flex-col md:flex-row md:items-center md:justify-between gap-3
      px-8 md:px-10 py-4
      rounded-2xl
      bg-white/80 backdrop-blur-md
      border border-gray-200
      shadow-sm hover:shadow-md
      transition-all duration-300
    ">

                    {/* Logo */}
                    <Link href="/" className="group leading-tight">
                        <span className="text-2xl md:text-[1.85rem] font-bold text-gray-900 tracking-tight group-hover:text-blue-800 transition-colors">
                            CINT Lab
                        </span>
                    </Link>

                    {/* Nav links */}
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-1">

                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/">Home</Link>
                        </Button>

                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/projects">Projects</Link>
                        </Button>

                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/team">Team</Link>
                        </Button>

                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/events">Events</Link>
                        </Button>

                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/publications">Publications</Link>
                        </Button>

                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/contact">Contact</Link>
                        </Button>

                        {/* Divider */}
                        <span className="hidden md:block h-5 w-px bg-gray-200 mx-1" />

                        {/* CTA */}
                        <Button variant="default" size="sm" asChild>
                            <Link href="/apply">Apply for Internship</Link>
                        </Button>

                        {/* Admin */}
                        {isAdmin && (
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-amber-600 hover:text-amber-700"
                            >
                                <Link href="/admin">Admin</Link>
                            </Button>
                        )}

                        {/* Login */}
                        {!isAuthenticated && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </nav>
    );
}