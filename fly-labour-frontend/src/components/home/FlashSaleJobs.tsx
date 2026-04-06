import { useState, useEffect, useRef } from "react";
import { Flame, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import { jobsApi } from "@/services/api";
import { useT } from "@/hooks/useT";
import type { Job } from "@/types";

function Countdown() {
  const [time, setTime] = useState({ h: 1, m: 59, s: 47 });
  const { t } = useT();
  const h = t("home");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 1, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <Clock size={16} className="text-red-500 animate-pulse" />
      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
        {h.endsIn}
      </span>
      <div className="flex items-center gap-1">
        {[time.h, time.m, time.s].map((v, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="bg-gradient-to-b from-red-500 to-red-700 text-white text-sm font-mono font-bold px-2 py-1 rounded shadow-md border border-red-400">
              {pad(v)}
            </span>
            {i < 2 && (
              <span className="text-red-500 font-bold text-sm animate-pulse">
                :
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FlashSaleJobs() {
  const [hotJobs, setHotJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    jobsApi
      .getHot()
      .then((res) => setHotJobs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Badge FLASH JOBS */}
            <div className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 rounded-xl px-5 py-2.5 shadow-[0_0_20px_rgba(239,68,68,0.45)] border border-red-400/50 overflow-hidden group">
              {/* Shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              <Flame
                size={22}
                className="text-yellow-300 fill-yellow-300 animate-pulse drop-shadow-[0_0_6px_rgba(253,224,71,0.9)] relative z-10"
              />
              <span className="font-display font-black text-xl text-white tracking-widest uppercase drop-shadow-md relative z-10">
                FLASH JOBS
              </span>
              <Flame
                size={22}
                className="text-yellow-300 fill-yellow-300 animate-pulse drop-shadow-[0_0_6px_rgba(253,224,71,0.9)] relative z-10"
              />
            </div>
            <Countdown />
          </div>

          {/* Scroll buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-xl border border-theme-border-default bg-theme-surface flex items-center justify-center text-theme-text-secondary hover:text-theme-accent-primary hover:border-orange-400 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-xl border border-theme-border-default bg-theme-surface flex items-center justify-center text-theme-text-secondary hover:text-theme-accent-primary hover:border-orange-400 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-none w-72 h-52 bg-theme-surfaceSecondary rounded-2xl animate-pulse border border-theme-border-default"
              />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {hotJobs.map((job) => (
              <div key={job.id} className="flex-none w-72 snap-start">
                <JobCard job={job} compact />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      </div>
    </section>
  );
}
