import { ExternalLink, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@core/hooks/useT";
import s from "./EnglishTestCtaRow.module.scss";

const EnglishTestCtaRow = () => {
  const { t } = useT();
  const h = t("home");
  const test = t("englishTest");

  return (
    <section className={s.section}>
      <div className="fl-shell">
        <div className={s.grid}>

          <div className={`${s.card} ${s.leftCard}`}>
            <div className={s.cardBg} />
            <div className={s.leftBody}>
              <div className={s.badge}>
                <Zap size={12} className={s.badgeIcon} />
                <span className={s.badgeText}>
                  {test.badge}
                </span>
              </div>

              <h2 className={s.leftTitle}>
                {test.title}
              </h2>

              <p className={s.leftDesc}>
                {test.desc}
              </p>

              <ul className={s.featureList}>
                {test.features.map((f: string) => (
                  <li key={f} className={s.featureItem}>
                    <CheckCircle
                      size={15}
                      className={s.featureIcon}
                    />
                    <span className={s.featureText}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={s.testBtnWrap}>
                <a
                  href="https://flytest.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  {test.btn}
                  <ExternalLink
                    size={15}
                    className={s.testBtnIcon}
                  />
                </a>
              </div>
            </div>
          </div>
 
          <div className={`${s.card} ${s.rightCard}`}>
            <div className={s.cardBg} />
            <div className={s.rightBody}>
              <p className={s.rightBadge}>
                {h.ctaBadge}
              </p>
              <h2 className={s.rightTitle}>
                {h.ctaTitle}
                <br />
                <span className="gradient-text">{h.ctaTitleAccent}</span>
              </h2>
              <p className={s.rightDesc}>
                {h.ctaDesc}
              </p>
              <div className={s.ctaActions}>
                <Link to="/register" className="btn-primary">
                  {h.ctaRegister}
                </Link>
                <Link
                  to="/contact"
                  className="btn-outline"
                >
                  {h.ctaConsult}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default EnglishTestCtaRow;
