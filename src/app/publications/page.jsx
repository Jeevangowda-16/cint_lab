"use client";

export default function PublicationsPage() {
    return (
        <main className="page-shell">
            <div className="section-shell max-w-4xl">
                <div className="glass-card relative overflow-hidden rounded-3xl p-6 md:p-8 mb-10 reveal-up">
                    <div className="absolute -top-12 -right-10 h-44 w-44 hero-glow-blue" />
                    <div className="absolute -bottom-14 -left-8 h-36 w-36 hero-glow-gold" />
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Publication Archive</p>
                    <h1 className="text-4xl md:text-5xl text-slate-900 mt-2">Selected Publications</h1>
                    <p className="mt-3 text-slate-600">Peer-reviewed publications and technical outputs grouped by year for quick review.</p>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Journal Articles</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">66</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Book Chapters</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">5</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Proceedings</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">45</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">H-Index</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">17</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white/75 p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-800">Profile Links</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                            <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                                Citations: <strong className="text-slate-900 ml-1">2036</strong>
                            </span>
                            <a href="https://orcid.org/0000-0002-0806-8339" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800 hover:bg-sky-100 transition">Open ORCID</a>
                            <a href="http://www.scopus.com/authid/detail.url?authorId=6603162849" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800 hover:bg-sky-100 transition">Open Scopus</a>
                            <a href="http://scholar.google.co.in/citations?user=3bC5WuQAAAAJ" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800 hover:bg-sky-100 transition">Open Google Scholar</a>
                            <a href="https://vidwan.inflibnet.ac.in/profile/3996" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800 hover:bg-sky-100 transition">Open Vidwan</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}