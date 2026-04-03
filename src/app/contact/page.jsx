export default function ContactPage() {
    return (
        <main className="min-h-screen bg-gray-50 p-8 md:p-16 font-sans">

            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">Contact Us</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Interested in research collaborations, internship opportunities, or have a general inquiry? We would love to hear from you.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Info Cards (Left Column) */}
                <div className="space-y-6 lg:col-span-1">

                    {/* Email Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Email</h3>
                        <p className="text-gray-600 mt-2">contact@cintlab.edu</p>
                        <p className="text-gray-500 text-sm mt-1">We aim to reply within 24 hours.</p>
                    </div>

                    {/* Office Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Office</h3>
                        <p className="text-gray-600 mt-2">Room 402, CS Building</p>
                        <p className="text-gray-500 text-sm mt-1">Prestigious University</p>
                    </div>

                </div>

                {/* Contact Form (Right Column) */}
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h2>
                    <form className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input type="email" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="jane@university.edu" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                            <select className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none">
                                <option>Internship Inquiry</option>
                                <option>Research Collaboration</option>
                                <option>General Question</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                            <textarea rows="5" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none" placeholder="Tell us about your research interests or how we can help..."></textarea>
                        </div>

                        <button type="button" className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all">
                            Send Message
                        </button>

                    </form>
                </div>

            </div>
        </main>
    );
}