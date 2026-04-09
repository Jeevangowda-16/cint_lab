"use client";

import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function Navbar() {
    const { isAuthenticated, isAdmin } = useAdminAuth();

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-300 bg-white">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                <Link href="/" className="group leading-tight">
                    <span className="text-2xl md:text-[1.8rem] font-semibold text-gray-900 tracking-wide group-hover:text-blue-800">
                        CINT Lab
                    </span>
                </Link>

                <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-2 font-semibold text-xs md:text-[13px] text-gray-700">
                    <Link href="/" className="px-3 py-1.5 rounded border border-transparent hover:bg-gray-100 hover:text-blue-800">Home</Link>
                    <Link href="/projects" className="px-3 py-1.5 rounded border border-transparent hover:bg-gray-100 hover:text-blue-800">Projects</Link>
                    <Link href="/team" className="px-3 py-1.5 rounded border border-transparent hover:bg-gray-100 hover:text-blue-800">Team</Link>
                    <Link href="/events" className="px-3 py-1.5 rounded border border-transparent hover:bg-gray-100 hover:text-blue-800">Events</Link>
                    <Link href="/publications" className="px-3 py-1.5 rounded border border-transparent hover:bg-gray-100 hover:text-blue-800">Publications</Link>
                    <Link href="/apply" className="px-2.5 py-1.5 rounded border border-transparent whitespace-nowrap hover:bg-gray-100 hover:text-blue-800">Apply for Internship</Link>
                    <Link href="/contact" className="px-3 py-1.5 rounded border border-transparent hover:bg-gray-100 hover:text-blue-800">Contact</Link>
                    {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded border border-transparent hover:bg-gray-100 hover:text-blue-800">Admin</Link>}
                    {!isAuthenticated && <Link href="/login" className="px-3 py-1.5 rounded border border-transparent hover:bg-gray-100 hover:text-blue-800">Login</Link>}
                </div>
            </div>
        </nav>
    );
}
