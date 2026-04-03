import Link from 'next/link';
import researchData from '../../data/research.json';

export default function ResearchPage() {
    return (
        <main className="min-h-screen bg-gray-50 text-gray-800 p-8 md:p-16 font-sans">

            {/* PAGE HEADER */}
            <div className="max-w-6xl mx-auto mb-16 border-b-2 border-gray-200 pb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Our Research</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                    The CINT Lab explores the cutting edge of computation. Here are some of the active and recently completed projects our faculty and interns are driving forward.
                </p>
            </div>

            {/* PROJECTS GRID */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {researchData.map((project, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between hover:shadow-md transition">

                        <div>
                            {/* Category Badge */}
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold tracking-wide uppercase mb-4">
                                {project.category}
                            </span>

                            {/* Project Title & Description */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {project.description}
                            </p>
                        </div>

                        {/* Footer of the Card: Status & Link */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                {/* A little colored dot that changes based on status! */}
                                <span className={`w-2.5 h-2.5 rounded-full ${project.status === 'Ongoing' ? 'bg-green-500' :
                                        project.status === 'Completed' ? 'bg-gray-400' : 'bg-yellow-400'
                                    }`}></span>
                                <span className="text-gray-500">Status: {project.status}</span>
                            </div>

                            <button className="text-blue-600 font-semibold hover:text-blue-800 transition">
                                Read Paper &rarr;
                            </button>
                        </div>

                    </div>
                ))}

            </div>

            {/* CALL TO ACTION */}
            <div className="max-w-6xl mx-auto mt-20 bg-blue-900 rounded-2xl p-10 text-center text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-4">Interested in joining our research?</h2>
                <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
                    We are always looking for passionate interns and researchers to push these projects forward.
                </p>
                <Link href="/team" className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
                    Contact the Director
                </Link>
            </div>

        </main>
    );
}