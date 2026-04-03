import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-8 py-24 md:py-32 bg-gradient-to-b from-white to-gray-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto">

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          Welcome to the <span className="text-blue-600">CINT Lab</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
          Advancing the frontiers of Computer Science through innovative research in Artificial Intelligence, Systems, and Algorithms.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/team"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            Meet Our Team
          </Link>
          <Link
            href="/research"
            className="bg-white text-blue-900 border-2 border-gray-200 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-300 hover:bg-blue-50 transition shadow-sm"
          >
            Explore Our Research
          </Link>
        </div>

      </div>
    </main>
  );
}