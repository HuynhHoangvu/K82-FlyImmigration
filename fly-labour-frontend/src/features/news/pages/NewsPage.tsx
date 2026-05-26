import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, ArrowRight, Newspaper, Loader2 } from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import { formatDate } from "@core/utils/helpers";
import { useT } from "@core/hooks/useT";
import s from "./NewsPage.module.scss";

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

export default function NewsPage() {
  const [search, setSearch] = useState("");
  const { t, lang } = useT();
  const nTranslation = t("news");

  const newsQuery = useQuery<NewsItem[]>({
    queryKey: ["news"],
    queryFn: async () => {
      const response = await newsApi.getAll();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const news = newsQuery.data ?? [];
  const isLoading = newsQuery.isLoading;

  const filtered = news.filter((n) => {
    const title = lang === 'en' ? n.titleEn || n.title : n.title;
    const excerpt = lang === 'en' ? n.excerptEn || n.excerpt : n.excerpt;
    return (
      !search ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      (excerpt || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className={`${s.page} fl-surface-page`}>
      <div className={`fl-strip-breadcrumb ${s.headerStrip}`}>
        <div className={`fl-container-7xl ${s.headerInner}`}>
          <div className={s.badge}>
            <Newspaper size={14} className={s.badgeIcon} />
            <span className={s.badgeText}>
              {nTranslation.magazine}
            </span>
          </div>
          <h1 className={s.title}>
            <span className="gradient-text">{nTranslation.subtitle}</span>
          </h1>
          <p className={`${s.desc} fl-max-2xl`}>
            {nTranslation.description}
          </p>
        </div>
      </div>

      <div className={`fl-container-7xl ${s.content}`}>
        <div className={`fl-max-2xl ${s.searchWrap}`}>
          <Search size={20} className={s.searchIcon} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={nTranslation.searchPlaceholder}
            className={s.searchInput}
          />
        </div>

        {isLoading ? (
          <div className={s.loadingWrap}>
            <Loader2 size={40} className={`animate-spin ${s.loader}`} />
            <p className={s.loadingText}>
              {nTranslation.loading}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`${s.empty} fl-max-3xl`}>
            <div className={s.emptyEmoji}>🏜️</div>
            <p className={s.emptyTitle}>
              {nTranslation.emptyTitle}
            </p>
            <p className={s.emptyDesc}>
              {nTranslation.emptyDesc}
            </p>
          </div>
        ) : (
          <div className={s.sections}>
            {featured && (
              <div className={s.featuredBlock}>
                <div className={s.featuredHeading}>
                  <div className={s.featuredLine} />
                  <h2 className={s.featuredLabel}>
                    {nTranslation.todayFocus}
                  </h2>
                  <div className={s.featuredLine} />
                </div>

                <Link to={`/news/${featured.slug}`} className={s.featuredLink}>
                  <div className={`${s.cardBase} ${s.featuredCard}`}>
                    <div className={s.featuredImage}>
                      {featured.image ? (
                        <img
                          src={getImageUrl(featured.image)}
                          alt={lang === 'en' ? featured.titleEn || featured.title : featured.title}
                          className={s.img}
                        />
                      ) : (
                        <div className={s.placeholder}>
                          📰
                        </div>
                      )}
                      <div className={s.trendBadge}>
                        🔥 {nTranslation.trending || 'Trending'}
                      </div>
                    </div>
                    <div className={s.featuredBody}>
                      <div className={s.meta}>
                        <Calendar size={14} className={s.metaIcon} />
                        {formatDate(featured.createdAt)}
                      </div>
                      <h2 className={s.featuredTitle}>
                        {lang === 'en' ? featured.titleEn || featured.title : featured.title}
                      </h2>
                      {(lang === 'en' ? featured.excerptEn || featured.excerpt : featured.excerpt) && (
                        <p className={s.featuredExcerpt}>
                          {lang === 'en' ? featured.excerptEn || featured.excerpt : featured.excerpt}
                        </p>
                      )}
                      <span className={s.featuredCta}>
                        {lang === 'en' ? 'Explore details' : 'Khám phá chi tiết'} <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className={s.listGrid}>
              {rest.map((article) => {
                const title = lang === 'en' ? article.titleEn || article.title : article.title;
                const excerpt = lang === 'en' ? article.excerptEn || article.excerpt : article.excerpt;
                return (
                  <Link
                    key={article.id}
                    to={`/news/${article.slug}`}
                    className={`${s.cardBase} ${s.listCard}`}
                  >
                    <div className={s.listImage}>
                      {article.image ? (
                        <img
                          src={getImageUrl(article.image)}
                          alt={title}
                          className={s.img}
                        />
                      ) : (
                        <div className={s.placeholder}>
                          📰
                        </div>
                      )}
                    </div>
                    <div className={s.listBody}>
                      <div className={s.meta}>
                        <Calendar size={12} className={s.metaIcon} />
                        {formatDate(article.createdAt)}
                      </div>
                      <h3 className={s.listTitle}>
                        {title}
                      </h3>
                      {excerpt && (
                        <p className={s.listExcerpt}>
                          "{excerpt}"
                        </p>
                      )}
                      <div className={s.listFooter}>
                        <span className={s.readMore}>
                          {nTranslation.readMore}
                        </span>
                        <div className={s.arrowBox}>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
