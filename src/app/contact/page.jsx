"use client";

import { useCallback, useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getContactMetadata, submitContact } from "@/services/contactService";
import { getFormConfig } from "@/services/formConfigService";

const initialContactForm = {
    fullName: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
};

export default function ContactPage() {
    const contactEmail = "omkar@iisc.ac.in";
    const locationCode = "AE123";
    const [form, setForm] = useState(initialContactForm);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");
    const fetchContactMetadata = useCallback(() => getContactMetadata(), []);
    const { data: metadata, loading, error } = useAsyncData(fetchContactMetadata);
    const fetchFormConfig = useCallback(() => getFormConfig(), []);
    const { data: formConfig, loading: optionsLoading } = useAsyncData(fetchFormConfig);
    const contactSubjectOptions = useMemo(() => formConfig?.contactSubjectOptions || [], [formConfig]);

    const onFocusSubject = () => {
        if (!form.subject && contactSubjectOptions.length > 0) {
            setForm((previous) => ({ ...previous, subject: contactSubjectOptions[0] }));
        }
    };

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setFeedback("");

        if (!form.fullName || !form.email || !form.message) {
            setFeedback("Please complete name, email, and message.");
            return;
        }

        setSubmitting(true);

        try {
            const result = await submitContact(form);
            setFeedback("Message submitted successfully.");
            setForm(initialContactForm);
        } catch (submitError) {
            setFeedback(submitError instanceof Error ? submitError.message : "Unable to send message.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="page-shell">
            <div className="section-shell mb-10 glass-card relative overflow-hidden rounded-3xl p-6 md:p-10 text-left reveal-up">
                <div className="absolute -top-12 -right-8 h-44 w-44 hero-glow-blue" />
                <div className="absolute -bottom-14 -left-8 h-36 w-36 hero-glow-gold" />
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Contact and Collaboration</p>
                <h1 className="text-4xl md:text-5xl text-slate-900 tracking-tight mt-2">Contact Us</h1>
                <p className="text-lg text-slate-600 max-w-3xl mt-4 leading-relaxed">
                    For collaboration, seminar invitations, or academic inquiries, connect with the lab using the profile-style contact details and form below.
                </p>
            </div>

            <div className="section-shell grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6 lg:col-span-1">
                    <div className="paper-card p-7 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-900">Profile Information</h3>
                        <p className="text-slate-700 mt-2 font-semibold">Dr S. N. Omkar</p>
                        <p className="text-sm text-slate-600 mt-1">Chief Research Scientist</p>
                        <p className="text-sm text-slate-600">Department of Aerospace Engineering</p>
                        <p className="text-sm text-slate-500 mt-3">Indian Institute of Science, Bangalore</p>
                        <p className="text-sm text-slate-500">Bangalore, Karnataka, India - 560012</p>
                        <a
                            href="http://www.iisc.ac.in/users/omkar"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-3 text-sm text-sky-700 font-semibold hover:underline"
                        >
                            Official IISc Profile
                        </a>
                    </div>

                    <div className="paper-card p-7 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-900">Profile Contact</h3>
                        <a href={`mailto:${contactEmail}`} className="text-slate-600 mt-2 inline-block hover:text-sky-700 transition">
                            {contactEmail}
                        </a>
                        <p className="text-slate-500 text-sm mt-1">Response window: typically within one business day.</p>
                    </div>

                    <div className="paper-card p-7 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-900">Location</h3>
                        <p className="text-slate-600 mt-2">{locationCode}</p>
                        <p className="text-slate-500 text-sm mt-1">Indian Institute of Science, Bangalore</p>
                    </div>

                    <div className="paper-card p-7 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-900">Collaboration Areas</h3>
                        <ul className="mt-3 text-sm text-slate-600 space-y-2">
                            <li>Guidance and control systems</li>
                            <li>UAV autonomy and sensing</li>
                            <li>Biomechanics and optimization</li>
                        </ul>
                    </div>

                    <div className="paper-card p-7 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-900">Academic Identity</h3>
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                            <p>
                                ORCID: <a href="https://orcid.org/0000-0002-0806-8339" target="_blank" rel="noreferrer" className="text-sky-700 font-semibold hover:underline">0000-0002-0806-8339</a>
                            </p>
                            <p>
                                Scopus: <a href="http://www.scopus.com/authid/detail.url?authorId=6603162849" target="_blank" rel="noreferrer" className="text-sky-700 font-semibold hover:underline">6603162849</a>
                            </p>
                            <p>
                                Google Scholar: <a href="http://scholar.google.co.in/citations?user=3bC5WuQAAAAJ" target="_blank" rel="noreferrer" className="text-sky-700 font-semibold hover:underline">3bC5WuQAAAAJ</a>
                            </p>
                            <p>
                                Vidwan: <a href="https://vidwan.inflibnet.ac.in/profile/3996" target="_blank" rel="noreferrer" className="text-sky-700 font-semibold hover:underline">Profile 3996</a>
                            </p>
                        </div>
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>

                <div className="paper-card p-8 md:p-12 rounded-2xl lg:col-span-2">
                    <h2 className="text-2xl text-slate-900 mb-8">Send a Message</h2>
                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="fullName">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={form.fullName}
                                    onChange={onChange}
                                    className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none transition"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={onChange}
                                    className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none transition"
                                    placeholder="jane@university.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="subject">
                                Subject
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                value={form.subject}
                                onChange={onChange}
                                onFocus={onFocusSubject}
                                className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none transition"
                            >
                                {optionsLoading && <option value="">Loading...</option>}
                                {contactSubjectOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={form.message}
                                onChange={onChange}
                                className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none transition resize-none"
                                placeholder="Tell us about your interests or how we can help..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full md:w-auto bg-sky-800 text-white px-10 py-4 rounded-xl font-bold hover:bg-sky-900 hover:shadow-lg transition-all disabled:opacity-60"
                        >
                            {submitting ? "Sending..." : "Send Message"}
                        </button>

                        {feedback && <p className="text-sm text-slate-700">{feedback}</p>}
                    </form>
                </div>
            </div>
        </main>
    );
}