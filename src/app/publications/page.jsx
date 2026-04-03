import publicationsData from '../../data/publications.json';

export default function PublicationsPage() {
    // We group the papers by year so they look organized
    const years = [...new Set(publicationsData.map(p => p.year))].sort((a, b) => b - a);

    return (
        <main className="min-h-screen bg-white p-8 md:p-16 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-12 border-b-4 border-blue-600 inline-block">Selected Publications</h1>

                <div className="space-y-12">
                    {years.map(year => (
                        <div key={year} className="relative pl-8 border-l-2 border-gray-100">
                            <span className="absolute -left-[11px] top-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                {year}
                            </span>
                            <div className="space-y-8">
                                {publicationsData.filter(p => p.year === year).map((pub, idx) => (
                                    <div key={idx} className="group">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                                            {pub.title}
                                        </h3>
                                        <p className="text-gray-600 mt-1 italic">{pub.authors}</p>
                                        <p className="text-blue-900 font-medium text-sm mt-1">{pub.venue}</p>
                                        <a href={pub.link} className="text-xs text-blue-500 font-bold uppercase mt-2 inline-block hover:underline">
                                            View Paper &rarr;
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}