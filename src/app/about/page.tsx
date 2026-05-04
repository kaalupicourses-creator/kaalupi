import { siteConfig, valueProps } from "@/lib/data";

export default function AboutPage() {
  return (
    <div className="bg-[#FEFBF5]">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7AB648]">
            About Kaalupi
          </p>
          <h1 className="mt-6 text-4xl font-extrabold text-[#2D5016] md:text-5xl">
            Platform kursus IT yang{" "}
            <span className="text-[#F5A62A]">serius soal kualitas</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#444444]">
            Kaalupi dirancang sebagai tempat belajar teknologi yang tidak hanya menjual akses video,
            tapi juga menjual struktur, arah, dan kejelasan outcome.
          </p>
        </div>
      </section>

      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6]">
                <svg className="h-6 w-6 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#2D5016]">Visi</h2>
              <p className="mt-4 text-sm leading-7 text-[#444444]">
                Menjadi platform pembelajaran IT yang membantu lebih banyak orang membangun skill digital
                berkualitas tinggi dengan pendekatan yang praktis, kredibel, dan relevan dengan kebutuhan industri.
              </p>
            </div>

            <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3D6]">
                <svg className="h-6 w-6 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#2D5016]">Misi</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#444444]">
                {[
                  "Menyediakan learning path yang jelas untuk berbagai jalur karier IT",
                  "Menghubungkan materi, proyek, dan assessment dalam satu alur belajar",
                  "Mendorong instructor untuk membangun materi yang rapi dan bernilai jual",
                  "Menyiapkan fondasi platform untuk operasi course marketplace yang real",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="mt-1 h-4 w-4 flex-shrink-0 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-[#2D5016]">Kenapa Kaalupi?</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {valueProps.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-[#F0E8D8] bg-white p-6 transition hover:border-[#F5A62A] hover:shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFF3D6] font-bold text-[#F5A62A]">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-7 text-[#444444]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#F0E8D8]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-2xl border border-[#F0E8D8] bg-white p-8">
            <h2 className="text-2xl font-bold text-[#2D5016]">Hubungi Kami</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {[
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: siteConfig.email },
                { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: siteConfig.phone },
                { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", label: siteConfig.address },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-[#F5A62A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="text-sm text-[#444444]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
