export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8 text-center text-sm">
            <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>© {new Date().getFullYear()} CINT Lab. All rights reserved.</p>
                <p>Department of Computer Science</p>
            </div>
        </footer>
    );
}