import { Activity, Instagram, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3 font-heading text-lg font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white overflow-hidden">
              <Image src="/logo.png" alt="Mercer Fitness Logo" width={40} height={40} className="object-cover" />
            </span>
            Mercer Fitness
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Premium class booking for energetic, approachable wellness studios.
          </p>
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold">Explore</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <a href="/#classes">Featured classes</a>
            <a href="/schedule">Weekly schedule</a>
            <a href="/dashboard">Studio dashboard</a>
          </div>
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@mercer.fit</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> New York, NY</span>
            <span className="flex items-center gap-2"><Instagram className="h-4 w-4" /> @mercerfitness</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
