"use client";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF9EC] to-[#FFFFFF] text-gray-900 font-inter">
      {/* === NAVBAR === */}
      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-extrabold text-[#0D1B2A] tracking-tight font-poppins">
            SAINTARA
          </h1>
          <a
            href="#tes"
            className="px-6 py-2 bg-[#0D1B2A] text-white rounded-lg font-semibold hover:bg-[#A87C2D] transition"
          >
            Mulai Tes
          </a>
        </div>
      </nav>

      {/* === HERO === */}
      <section className="pt-36 pb-20 text-center bg-gradient-to-b from-[#F8C44B]/90 to-[#FFF8E1]">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#0D1B2A] font-poppins leading-tight">
            Kenali{" "}
            <span className="text-[#A87C2D]">Karakter Alami</span> dan Potensi
            Mendalam Anda
          </h1>
          <p className="mt-6 text-lg text-gray-800 leading-relaxed">
            Temukan cetak biru alami kepribadian Anda untuk memahami kekuatan
            sejati dan menjadi diri Anda seutuhnya — untuk individu, keluarga,
            maupun tim.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#tes"
              className="bg-[#0D1B2A] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#A87C2D] transition-transform transform hover:scale-105"
            >
              Coba Tes Sekarang
            </a>
            <a
              href="#mitra"
              className="border-2 border-[#0D1B2A] text-[#0D1B2A] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#0D1B2A] hover:text-white transition-transform transform hover:scale-105"
            >
              Daftar Kemitraan
            </a>
          </div>
        </div>
      </section>

      {/* === MENGAPA SAINTARA === */}
      <section id="mengapa" className="py-24 bg-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#0D1B2A] mb-6 font-poppins">
            Mengapa Memilih Saintara?
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Saintara membantu Anda memahami potensi alami dan menemukan cara
            terbaik untuk bertumbuh secara autentik. Dengan pendekatan ilmiah,
            kami membuka jalan bagi Anda untuk mengenal diri lebih dalam tanpa
            menghakimi.
          </p>
        </div>
      </section>

      {/* === FITUR === */}
      <section
        id="fitur"
        className="py-20 bg-gradient-to-b from-[#FFF8E1] to-[#FDF6D5]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#0D1B2A] font-poppins">
            Apa yang Akan Anda Dapatkan?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              "Laporan 35 Aspek Kepribadian",
              "Potensi Karier Terbaik",
              "Kecocokan Hubungan",
              "Manajemen Emosi",
              "Pemicu Stres & Solusinya",
              "Gaya Komunikasi Alami",
            ].map((title, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl shadow-md border border-[#F8C44B]/50 hover:shadow-xl hover:-translate-y-1 transition"
              >
                <h3 className="text-lg font-semibold text-[#0D1B2A] mb-3">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Temukan pemahaman mendalam tentang diri Anda berdasarkan data
                  saintifik dan refleksi alami.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section
        id="tes"
        className="py-24 bg-gradient-to-r from-[#0D1B2A] to-[#1B263B] text-center text-white"
      >
        <h2 className="text-4xl font-extrabold font-poppins mb-6">
          Siap Menemukan Potensi Terbaik Anda?
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Mulailah perjalanan Anda hari ini dan temukan kekuatan alami yang
          tersembunyi bersama Saintara.
        </p>
        <div className="mt-10">
          <a
            href="#"
            className="bg-[#F8C44B] text-[#0D1B2A] px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#A87C2D] hover:text-white transition-transform transform hover:scale-105"
          >
            Ikuti Tes Sekarang
          </a>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#0D1B2A] text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © 2025 Saintara. Semua hak cipta dilindungi.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#F8C44B]">
              Privacy
            </a>
            <a href="#" className="hover:text-[#F8C44B]">
              Terms
            </a>
            <a href="#" className="hover:text-[#F8C44B]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
