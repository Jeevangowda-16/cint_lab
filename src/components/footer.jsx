export default function Footer() {
    return (
        <footer className="mt-20 pb-10 text-sm text-gray-700">
            <div className="max-w-[90rem] mx-auto px-4 md:px-6 lg:px-10">

                <div className="
      rounded-2xl
      border border-gray-200
      bg-white
      px-8 md:px-10 py-6 md:py-8
      flex flex-col md:flex-row justify-between items-start md:items-center gap-6
    ">

                    {/* Left */}
                    <div>
                        <p className="text-base font-semibold tracking-wide text-gray-900">
                            CINT Lab
                        </p>
                        <p className="text-gray-600 mt-1">
                            Computing Intelligence and Networked Technologies
                        </p>
                        <p className="mt-4 text-gray-500">
                            © {new Date().getFullYear()} CINT Lab. All rights reserved.
                        </p>
                    </div>

                    {/* Right */}
                    <p className="text-left md:text-right leading-relaxed text-gray-600">
                        Department of Aerospace Engineering
                        <br />
                        Indian Institute of Science
                        <br />
                        Bengaluru 560012
                    </p>

                </div>

            </div>
        </footer>
    );
}