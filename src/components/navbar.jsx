"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function Navbar() {
    const { isAuthenticated, isAdmin } = useAdminAuth();
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
        { href: "/team", label: "Team" },
        { href: "/events", label: "Events" },
        { href: "/publications", label: "Publications" },
        { href: "/contact", label: "Contact" },
    ];

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

                    {/* 🔥 LOGO */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/headshots/aerologo.svg"
                            alt="CINT Lab Logo"
                            width={28}
                            height={28}
                        />
                        <span className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
                            CINT Lab
                        </span>
                    </Link>

                    {/* 🔥 NAV + CTA */}
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-3">

                        {/* 🔥 ANIMATED NAV LINKS */}
                        <AnimatedBackground
                            defaultValue={pathname}
                            className="rounded-lg bg-gray-100/70 backdrop-blur-md px-1 py-1 flex"
                            transition={{
                                type: "spring",
                                bounce: 0.2,
                                duration: 0.3,
                            }}
                            enableHover
                        >
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    data-id={item.href}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </AnimatedBackground>

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