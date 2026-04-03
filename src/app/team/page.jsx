import React from 'react';
import labData from '../../data/team.json';

export default function TeamPage() {
    return (
        <main className="min-h-screen bg-gray-50 text-gray-800 p-8 md:p-16 font-sans">
            <div className="max-w-6xl mx-auto mb-16 border-b-2 border-gray-200 pb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Our Team</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                    Meet the minds behind the CINT Lab. We are a diverse group of researchers, faculty, and students dedicated to advancing computer science.
                </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-20">
                {/* DIRECTOR */}
                <section>
                    <h2 className="text-2xl font-bold text-blue-900 mb-6 uppercase tracking-wide">Lab Director</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-8">
                        <div className="w-48 h-48 rounded-full flex-shrink-0 mx-auto md:mx-0 overflow-hidden border-4 border-white shadow-lg">
                            <img
                                src={labData.director.image}
                                alt={labData.director.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-col justify-center">
                            <h3 className="text-3xl font-bold text-gray-900">{labData.director.name}</h3>
                            <p className="text-blue-600 font-medium mt-1">{labData.director.title}</p>
                            <p className="mt-4 text-gray-600 leading-relaxed">{labData.director.bio}</p>
                            <div className="mt-8 flex gap-4">
                                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Email Professor</button>
                                <button className="bg-white text-blue-600 border border-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition">Download CV</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FACULTY */}
                <section>
                    <h2 className="text-2xl font-bold text-blue-900 mb-6 uppercase tracking-wide">Associated Faculty</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {labData.faculty.map((member, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                <p className="text-sm font-medium text-blue-600 mb-2">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* INTERNS */}
                <section>
                    <h2 className="text-2xl font-bold text-blue-900 mb-6 uppercase tracking-wide">Current Interns & RAs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {labData.interns.map((intern, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{intern.name}</h3>
                                    <p className="text-sm text-gray-600">{intern.role} ({intern.year})</p>
                                    <p className="text-xs text-gray-500 mt-1">Focus: {intern.project}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ALUMNI */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-400 mb-6 uppercase tracking-wide border-b border-gray-200 pb-2">Alumni</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {labData.alumni.map((alumnus, idx) => (
                            <div key={idx} className="p-4 bg-gray-100 rounded-lg">
                                <h3 className="font-bold text-gray-800">{alumnus.name}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{alumnus.role}</p>
                                <p className="text-sm text-gray-600">Now at: <span className="font-medium text-gray-900">{alumnus.current}</span></p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}