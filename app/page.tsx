import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header/Navigation */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <nav className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">J</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Jobzy
            </span>
          </div>
          <Link
            href="/vacancies/create"
            className="px-6 py-2.5 bg-white/80 backdrop-blur-sm text-gray-800 rounded-full font-medium hover:bg-white transition-all shadow-sm hover:shadow-md"
          >
            Start nu
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">
                AI-powered recruitment tool
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              <span className="block text-gray-900">Recruitment</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                made eazy
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 leading-relaxed">
              Creëer professionele vacatureteksten in enkele minuten met onze
              AI-gestuurde wizard. Geen gedoe, gewoon resultaat.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/vacancies/create"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Maak je eerste vacature
              </Link>
              <button
                className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 rounded-full font-semibold hover:bg-white transition-all shadow-sm hover:shadow-md"
              >
                Bekijk demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-4">Vertrouwd door recruiters bij</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                <div className="text-gray-400 font-semibold">TechCorp</div>
                <div className="text-gray-400 font-semibold">InnovateBV</div>
                <div className="text-gray-400 font-semibold">StartupHub</div>
                <div className="text-gray-400 font-semibold">HRPro</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Waarom Jobzy?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alles wat je nodig hebt om professionele vacatures te maken, op één plek.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Razendsnel
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Van concept tot complete vacature in minder dan 5 minuten.
                Bespaar uren aan schrijfwerk.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI-gestuurd
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Geavanceerde AI begrijpt jouw behoeften en creëert
                professionele teksten die aansluiten.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Volledig aanpasbaar
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pas elke vacature aan naar jouw wensen. Exporteer naar
                PDF, Word of kopieer direct.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Zo werkt het
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              In drie simpele stappen naar jouw perfecte vacature
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Vul de wizard in
                </h3>
                <p className="text-gray-600">
                  Beantwoord een paar eenvoudige vragen over de functie,
                  vereisten en bedrijf.
                </p>
              </div>
              {/* Connector line - hidden on mobile */}
              <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 -translate-x-8"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  AI genereert
                </h3>
                <p className="text-gray-600">
                  Onze AI creëert een professionele vacaturetekst
                  op basis van jouw input.
                </p>
              </div>
              {/* Connector line - hidden on mobile */}
              <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2 -translate-x-8"></div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Pas aan & exporteer
                </h3>
                <p className="text-gray-600">
                  Verfijn de tekst naar wens en exporteer in het
                  gewenste format.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <Link
              href="/vacancies/create"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Begin nu gratis
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white/40 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">J</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Jobzy
                </span>
              </div>
              <p className="text-sm text-gray-600">
                © 2026 Jobzy. Recruitment made eazy.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
