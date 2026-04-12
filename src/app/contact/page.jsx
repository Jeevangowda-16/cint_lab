export default function ContactPage() {
    const contactEmail = "omkar@iisc.ac.in";
    const locationCode = "AE123";

    return (
        <main className="page-shell">
            <div className="section-shell mb-10 glass-card relative overflow-hidden rounded p-6 md:p-10 text-left reveal-up">
                <div className="absolute -top-12 -right-8 h-44 w-44 hero-glow-blue" />
                <div className="absolute -bottom-14 -left-8 h-36 w-36 hero-glow-gold" />
                <p className="text-xs uppercase tracking-[0.15em] text-gray-600">Contact and Collaboration</p>
                <h1 className="text-4xl md:text-5xl text-gray-900 mt-2">Contact Us</h1>
                <p className="text-lg text-gray-700 max-w-3xl mt-4 leading-relaxed">
                    For collaboration, seminar invitations, or academic inquiries, use the profile-style contact details below.
                </p>
            </div>

            <div className="section-shell grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                <div className="paper-card p-7 rounded h-full">
                    <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
                    <p className="text-gray-700 mt-2 font-semibold">Dr S. N. Omkar</p>
                    <p className="text-sm text-gray-700 mt-1">Chief Research Scientist</p>
                    <p className="text-sm text-gray-700">Department of Aerospace Engineering</p>
                    <p className="text-sm text-gray-600 mt-3">Indian Institute of Science, Bangalore</p>
                    <p className="text-sm text-gray-600">Bangalore, Karnataka, India - 560012</p>
                    <a
                        href="https://aero.iisc.ac.in/people/s-n-omkar/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-3 text-sm text-blue-700 font-semibold hover:underline"
                    >
                        Official IISc Profile
                    </a>
                </div>

                <div className="paper-card p-7 rounded h-full">
                    <h3 className="text-lg font-bold text-gray-900">Profile Contact</h3>
                    <a href={`mailto:${contactEmail}`} className="text-gray-700 mt-2 inline-block hover:text-blue-700">
                        {contactEmail}
                    </a>
                    <p className="text-gray-600 text-sm mt-1">Response window: typically within one business day.</p>
                </div>

                <div className="paper-card p-7 rounded h-full">
                    <h3 className="text-lg font-bold text-gray-900">Location</h3>
                    <p className="text-gray-700 mt-2">{locationCode}</p>
                    <p className="text-gray-600 text-sm mt-1">Indian Institute of Science, Bangalore</p>
                    <p className="text-gray-600 text-sm mt-1">Department of Aerospace Engineering, IISc, Bengaluru, Karnataka, India - 560012.</p>
                </div>

                <div className="paper-card p-7 rounded h-full">
                    <h3 className="text-lg font-bold text-gray-900">Collaboration Areas</h3>
                    <ul className="mt-3 text-sm text-gray-700 space-y-2">
                        <li>Guidance and control systems</li>
                        <li>UAV autonomy and sensing</li>
                        <li>Biomechanics and optimization</li>
                    </ul>
                </div>

                <div className="paper-card p-7 rounded h-full md:col-span-2 xl:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900">Academic Identity</h3>
                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                        <p>
                            ORCID: <a href="https://orcid.org/0000-0002-0806-8339" target="_blank" rel="noreferrer" className="text-blue-700 font-semibold hover:underline">0000-0002-0806-8339</a>
                        </p>
                        <p>
                            Scopus: <a href="http://www.scopus.com/authid/detail.url?authorId=6603162849" target="_blank" rel="noreferrer" className="text-blue-700 font-semibold hover:underline">6603162849</a>
                        </p>
                        <p>
                            Google Scholar: <a href="http://scholar.google.co.in/citations?user=3bC5WuQAAAAJ" target="_blank" rel="noreferrer" className="text-blue-700 font-semibold hover:underline">3bC5WuQAAAAJ</a>
                        </p>
                        <p>
                            Vidwan: <a href="https://vidwan.inflibnet.ac.in/profile/3996" target="_blank" rel="noreferrer" className="text-blue-700 font-semibold hover:underline">Profile 3996</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}