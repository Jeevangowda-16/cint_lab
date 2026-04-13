"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ExternalLink,
    FileText,
    Download,
    ChevronDown,
    Search,
    BookOpen,
    Hash,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PUBLICATIONS = [
    {
        id: 1,
        title: "Autonomous UAV Navigation Using Deep Reinforcement Learning in GPS-Denied Environments",
        authors: "Rajesh K., Priya M., S. N. Omkar",
        year: 2025,
        category: "Journal",
        venue: "IEEE Transactions on Aerospace and Electronic Systems",
        abstract:
            "This paper presents a deep reinforcement learning framework for autonomous navigation of unmanned aerial vehicles (UAVs) in environments where GPS signals are unavailable. The proposed approach leverages a combination of visual odometry and IMU data to achieve robust localization, enabling reliable flight operations in indoor and urban canyon settings.",
        citation:
            'Rajesh K., Priya M., S. N. Omkar, "Autonomous UAV Navigation Using Deep Reinforcement Learning in GPS-Denied Environments," IEEE Trans. Aerosp. Electron. Syst., vol. 61, no. 2, pp. 1234–1245, 2025.',
        doi: "10.1109/TAES.2025.001234",
        pdf: "#",
        link: "#",
    },
    {
        id: 2,
        title: "Structural Health Monitoring of Aircraft Wings Using Fiber Bragg Grating Sensors and Machine Learning",
        authors: "Ananya S., Vikram R., S. N. Omkar",
        year: 2025,
        category: "Journal",
        venue: "Smart Materials and Structures",
        abstract:
            "We propose an integrated framework for structural health monitoring (SHM) of composite aircraft wings by combining fiber Bragg grating (FBG) sensors with machine learning classifiers. Experimental validation on a representative wing structure demonstrates 98.3% classification accuracy for damage detection.",
        citation:
            'Ananya S., Vikram R., S. N. Omkar, "Structural Health Monitoring of Aircraft Wings Using Fiber Bragg Grating Sensors and Machine Learning," Smart Mater. Struct., vol. 34, no. 1, p. 015021, 2025.',
        doi: "10.1088/1361-665X/ad1234",
        pdf: "#",
        link: "#",
    },
    {
        id: 3,
        title: "Multi-Rotor UAV Formation Control for Aerial Survey Applications",
        authors: "Suresh P., Kavitha L., S. N. Omkar",
        year: 2024,
        category: "Conference",
        venue: "AIAA SciTech Forum 2024, Orlando, FL",
        abstract:
            "A distributed consensus-based control algorithm is developed for maintaining rigid formations among a swarm of multi-rotor UAVs during aerial survey missions. The approach is validated through hardware-in-the-loop simulations and real-world flight trials.",
        citation:
            'Suresh P., Kavitha L., S. N. Omkar, "Multi-Rotor UAV Formation Control for Aerial Survey Applications," in Proc. AIAA SciTech Forum, Orlando, FL, Jan. 2024, Paper AIAA 2024-0987.',
        doi: "10.2514/6.2024-0987",
        pdf: "#",
        link: "#",
    },
    {
        id: 4,
        title: "Deep Learning Approaches for Bird Strike Risk Assessment at Airports",
        authors: "Meera T., S. N. Omkar",
        year: 2024,
        category: "Journal",
        venue: "Aerospace Science and Technology",
        abstract:
            "This study introduces a convolutional neural network-based system for real-time bird detection and risk classification at airport vicinities. Using a dataset of over 50,000 annotated images, the model achieves a mean average precision of 91.7% under diverse lighting and weather conditions.",
        citation:
            'Meera T., S. N. Omkar, "Deep Learning Approaches for Bird Strike Risk Assessment at Airports," Aerosp. Sci. Technol., vol. 148, p. 109112, 2024.',
        doi: "10.1016/j.ast.2024.109112",
        pdf: "#",
        link: "#",
    },
    {
        id: 5,
        title: "Optimal Path Planning for Fixed-Wing UAVs in Turbulent Atmospheric Conditions",
        authors: "Arun B., Deepika N., S. N. Omkar",
        year: 2024,
        category: "Journal",
        venue: "Journal of Guidance, Control, and Dynamics",
        abstract:
            "An energy-efficient path planning algorithm for fixed-wing unmanned aerial vehicles operating in stochastic wind fields is presented. The algorithm integrates meteorological forecasts into a dynamic programming framework, reducing fuel consumption by up to 18% compared to conventional routing.",
        citation:
            'Arun B., Deepika N., S. N. Omkar, "Optimal Path Planning for Fixed-Wing UAVs in Turbulent Atmospheric Conditions," J. Guid. Control Dyn., vol. 47, no. 3, pp. 456–470, 2024.',
        doi: "10.2514/1.G007890",
        pdf: "#",
        link: "#",
    },
    {
        id: 6,
        title: "Vibration-Based Damage Detection in Composite Laminates Using Wavelet Transform",
        authors: "Harini K., S. N. Omkar",
        year: 2023,
        category: "Journal",
        venue: "Composite Structures",
        abstract:
            "A wavelet-transform-based signal processing technique is applied to acceleration measurements for early-stage delamination detection in carbon-fibre reinforced polymer laminates. The method is shown to outperform Fourier-based approaches by 12 dB in signal-to-noise ratio for damage-induced frequency shifts.",
        citation:
            'Harini K., S. N. Omkar, "Vibration-Based Damage Detection in Composite Laminates Using Wavelet Transform," Compos. Struct., vol. 312, p. 116820, 2023.',
        doi: "10.1016/j.compstruct.2023.116820",
        pdf: "#",
        link: "#",
    },
    {
        id: 7,
        title: "Swarm Intelligence Algorithms for Multi-Objective Aerodynamic Shape Optimization",
        authors: "Rahul G., Preethi A., S. N. Omkar",
        year: 2023,
        category: "Book Chapter",
        venue: "Advances in Swarm Intelligence, Springer, Chapter 8",
        abstract:
            "This chapter reviews the application of particle swarm optimization (PSO) and ant colony optimization (ACO) algorithms to multi-objective aerodynamic shape design problems. Case studies on airfoil profile optimization and nacelle shaping for transonic flow are presented.",
        citation:
            'Rahul G., Preethi A., S. N. Omkar, "Swarm Intelligence Algorithms for Multi-Objective Aerodynamic Shape Optimization," in Advances in Swarm Intelligence, Springer, 2023, ch. 8, pp. 201–235.',
        doi: "10.1007/978-3-031-12345-8",
        pdf: "#",
        link: "#",
    },
    {
        id: 8,
        title: "Real-Time Pose Estimation for Micro Air Vehicles Using Monocular Vision",
        authors: "Siddharth V., S. N. Omkar",
        year: 2023,
        category: "Conference",
        venue: "International Conference on Unmanned Aircraft Systems (ICUAS 2023), Warsaw",
        abstract:
            "We present a lightweight convolutional neural network pipeline for real-time 6-DoF pose estimation of micro air vehicles using a single monocular camera. The system runs at 60 fps on an NVIDIA Jetson Nano and achieves sub-centimetre positional accuracy in laboratory conditions.",
        citation:
            'Siddharth V., S. N. Omkar, "Real-Time Pose Estimation for Micro Air Vehicles Using Monocular Vision," in Proc. ICUAS 2023, Warsaw, Poland, Jun. 2023, pp. 123–130.',
        doi: "10.1109/ICUAS57906.2023.001234",
        pdf: "#",
        link: "#",
    },
    {
        id: 9,
        title: "Adaptive Fuzzy Control for Rotorcraft Under Actuator Faults",
        authors: "Nalini R., S. N. Omkar",
        year: 2022,
        category: "Journal",
        venue: "Aerospace Science and Technology",
        abstract:
            "An adaptive fuzzy-logic-based fault-tolerant control strategy is developed for rotorcraft experiencing partial actuator failures in flight. The controller reconfigures online without prior knowledge of the fault model, maintaining stable hovering and trajectory tracking under single and dual actuator degradation scenarios.",
        citation:
            'Nalini R., S. N. Omkar, "Adaptive Fuzzy Control for Rotorcraft Under Actuator Faults," Aerosp. Sci. Technol., vol. 121, p. 107348, 2022.',
        doi: "10.1016/j.ast.2022.107348",
        pdf: "#",
        link: "#",
    },
    {
        id: 10,
        title: "Convolutional Neural Network-Based Terrain Classification for Autonomous Landing",
        authors: "Tanvi S., Manoj K., S. N. Omkar",
        year: 2022,
        category: "Conference",
        venue: "AIAA Aviation Forum 2022, Chicago, IL",
        abstract:
            "A terrain classification pipeline based on lightweight convolutional neural networks is proposed to support autonomous landing zone selection for UAVs. The system processes downward-looking camera feeds in real time and distinguishes between safe, marginal, and hazardous landing surfaces.",
        citation:
            'Tanvi S., Manoj K., S. N. Omkar, "Convolutional Neural Network-Based Terrain Classification for Autonomous Landing," in Proc. AIAA Aviation Forum, Chicago, IL, Jun. 2022, Paper AIAA 2022-3456.',
        doi: "10.2514/6.2022-3456",
        pdf: "#",
        link: "#",
    },
];

const STATS = [
    { label: "Journal Articles", value: "66" },
    { label: "Book Chapters", value: "5" },
    { label: "Proceedings", value: "45" },
    { label: "H-Index", value: "17" },
];

const PROFILE_LINKS = [
    { label: "ORCID", href: "https://orcid.org/0000-0002-0806-8339" },
    { label: "Scopus", href: "http://www.scopus.com/authid/detail.url?authorId=6603162849" },
    { label: "Google Scholar", href: "http://scholar.google.co.in/citations?user=3bC5WuQAAAAJ" },
    { label: "Vidwan", href: "https://vidwan.inflibnet.ac.in/profile/3996" },
];

const CATEGORY_MAP = {
    All: null,
    Journals: "Journal",
    Conferences: "Conference",
    Books: "Book Chapter",
};

const BADGE_VARIANT = {
    Journal: "default",
    Conference: "secondary",
    "Book Chapter": "outline",
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ label, value }) {
    return (
        <Card className="rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
                <p className="text-3xl font-bold text-blue-950 mt-1.5">{value}</p>
            </CardContent>
        </Card>
    );
}

// ─── SidebarYears ─────────────────────────────────────────────────────────────

function SidebarYears({ years, selectedYear, onSelect }) {
    return (
        <aside className="hidden md:block w-40 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 px-1">Filter by Year</p>
            <ul className="space-y-1">
                <li>
                    <Button
                        variant={selectedYear === null ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-start text-sm ${selectedYear === null ? "bg-blue-900 text-white hover:bg-blue-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
                        onClick={() => onSelect(null)}
                    >
                        All Years
                    </Button>
                </li>
                {years.map((y) => (
                    <li key={y}>
                        <Button
                            variant={selectedYear === y ? "default" : "ghost"}
                            size="sm"
                            className={`w-full justify-start text-sm ${selectedYear === y ? "bg-blue-900 text-white hover:bg-blue-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
                            onClick={() => onSelect(y)}
                        >
                            {y}
                        </Button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

// ─── PublicationCard ──────────────────────────────────────────────────────────

function PublicationCard({ pub }) {
    const [open, setOpen] = useState(false);

    return (
        <Card className="rounded-xl border border-slate-200 border-l-4 border-l-blue-900 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-slate-50/50">
            <CardHeader className="p-6 pb-4">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge variant={BADGE_VARIANT[pub.category] || "secondary"} className="text-xs font-medium px-2.5 py-0.5">
                        {pub.category}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{pub.year}</span>
                </div>
                <h3 className="text-[1.05rem] font-bold text-slate-900 leading-snug">{pub.title}</h3>
                <p className="text-sm font-medium text-slate-700 mt-2">{pub.authors}</p>
                <p className="text-sm text-slate-500 italic mt-1">{pub.venue}</p>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0 space-y-4">
                {/* Action buttons */}
                <div className="flex flex-wrap gap-2.5">
                    {pub.link && (
                        <Button asChild variant="outline" size="sm" className="text-xs gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                            <a href={pub.link} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                                View Paper
                            </a>
                        </Button>
                    )}
                    {pub.doi && (
                        <Button asChild variant="outline" size="sm" className="text-xs gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">
                                <Hash className="h-3.5 w-3.5" />
                                DOI
                            </a>
                        </Button>
                    )}
                    {pub.pdf && (
                        <Button asChild variant="outline" size="sm" className="text-xs gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                            <a href={pub.pdf} target="_blank" rel="noreferrer">
                                <Download className="h-3.5 w-3.5" />
                                PDF
                            </a>
                        </Button>
                    )}
                </div>

                {/* Expandable section */}
                <Collapsible open={open} onOpenChange={setOpen}>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs gap-1.5 px-0 h-auto text-blue-800 hover:text-blue-950 hover:bg-transparent font-medium">
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                            />
                            {open ? "Hide details" : "Show abstract & citation"}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                        <div className="pt-4 space-y-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Abstract</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{pub.abstract}</p>
                            </div>
                            <Separator className="bg-slate-200" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
                                    <BookOpen className="h-3.5 w-3.5" /> Citation
                                </p>
                                <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white rounded-md p-3.5 border border-slate-200 shadow-sm">
                                    {pub.citation}
                                </p>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}

// ─── PublicationsList ─────────────────────────────────────────────────────────

function PublicationsList({ publications, showAll }) {
    const displayed = showAll ? publications : publications.slice(0, 5);

    if (displayed.length === 0) {
        return (
            <div className="py-20 text-center bg-slate-50 border border-slate-200 rounded-xl border-dashed">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-medium text-slate-600">No publications match your search criteria.</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search term.</p>
            </div>
        );
    }

    const byYear = displayed.reduce((acc, pub) => {
        if (!acc[pub.year]) acc[pub.year] = [];
        acc[pub.year].push(pub);
        return acc;
    }, {});

    const sortedYears = Object.keys(byYear).sort((a, b) => b - a);

    return (
        <div className="space-y-10">
            {sortedYears.map((year) => (
                <section key={year}>
                    <div className="flex items-center gap-4 mb-5">
                        <h2 className="text-lg font-bold text-slate-900">{year}</h2>
                        <div className="flex-1 border-t border-slate-200" />
                        <Badge variant="outline" className="text-xs tabular-nums text-slate-500 border-slate-200 bg-white">
                            {byYear[year].length} items
                        </Badge>
                    </div>
                    <div className="space-y-4">
                        {byYear[year].map((pub) => (
                            <PublicationCard key={pub.id} pub={pub} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

// ─── FiltersBar ───────────────────────────────────────────────────────────────

function FiltersBar({ query, onQuery, sortOrder, onSort, mobileYear, onMobileYear, years }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                    placeholder="Search by title, author, or keyword…"
                    value={query}
                    onChange={(e) => onQuery(e.target.value)}
                    className="pl-10 text-sm border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-500 hover:bg-slate-100 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-800 transition-all shadow-sm"
                />
            </div>
            <Select value={sortOrder} onValueChange={onSort}>
                <SelectTrigger className="w-full sm:w-48 text-sm bg-blue-900 text-white border-transparent hover:bg-blue-800 focus:ring-blue-800 transition-colors shadow-sm font-medium">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
            </Select>
            {/* Mobile year filter */}
            <Select
                value={mobileYear === null ? "all" : String(mobileYear)}
                onValueChange={(v) => onMobileYear(v === "all" ? null : Number(v))}
            >
                <SelectTrigger className="w-full sm:w-36 text-sm border-slate-300 bg-white text-slate-900 md:hidden shadow-sm">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

// ─── PublicationsPage (main) ──────────────────────────────────────────────────

export default function PublicationsPage() {
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [selectedYear, setSelectedYear] = useState(null);
    const [sortOrder, setSortOrder] = useState("newest");
    const [showAll, setShowAll] = useState(false);

    const years = useMemo(
        () => [...new Set(PUBLICATIONS.map((p) => p.year))].sort((a, b) => b - a),
        []
    );

    const filtered = useMemo(() => {
        let result = [...PUBLICATIONS];

        // Category filter
        const cat = CATEGORY_MAP[activeTab];
        if (cat) result = result.filter((p) => p.category === cat);

        // Year filter
        if (selectedYear) result = result.filter((p) => p.year === selectedYear);

        // Search
        if (query.trim()) {
            const q = query.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.authors.toLowerCase().includes(q) ||
                    p.abstract.toLowerCase().includes(q) ||
                    p.venue.toLowerCase().includes(q)
            );
        }

        // Sort
        result.sort((a, b) => (sortOrder === "newest" ? b.year - a.year : a.year - b.year));

        return result;
    }, [query, activeTab, selectedYear, sortOrder]);

    // Reset showAll when filters change
    const handleQuery = (v) => { setQuery(v); setShowAll(false); };
    const handleTab = (v) => { setActiveTab(v); setShowAll(false); };
    const handleYear = (v) => { setSelectedYear(v); setShowAll(false); };
    const handleSort = (v) => { setSortOrder(v); setShowAll(false); };

    const showToggle = !showAll && filtered.length > 5;

    return (
        <main className="page-shell bg-slate-50/30 min-h-screen pb-16">
            <div className="section-shell max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* ── Header Card ── */}
                <Card className="rounded-xl border border-slate-200 shadow-sm bg-white mb-8 overflow-hidden">
                    <CardContent className="p-8 md:p-10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-800">Publication Archive</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Selected Publications</h1>
                        <p className="mt-3 text-base text-slate-600 max-w-3xl">
                            Peer-reviewed publications and technical outputs grouped by year.
                        </p>

                        {/* Stats */}
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {STATS.map((s) => (
                                <StatCard key={s.label} label={s.label} value={s.value} />
                            ))}
                        </div>

                        {/* Profile links */}
                        <div className="mt-8 p-5 md:p-6 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <span className="text-sm text-slate-600 shrink-0">
                                Total Citations: <span className="font-bold text-slate-900 text-base">2,036</span>
                            </span>
                            <div className="flex flex-wrap gap-2.5">
                                {PROFILE_LINKS.map((l) => (
                                    <Button key={l.label} asChild variant="outline" size="sm" className="text-xs gap-1.5 border-slate-300 text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900">
                                        <a href={l.href} target="_blank" rel="noreferrer">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            {l.label}
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Filters + Tabs ── */}
                <div className="space-y-6 mb-8">
                    <FiltersBar
                        query={query}
                        onQuery={handleQuery}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        mobileYear={selectedYear}
                        onMobileYear={handleYear}
                        years={years}
                    />
                    <Tabs value={activeTab} onValueChange={handleTab}>
                        <TabsList className="segmented-tabs">
                            {Object.keys(CATEGORY_MAP).map((k) => (
                                <TabsTrigger key={k} value={k} className="segmented-tab-btn px-5 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm">
                                    {k}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* ── Main content: sidebar + list ── */}
                <div className="flex gap-10 items-start">
                    <SidebarYears
                        years={years}
                        selectedYear={selectedYear}
                        onSelect={handleYear}
                    />

                    <div className="flex-1 min-w-0 space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <p className="text-sm text-slate-500 font-medium">
                                Showing <span className="font-bold text-slate-900">{Math.min(showAll ? filtered.length : 5, filtered.length)}</span> of{" "}
                                <span className="font-bold text-slate-900">{filtered.length}</span> results
                            </p>
                        </div>

                        <PublicationsList publications={filtered} showAll={showAll} />

                        {showToggle && (
                            <div className="flex justify-center pt-6 pb-8">
                                <Button variant="outline" onClick={() => setShowAll(true)} className="text-sm gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-6 py-5 rounded-full shadow-sm">
                                    <FileText className="h-4 w-4" />
                                    See Complete List ({filtered.length - 5} more)
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}