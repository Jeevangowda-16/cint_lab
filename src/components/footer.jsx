export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-300 bg-gray-50 text-gray-700 py-10 text-sm">
            <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <p className="text-base font-semibold tracking-wide text-gray-900">CINT Lab</p>
                    <p className="text-gray-600 mt-1">Computing Intelligence and Networked Technologies</p>
                    <p className="mt-4 text-gray-500">© {new Date().getFullYear()} CINT Lab. All rights reserved.</p>
                </div>
                <p className="text-left md:text-right leading-relaxed">
                    Department of Aerospace Engineering
                    <br />
                    Indian Institute of Science
                    <br />
                    Bengaluru 560012
                </p>
            </div>
        </footer>
    );
}