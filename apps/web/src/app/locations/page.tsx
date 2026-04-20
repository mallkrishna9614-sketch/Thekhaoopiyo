import { MapPin, Phone, Clock, Truck, CreditCard } from "lucide-react";

export default function LocationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-['DM_Sans']">
      <div className="text-center mb-10">
        <p className="text-[#C84B11] font-semibold text-sm uppercase tracking-widest mb-2">Come Visit Us</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A0A00]">Our Location</h1>
        <p className="text-[#1A0A00]/60 mt-2">We&apos;re easy to find — right on Parjian Road, Mehatpur</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Address card */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="bg-[#1A0A00] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#E8A020] rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#1A0A00]" />
              </div>
              <h2 className="text-[#FFF8EE] font-['Playfair_Display'] text-xl font-bold">Address</h2>
            </div>
            <p className="text-[#FFF8EE] font-semibold text-lg">The Khao Piyo Café</p>
            <p className="text-[#FFF8EE]/70 text-sm mt-1">Parjian Road</p>
            <p className="text-[#FFF8EE]/70 text-sm">Mehatpur, Punjab 144041</p>
            <p className="text-[#FFF8EE]/70 text-sm">India</p>
          </div>
          <div className="p-6 space-y-4">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 bg-[#C84B11]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-[#C84B11]" />
              </div>
              <div>
                <p className="font-semibold text-[#1A0A00] text-sm">Phone Numbers</p>
                <a href="tel:07743023125" className="text-[#C84B11] hover:underline block mt-0.5">077430 23125</a>
                <a href="tel:6284462783" className="text-[#C84B11] hover:underline block">62844-62783</a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 bg-[#C84B11]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-[#C84B11]" />
              </div>
              <div>
                <p className="font-semibold text-[#1A0A00] text-sm">Opening Hours</p>
                <div className="mt-1 space-y-0.5">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                    <div key={d} className="flex justify-between text-sm">
                      <span className="text-[#1A0A00]/60">{d}</span>
                      <span className="text-[#1A0A00] font-medium">9:00 AM – 9:30 PM</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Open Now
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 bg-[#C84B11]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 text-[#C84B11]" />
              </div>
              <div>
                <p className="font-semibold text-[#1A0A00] text-sm">Home Delivery</p>
                <p className="text-[#1A0A00]/60 text-sm mt-0.5">Estimated: 30–45 minutes</p>
                <p className="text-green-600 text-sm font-medium">FREE delivery on all orders 🎉</p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 bg-[#C84B11]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-[#C84B11]" />
              </div>
              <div>
                <p className="font-semibold text-[#1A0A00] text-sm">Payment Methods</p>
                <div className="flex gap-2 mt-1.5">
                  {["Cash", "UPI", "GPay"].map((m) => (
                    <span key={m} className="bg-[#FFF8EE] border border-[#1A0A00]/10 text-[#1A0A00] text-xs px-2.5 py-1 rounded-lg font-medium">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-6 pb-6 flex gap-3">
            <a
              href="https://www.google.com/maps/search/The+Khao+Piyo+Cafe+Mehatpur+Punjab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#1A0A00] text-[#E8A020] font-semibold py-3 rounded-xl text-center text-sm hover:bg-[#2d1200] transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Open in Maps
            </a>
            <a
              href="tel:07743023125"
              className="flex-1 bg-[#C84B11] text-white font-semibold py-3 rounded-xl text-center text-sm hover:bg-[#a83d0e] transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
          </div>
        </div>

        {/* Map embed */}
        <div className="rounded-3xl overflow-hidden shadow-md bg-white">
          <div className="bg-[#FFF8EE] p-4 border-b border-[#1A0A00]/10">
            <p className="text-sm font-semibold text-[#1A0A00]">📍 Parjian Road, Mehatpur, Punjab</p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3431!2d76.1!3d31.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMehatpur%2C+Punjab!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="w-full h-80 border-0"
            allowFullScreen
            loading="lazy"
            title="The Khao Piyo Café Location"
          />
          <div className="p-5 space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm font-medium">🚗 Easy to Find</p>
              <p className="text-amber-700 text-sm mt-1">Located on Parjian Road, Mehatpur. Landmark: Near the main market area.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FFF8EE] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[#C84B11]">5.0</p>
                <p className="text-[#1A0A00]/60 text-xs">Google Rating</p>
              </div>
              <div className="bg-[#FFF8EE] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[#C84B11]">21</p>
                <p className="text-[#1A0A00]/60 text-xs">Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
