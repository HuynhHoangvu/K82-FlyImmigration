import { ExternalLink, CheckCircle, Zap } from "lucide-react";
import s from "./EnglishTestSection.module.scss";
import { useT } from "@core/hooks/useT";

export default function EnglishTestSection() {
  const { t } = useT();
  const test = t("englishTest");

  return (
    <section className={s.section}>
      <div className={`fl-shell ${s.shell}`}>
        <div className="fl-max-4xl">
          <div className={s.inner}>
            <div className={s.overlay} />

            <div className={s.body}>
              <div className={s.content}>
                <div className={s.badge}>
                  <Zap size={12} className={s.badgeIcon} />
                  <span className={s.badgeText}>
                    {test.badge}
                  </span>
                </div>

                <h2 className={s.title}>
                  {test.title}{" "}
                </h2>

                <p className={s.desc}>
                  {test.desc}
                </p>

                <ul className={s.features}>
                  {test.features.map((f: string) => (
                    <li key={f} className={s.featureItem}>
                      <CheckCircle size={15} className={s.featureIcon} />
                      <span className={s.featureText}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://flytest.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.testBtn}
                >
                  {test.btn}
                  <ExternalLink size={15} className={s.testBtnIcon} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
