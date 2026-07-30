import { Calendar, Phone, BookOpen, Flame, Users, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-red-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight">
            Authentic Vedic Rituals & <br className="hidden md:block" /> Astrological Guidance
          </h1>
          <p className="text-lg md:text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            Expert Pandit and Jyotishacharya services for Vivah, Griha Pravesh, and Havan across Indore, Dewas, and surrounding regions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#book" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition shadow-lg text-lg">
              Book a Puja
            </a>
            <a href="/muhurat" className="px-8 py-4 bg-transparent border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-bold rounded-lg transition text-lg flex items-center justify-center gap-2">
              <Calendar size={20} />
              Check Today's Muhurat
            </a>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif text-slate-900">Primary Services</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Shadi Byah & Vivah</h3>
            <p className="text-slate-600 mb-4 line-clamp-3">
              Complete Vedic marriage ceremonies, including Kundli Milan, Haldi, Phere, and precise Muhurat calculations for a prosperous union.
            </p>
            <a href="/services" className="text-red-800 font-semibold hover:text-orange-600 transition">Read More &rarr;</a>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
              <Flame size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Havan & Yagya</h3>
            <p className="text-slate-600 mb-4 line-clamp-3">
              Purify your home or business with authentic Navagraha Shanti, Rudrabhishek, and Vastu Havans performed with strict adherence to shastras.
            </p>
            <a href="/services" className="text-red-800 font-semibold hover:text-orange-600 transition">Read More &rarr;</a>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
              <Star size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Jyotish & Kundli</h3>
            <p className="text-slate-600 mb-4 line-clamp-3">
              Detailed astrological consultations, dosha remedies, and personalized gemstone recommendations based on your exact birth chart.
            </p>
            <a href="/services" className="text-red-800 font-semibold hover:text-orange-600 transition">Read More &rarr;</a>
          </div>
        </div>
      </section>

      {/* 3. TRUST & LEAD CAPTURE SECTION */}
      <section id="book" className="bg-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          
          {/* Trust Text */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Request a Consultation</h2>
            <p className="text-slate-700 mb-6 text-lg">
              Provide your details and the service you require. We will review the Panchang and contact you to finalize the auspicious timing.
            </p>
            <div className="flex items-center gap-4 text-slate-800 font-medium">
              <Phone className="text-orange-600" />
              <span>Direct Inquiry: +91 98765 43210</span>
            </div>
          </div>

          {/* Quick Lead Form */}
          <div className="flex-1 w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <form className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="+91" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Required</label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white">
                  <option>Vivah / Marriage</option>
                  <option>Griha Pravesh</option>
                  <option>Havan / Yagya</option>
                  <option>Astrology Consultation</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="button" className="w-full py-4 bg-red-900 text-white font-bold rounded-lg hover:bg-red-800 transition mt-2">
                Submit Request
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}