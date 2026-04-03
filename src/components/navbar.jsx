import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">

                {/* Lab Logo / Name */}
                <Link href="/" className="text-xl font-bold tracking-wider hover:text-blue-200 transition">
                    CINT LAB
                </Link>

                {/* Navigation Links */}
                <div className="flex gap-6 font-medium text-sm md:text-base">
                    <Link href="/" className="hover:text-blue-200 transition">Home</Link>
                    <Link href="/team" className="hover:text-blue-200 transition">Team</Link>
                    <Link href="/research" className="hover:text-blue-200 transition">Research</Link>
                    <Link href="/publications" className="hover:text-blue-200 transition">Publications</Link>
                    <Link href="/contact" className="hover:text-blue-200 transition">Contact</Link>
                </div>

            </div>
        </nav>
    );
}