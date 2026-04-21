import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useQuery } from "@tanstack/react-query";
import JobCard from "@/plugins/jobs/components/JobCard";
import { jobsApi } from "@/core/services/api";
import { useT } from "@/core/hooks/useT";
import type { Job } from "@/core/types";

// @ts-ignore
import "swiper/swiper-bundle.css";

const digitVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

function Digit({ value }: { value: string }) {
  return (
    <div className="flex h-9 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-mono text-lg font-bold shadow-sm shadow-slate-900/20">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          variants={digitVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="absolute"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Countdown() {
  const [time, setTime] = useState({ h: 1, m: 59, s: 47 });
  const { t } = useT();
  const h = t("home");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 1, m: 59, s: 59 };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const digits = useMemo(() => [pad(time.h), pad(time.m), pad(time.s)], [time]);

  return (
    <div className="flex items-center gap-3">
      <Clock size={16} className="text-red-500" />
      <div className="flex items-center gap-4 rounded-3xl bg-slate-100/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200 dark:bg-slate-900/70 dark:text-brand-muted dark:shadow-none backdrop-blur-sm transition-colors">
        <span>{h.endsIn}</span>
        <div className="flex items-center gap-2">
          {digits.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <Digit value={value} />
              {index < digits.length - 1 && (
                <span className="text-red-500 font-semibold">:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FlashSaleJobs() {
  const hotJobsQuery = useQuery<Job[], Error>({
    queryKey: ["hotJobs"],
    queryFn: async () => {
      const response = await jobsApi.getHot();
      return response.data as Job[];
    },
    staleTime: 1000 * 60 * 2,
  });

  const swiperRef = useRef<SwiperType | null>(null);
  const jobs = hotJobsQuery.data ?? [];
  const isLoading = hotJobsQuery.isLoading;

  return (
    <section className="py-16 transition-colors duration-300">
      <div className="w-full px-4 md:px-8 xl:px-12">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2.5 shadow-lg shadow-red-200/30 text-white">
              <Flame size={20} className="fill-yellow-400 text-yellow-400 animate-pulse" />
              <span className="font-bold text-lg italic tracking-tight">FLASH JOBS</span>
            </div>
            <Countdown />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-amber-400 hover:text-amber-600 dark:border-brand-border dark:bg-brand-card dark:text-brand-muted dark:hover:border-brand-gold/50 dark:hover:text-brand-gold flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-amber-400 hover:text-amber-600 dark:border-brand-border dark:bg-brand-card dark:text-brand-muted dark:hover:border-brand-gold/50 dark:hover:text-brand-gold flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] w-full rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse ring-1 ring-slate-200 dark:ring-brand-border"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <Swiper
                modules={[Autoplay, Navigation]}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                spaceBetween={16}
                slidesPerView={1}
                loop={jobs.length > 3}
                autoplay={{ delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{
                  480:  { slidesPerView: 2, spaceBetween: 16 },
                  768:  { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 20 },
                  1280: { slidesPerView: 4, spaceBetween: 24 },
                  1536: { slidesPerView: 5, spaceBetween: 24 },
                }}
                className="pb-4"
              >
                {jobs.map((job, index) => (
                  <SwiperSlide key={job.id} className="h-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.04 }}
                      className="h-full"
                    >
                      <JobCard job={job} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      </div>
    </section>
  );
}
