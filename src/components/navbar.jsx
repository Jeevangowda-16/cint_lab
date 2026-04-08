"use client";

import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function Navbar() {
    const { isAuthenticated, isAdmin } = useAdminAuth();

    return (
        <nav className="sticky top-0 z-50 border-b border-[#d8c79a]/60 bg-[#f8fbff]/85 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                <Link href="/" className="group leading-tight">
                    <span className="text-2xl md:text-[1.8rem] font-semibold text-slate-900 tracking-wide group-hover:text-[#2a3d7f] transition">
                        CINT Lab
                    </span>
                </Link>

                <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-2 font-semibold text-xs md:text-[13px] text-slate-700">
                    <Link href="/" className="px-3 py-1.5 rounded-full hover:bg-[#edf3ff] hover:text-[#2a3d7f] transition">Home</Link>
                    <Link href="/projects" className="px-3 py-1.5 rounded-full hover:bg-[#edf3ff] hover:text-[#2a3d7f] transition">Projects</Link>
                    <Link href="/team" className="px-3 py-1.5 rounded-full hover:bg-[#edf3ff] hover:text-[#2a3d7f] transition">Team</Link>
                    <Link href="/events" className="px-3 py-1.5 rounded-full hover:bg-[#edf3ff] hover:text-[#2a3d7f] transition">Events</Link>
                    <Link href="/publications" className="px-3 py-1.5 rounded-full hover:bg-[#edf3ff] hover:text-[#2a3d7f] transition">Publications</Link>
                    <Link href="/apply" className="px-2.5 py-1.5 rounded-full whitespace-nowrap hover:bg-[#edf3ff] hover:text-[#2a3d7f] transition">Apply for Internship</Link>
                    <Link href="/contact" className="px-3 py-1.5 rounded-full hover:bg-[#edf3ff] hover:text-[#2a3d7f] transition">Contact</Link>
                    {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-full hover:bg-[#edf3ff] hover:text-[#2a3d7f] transition">Admin</Link>}
                    {!isAuthenticated && <Link href="/login" className="px-3 py-1.5 rounded-full hover:bg-[#edf3ff] hover:text-[#2a3d7f] transition">Login</Link>}
                </div>
            </div>
        </nav>
    );
}
