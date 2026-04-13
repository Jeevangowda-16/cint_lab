import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ContactPage() {
    const contactEmail = "omkar@iisc.ac.in";
    const locationCode = "AE123";

    return (
        <main className="page-shell text-slate-800">
            <div className="section-shell space-y-6 reveal-up">
                <Card className="glass-card relative overflow-hidden border border-slate-200/80 bg-white/80 p-0 shadow-sm backdrop-blur-sm">
                    <div className="absolute -top-16 -right-10 h-52 w-52 hero-glow-blue" />
                    <div className="absolute -bottom-16 -left-12 h-44 w-44 hero-glow-gold" />
                    <CardContent className="relative p-8 md:p-12">
                        <div className="max-w-3xl space-y-5">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Contact and Collaboration</Badge>
                                <Badge variant="outline">Seminar invites</Badge>
                                <Badge variant="outline">Research partnerships</Badge>
                            </div>

                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Department of Aerospace Engineering · IISc Bengaluru</p>
                            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">Contact Us</h1>
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">
                                For collaboration, seminar invitations, academic inquiries, or media requests, use the contact routes below. The page is structured to get you to the right channel quickly.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-1">
                                <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
                                    <a href={`mailto:${contactEmail}`}>Email Dr. Omkar</a>
                                </Button>
                                <Button asChild variant="outline">
                                    <a href="https://aero.iisc.ac.in/people/s-n-omkar/" target="_blank" rel="noreferrer">Open IISc Profile</a>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
                    <Card className="paper-card h-full min-h-[320px] border border-slate-200/80 shadow-sm flex flex-col">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-2xl text-slate-900">Primary Contact</CardTitle>
                            <CardDescription>Use this for collaboration requests, talks, and academic follow-up.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Profile</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">Dr S. N. Omkar</p>
                                    <p className="mt-1 text-sm text-slate-600">Chief Research Scientist</p>
                                    <p className="text-sm text-slate-600">Department of Aerospace Engineering</p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Response</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">Within one business day</p>
                                    <p className="mt-1 text-sm text-slate-600">Best for formal outreach and collaboration discussions.</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Email</p>
                                    <a href={`mailto:${contactEmail}`} className="mt-1 block text-lg font-semibold text-slate-900 hover:text-blue-700">
                                        {contactEmail}
                                    </a>
                                </div>
                                <Button asChild variant="outline" className="sm:self-start">
                                    <a href={`mailto:${contactEmail}`}>Compose email</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="paper-card h-full min-h-[320px] border border-slate-200/80 shadow-sm flex flex-col">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-2xl text-slate-900">Location</CardTitle>
                            <CardDescription>Find the lab and department address here.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-sm font-semibold text-slate-900">Office code</p>
                                <p className="mt-2 text-sm text-slate-600">{locationCode}</p>
                                <p className="text-sm text-slate-600">Indian Institute of Science, Bangalore</p>
                                <p className="text-sm text-slate-600">Department of Aerospace Engineering, IISc, Bengaluru, Karnataka, India - 560012.</p>
                            </div>

                            <Separator />

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Visit note</p>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    If you are planning an in-person visit, reach out ahead of time so the lab can confirm availability and direct you to the right office.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}