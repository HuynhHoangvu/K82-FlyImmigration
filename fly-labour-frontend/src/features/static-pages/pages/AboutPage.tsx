import { Link } from "react-router-dom";
import {
  Globe,
  Users,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Play,
  X,
} from "lucide-react";
import { useT } from "@core/hooks/useT";
import CountryFlag from "@components/widgets/CountryFlag";
import { useState } from "react";
import s from "./AboutPage.module.scss";

export default function AboutPage() {
  const { t } = useT();
  const d = t("about");

  const STATS = [
    { value: "5,000+", label: d.s_workers },
    { value: "200+", label: d.s_partners },
    { value: "15+", label: d.s_countries },
    { value: "10+", label: d.s_exp },
  ];

  const SERVICES = [
    {
      icon: Globe,
      title: d.svc_l_title,
      desc: d.svc_l_desc,
    },
    {
      icon: Briefcase,
      title: d.svc_c_title,
      desc: d.svc_c_desc,
    },
    {
      icon: Users,
      title: d.svc_e_title,
      desc: d.svc_e_desc,
    },
    {
      icon: Award,
      title: d.svc_s_title,
      desc: d.svc_s_desc,
    },
  ];

  const WHYS = [d.w1, d.w2, d.w3, d.w4, d.w5, d.w6];

  const TEAM = [
    { name: "Nguyễn Văn An", role: d.t_ceo, initial: "A" },
    { name: "Trần Thị Bình", role: d.t_consultant, initial: "B" },
    { name: "Lê Minh Cường", role: d.t_legal, initial: "C" },
    { name: "Phạm Thu Dung", role: d.t_training, initial: "D" },
  ];

  // Video & Gallery
  const [showVideo, setShowVideo] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const GALLERY_IMAGES = [
    { id: 1, src: "/gallery/office-1.jpg", alt: "Văn phòng Fly Immigration" },
    { id: 2, src: "/gallery/team-1.jpg", alt: "Đội ngũ nhân viên" },
    { id: 3, src: "/gallery/event-1.jpg", alt: "Sự kiện công ty" },
    { id: 4, src: "/gallery/support-1.jpg", alt: "Hỗ trợ người lao động" },
    { id: 5, src: "/gallery/partner-1.jpg", alt: "Ký kết đối tác" },
    { id: 6, src: "/gallery/training-1.jpg", alt: "Đào tạo kỹ năng" },
  ];

  return (
    <div className={`${s.page} fl-surface-page`}>
      {/* Award Section */}
      <div className={s.awardSection}>
        <div className="fl-max-6xl">
          <div className={s.awardHeader}>
            <div className={s.awardBadge}>
              <Award size={24} />
              <span>TOP 10</span>
            </div>
            <h2 className={s.awardTitle}>{d.award_title}</h2>
            <p className={s.awardDesc}>{d.award_desc}</p>
          </div>
          <div className={s.awardImages}>
            <img src="/gallery/event-2.jpg" alt="Award 1" className={s.awardImg} onClick={() => setLightboxImage("/event-2.jpg")} />
            <img src="/gallery/event-3.jpg" alt="Award 2" className={s.awardImg} onClick={() => setLightboxImage("/event-3.jpg")} />
          </div>
        </div>
      </div>

      {/* Video & Gallery Section */}
      <div className={s.mediaSection}>
        <div className="fl-max-6xl">
          <div className={s.centerHead}>
            <p className={s.sectionBadge}>{d.v_badge}</p>
            <h2 className={s.sectionTitle}>{d.v_title}</h2>
            <p className={s.sectionSubtitle}>{d.v_desc}</p>
          </div>

          {/* Video */}
          <div className={s.videoWrapper}>
            <div
              className={s.videoThumbnail}
              onClick={() => setShowVideo(true)}
            >
              <video
                src="/video-event.mp4"
                className={s.videoImage}
                muted
                playsInline
              />
              <div className={s.playButton}>
                <Play size={32} fill="white" />
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className={s.galleryGrid}>
            {GALLERY_IMAGES.map((img) => (
              <div
                key={img.id}
                className={s.galleryItem}
                onClick={() => setLightboxImage(img.src)}
              >
                <img src={img.src} alt={img.alt} className={s.galleryImage} />
                <div className={s.galleryOverlay}>
                  <span>{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className={s.videoModal} onClick={() => setShowVideo(false)}>
          <div
            className={s.videoModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={s.closeButton}
              onClick={() => setShowVideo(false)}
            >
              <X size={24} />
            </button>
            <video
              src="/video-event.mp4"
              title="Video giới thiệu"
              className={s.videoFrame}
              controls
              autoPlay
            />
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className={s.lightbox} onClick={() => setLightboxImage(null)}>
          <button
            className={s.closeButton}
            onClick={() => setLightboxImage(null)}
          >
            <X size={24} />
          </button>
          <img src={lightboxImage} alt="Gallery" className={s.lightboxImage} />
        </div>
      )}

      <div className={s.section}>
        <div className={`${s.twoCol} fl-max-6xl`}>
          <div>
            <p className={s.sectionBadge}>{d.m_badge}</p>
            <h2 className={s.sectionTitle}>{d.m_title}</h2>
            <p className={`${s.paragraph} ${s.paragraphSpacing}`}>{d.m_desc1}</p>
            <p className={s.paragraph}>{d.m_desc2}</p>
          </div>
          <div className={s.countriesGrid}>
            {[
              { label: d.c_aus, flagCode: "australia", jobs: `1,200+ ${d.jobs}` },
              { label: d.c_can, flagCode: "canada", jobs: `800+ ${d.jobs}` },
              { label: d.c_nz, flagCode: "new_zealand", jobs: `600+ ${d.jobs}` },
              {
                label: d.c_other,
                flagCode: "other",
                jobs: Object.values(d).includes("Và nhiều hơn") ? "12+ quốc gia khác" : d.other_countries,
              },
            ].map((country) => (
              <div key={country.label} className={s.countryCard}>
                <div className="flex justify-center mb-2">
                  {country.flagCode === "other" ? (
                    <Globe size={32} className="text-amber-500" />
                  ) : (
                    <CountryFlag country={country.flagCode} style={{ width: "2.5rem", height: "auto" }} />
                  )}
                </div>
                <p className={s.countryLabel}>{country.label}</p>
                <p className={s.countryJobs}>{country.jobs}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.mutedSection}>
        <div className="fl-max-6xl">
          <div className={s.centerHead}>
            <p className={s.sectionBadge}>{d.svc_badge}</p>
            <h2 className={s.sectionTitle}>{d.svc_title}</h2>
          </div>
          <div className={s.servicesGrid}>
            {SERVICES.map((item) => (
              <div key={item.title} className={s.serviceCard}>
                <div
                  className={s.serviceIcon}
                  style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                >
                  <item.icon size={18} />
                </div>
                <h3 className={s.serviceTitle}>{item.title}</h3>
                <p className={s.serviceDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={s.contactSection}>
        <div className={`${s.contactHead} fl-max-4xl`}>
          <h2 className={s.contactTitle}>{d.ct_title}</h2>
          <p className={s.contactDesc}>{d.ct_desc}</p>
          <div className={s.contactGrid}>
            {[
              { icon: Phone, label: d.ct_hotline, value: "0866-879-755" },
              { icon: Mail, label: d.ct_email, value: "visa.service@flyimmigration.vn" },
              { icon: MapPin, label: d.ct_addr, value: "219A Nơ Trang Long, Phường Bình Thạnh, TP.HCM" },
            ].map((contact) => (
              <div key={contact.label} className={s.contactCard}>
                <contact.icon size={20} className={s.contactIcon} />
                <p className={s.contactLabel}>{contact.label}</p>
                <p className={s.contactValue}>{contact.value}</p>
              </div>
            ))}
          </div>
          <Link to="/contact" className={`btn-primary ${s.contactCta}`}>
            {d.ct_btn} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
