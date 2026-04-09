"use client";

export default function PublicationsPage() {
    return (
        <main className="page-shell">
            <div className="section-shell max-w-4xl">
                <div className="glass-card relative overflow-hidden rounded p-6 md:p-8 mb-10 reveal-up">
                    <div className="absolute -top-12 -right-10 h-44 w-44 hero-glow-blue" />
                    <div className="absolute -bottom-14 -left-8 h-36 w-36 hero-glow-gold" />
                    <p className="text-xs uppercase tracking-[0.12em] text-gray-600">Publication Archive</p>
                    <h1 className="text-4xl md:text-5xl text-gray-900 mt-2">Selected Publications</h1>
                    <p className="mt-3 text-gray-700">Peer-reviewed publications and technical outputs grouped by year for quick review.</p>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="rounded border border-gray-300 bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.1em] text-gray-600">Journal Articles</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">66</p>
                        </div>
                        <div className="rounded border border-gray-300 bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.1em] text-gray-600">Book Chapters</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">5</p>
                        </div>
                        <div className="rounded border border-gray-300 bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.1em] text-gray-600">Proceedings</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">45</p>
                        </div>
                        <div className="rounded border border-gray-300 bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.1em] text-gray-600">H-Index</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">17</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded border border-gray-300 bg-white p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-800">Profile Links</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                            <span className="inline-flex items-center rounded border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                                Citations: <strong className="text-gray-900 ml-1">2036</strong>
                            </span>
                            <a href="https://orcid.org/0000-0002-0806-8339" target="_blank" rel="noreferrer" className="inline-flex items-center rounded border border-blue-300 bg-white px-3 py-1.5 text-sm font-semibold text-blue-800 hover:bg-gray-100">Open ORCID</a>
                            <a href="http://www.scopus.com/authid/detail.url?authorId=6603162849" target="_blank" rel="noreferrer" className="inline-flex items-center rounded border border-blue-300 bg-white px-3 py-1.5 text-sm font-semibold text-blue-800 hover:bg-gray-100">Open Scopus</a>
                            <a href="http://scholar.google.co.in/citations?user=3bC5WuQAAAAJ" target="_blank" rel="noreferrer" className="inline-flex items-center rounded border border-blue-300 bg-white px-3 py-1.5 text-sm font-semibold text-blue-800 hover:bg-gray-100">Open Google Scholar</a>
                            <a href="https://vidwan.inflibnet.ac.in/profile/3996" target="_blank" rel="noreferrer" className="inline-flex items-center rounded border border-blue-300 bg-white px-3 py-1.5 text-sm font-semibold text-blue-800 hover:bg-gray-100">Open Vidwan</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}