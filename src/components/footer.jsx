export default function Footer() {
    return (
        <footer className="mt-auto border-t border-[#d8c79a]/55 bg-[#1b2a59] text-[#e6eaf4] py-10 text-sm">
            <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <p className="text-base font-semibold tracking-wide text-[#f9f1de]">CINT Lab</p>
                    <p className="text-[#cfd7ec] mt-1">Computing Intelligence and Networked Technologies</p>
                    <p className="mt-4 text-[#b7c3e3]">© {new Date().getFullYear()} CINT Lab. All rights reserved.</p>
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