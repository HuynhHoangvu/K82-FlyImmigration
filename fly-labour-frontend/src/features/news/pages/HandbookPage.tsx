import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import { formatDate } from "@core/utils/helpers";
import { useT } from "@core/hooks/useT";
import s from "./HandbookPage.module.scss";

interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt: string;
  excerptEn?: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

export default function HandbookPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { lang } = useT();

  useEffect(() => {
    newsApi
      .getAllHandbook()
      .then((r) => {
        setItems(r.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((n) => {
    const title = lang === 'en' ? n.titleEn || n.title : n.title;
    const excerpt = lang === 'en' ? n.excerptEn || n.excerpt : n.excerpt;
    return (
      !search ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      (excerpt || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className={`${s.page} fl-surface-page`}>
      <div className={`fl-strip-breadcrumb ${s.headerStrip}`}>
        <div className={`fl-container-7xl ${s.headerInner}`}>
          <div className={s.badge}>
            <BookOpen size={14} className={s.badgeIcon} />
            <span className={s.badgeText}>
              {lang === 'en' ? 'Immigration & Visa Handbook' : 'Cẩm nang định cư & Visa'}
            </span>
          </div>
          <h1 className={s.title}>
            <span className="gradient-text">
              {lang === 'en' ? 'FLY LABOUR Handbook' : 'Cẩm nang FLY LABOUR'}
            </span>
          </h1>
          <p className={`${s.desc} fl-max-2xl`}>
            {lang === 'en'
              ? 'All experiences, processes, and important notes when starting your journey to conquer the world.'
              : 'Toàn bộ kinh nghiệm, quy trình và những lưu ý quan trọng khi bắt đầu hành trình vươn tầm thế giới.'}
          </p>
        </div>
      </div>

      <div className={`fl-container-7xl ${s.content}`}>
        <div className={`fl-max-2xl ${s.searchWrap}`}>
          <Search size={20} className={s.searchIcon} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search documents, guides...' : 'Tìm kiếm tài liệu, hướng dẫn...'}
            className={s.searchInput}
          />
        </div>

        {loading ? (
          <div className={s.loadingWrap}>
            <Loader2 size={40} className={`animate-spin ${s.loader}`} />
            <p className={s.loadingText}>
              {lang === 'en' ? 'Searching handbook...' : 'Đang tra cứu cẩm nang...'}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`${s.empty} fl-max-3xl`}>
            <div className={s.emptyEmoji}>📚</div>
            <p className={s.emptyTitle}>
              {lang === 'en' ? 'No content found' : 'Không tìm thấy nội dung'}
            </p>
            <p className={s.emptyDesc}>
              {lang === 'en'
                ? 'You can try searching by country name or visa type.'
                : 'Bạn có thể thử tìm kiếm theo tên quốc gia hoặc loại visa.'}
            </p>
          </div>
        ) : (
          <div className={s.grid}>
            {filtered.map((item) => {
              const title = lang === 'en' ? item.titleEn || item.title : item.title;
              const excerpt = lang === 'en' ? item.excerptEn || item.excerpt : item.excerpt;
              return (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className={s.card}
                >
                  <div className={s.imageWrap}>
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={title}
                        className={s.img}
                      />
                    ) : (
                      <div className={s.placeholder}>
                        📖
                      </div>
                    )}
                    <div className={s.overlay}>
                       <span className={s.overlayText}>
                          {lang === 'en' ? 'Read document' : 'Đọc tài liệu'} <ArrowRight size={14} />
                       </span>
                    </div>
                  </div>
                  <div className={s.body}>
                    <div className={s.meta}>
                      <Calendar size={12} className={s.metaIcon} />
                      {formatDate(item.createdAt)}
                    </div>
                    <h3 className={s.cardTitle}>
                      {title}
                    </h3>
                    {excerpt && (
                      <p className={s.excerpt}>
                        {excerpt}
                      </p>
                    )}
                    <div className={s.footer}>
                       <BookOpen size={16} className={s.footerIcon} />
                       <span className={s.footerText}>
                          {lang === 'en' ? 'View details' : 'Xem chi tiết'}
                       </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
