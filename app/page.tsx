import { ContactActions, MobileNavigation } from '@/components/interactions';
import { Feed } from '@/components/feed';

const navigation = [
  ['About', '#overview'],
  ['Stream', '#stream'],
  ['Experience', '#experience'],
  ['Capabilities', '#capabilities'],
  ['Education', '#education'],
] as const;

const specialties = [
  {
    number: '01',
    eyebrow: 'MOBILE ENGINEERING',
    title: 'Native iOS & Flutter',
    description: 'Mobile product development across Flutter, Swift, and Apple platform integrations.',
    tags: ['Flutter', 'Swift', 'SwiftUI'],
  },
  {
    number: '02',
    eyebrow: 'FINANCIAL PRODUCTS',
    title: 'Apps for everyday finance',
    description: 'Experience building and maintaining consumer banking, benefits, and fitness applications.',
    tags: ['iOS', 'Payments', 'Product'],
  },
  {
    number: '03',
    eyebrow: 'BACKEND SYSTEMS',
    title: 'Scala & cloud services',
    description: 'REST microservices and backend systems built with Scala, PostgreSQL, and AWS.',
    tags: ['Scala', 'REST', 'AWS'],
  },
];

const experience = [
  {
    period: '2018 — NOW',
    company: 'SPENDIT AG · MUNICH',
    role: 'Full-Stack Software Developer',
    description: 'Lead developer and release owner for the spendit / myBenefits mobile apps. Built the Flutter app from scratch, integrated Solaris Bank, and delivered Apple Pay and Apple Watch wallet payments. Designed REST microservices in Scala on AWS.',
    tags: ['Flutter', 'Swift', 'Scala', 'AWS', 'CircleCI'],
  },
  {
    period: '2017 — 2018',
    company: 'OUTBANK · VERIVOX GMBH',
    role: 'iOS Developer',
    description: 'Feature development and fixes for a production banking app, with contributions to the macOS application.',
    tags: ['Swift', 'RxSwift', 'macOS'],
  },
  {
    period: '2015 — 2017',
    company: 'FREELETICS GMBH · MUNICH',
    role: 'iOS Developer',
    description: 'Feature development for a high-scale fitness app used by millions of users worldwide.',
    tags: ['Swift', 'iOS'],
  },
  {
    period: '2012 — 2015',
    company: 'WIRECARD AG',
    role: 'Online Marketing Manager',
    description: 'Owned SEO, SEM, and affiliate strategy across markets.',
    tags: ['SEO', 'SEM'],
  },
];

const matrix = [
  { index: '01 // MOBILE', title: 'Mobile & UI', rows: [['Flutter · Dart', 'App'], ['Swift · SwiftUI', 'iOS'], ['RxSwift · Combine', 'Reactive'], ['Apple Pay · Watch', 'APIs']] },
  { index: '02 // BACKEND', title: 'Backend & data', rows: [['Scala · Python', 'Code'], ['REST APIs', 'Web'], ['PostgreSQL', 'Data']] },
  { index: '03 // DELIVERY', title: 'DevOps & tooling', rows: [['Git · CircleCI', 'CI/CD'], ['Fastlane · Firebase', 'Mobile'], ['AWS', 'Cloud']] },
  { index: '04 // LANGUAGES', title: 'Languages', rows: [['Spanish', 'Native'], ['English', 'C2'], ['German', 'C1'], ['Swedish', 'A1']] },
];

const socialLinks = [
  ['GitHub', 'https://github.com/leyvaje'],
  ['LinkedIn', 'https://linkedin.com/in/-leyva'],
  ['Twitter', 'https://twitter.com/leyvaje'],
  ['Instagram', 'https://instagram.com/leyvajex'],
  ['SoundCloud', 'https://soundcloud.com/leyvaje'],
] as const;

function SectionHeading({ eyebrow, title, note, id }: { eyebrow: string; title: string; note?: string; id?: string }) {
  return (
    <div className="section-heading" id={id}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id ? `${id}-title` : undefined}>{title}</h2>
      </div>
      {note ? <p className="section-note">{note}</p> : null}
    </div>
  );
}

function TagList({ tags }: { tags: readonly string[] }) {
  return <div className="tags">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>;
}

export default function Home() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#overview" aria-label="Leyvaje, back to top">leyvaje.</a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <div className="topbar-actions">
            <span className="location-chip"><span className="status-dot" /> Attendorn, Germany</span>
            <a className="button button-dark header-contact" href="#contact">Get in touch</a>
            <MobileNavigation items={navigation} />
          </div>
        </div>
      </header>

      <main>
        <section className="hero section-wrap" id="overview">
          <div className="frame hero-frame">
            <div className="titlebar">
              <span><i className="status-dot" /> MOBILE & FULL-STACK ENGINEER</span>
              <span>ATTENDORN / GERMANY <b>·</b> 10+ YEARS IN SOFTWARE</span>
            </div>
            <div className="hero-content">
              <p className="eyebrow hero-label">INDEPENDENT ENGINEERING · PRODUCT MINDED</p>
              <h1>Jose Enrique<br /><span>Leyva</span></h1>
              <p className="hero-subtitle">Building mobile products and the systems behind them.</p>
              <div className="hero-bottom">
                <p className="hero-copy">Full-stack and mobile developer with 10+ years building production-grade apps — iOS, Flutter, and backend systems. Based in Attendorn, Germany.</p>
                <div className="hero-actions">
                  <ContactActions />
                  <a className="button button-soft" href="#stream">Explore the stream ↓</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap specialties-section" aria-labelledby="specialties-title">
          <div className="section-ruler"><span id="specialties-title">CORE SPECIALTIES</span><span>EXPERIENCE ACROSS THE STACK</span></div>
          <div className="specialties-grid">
            {specialties.map((item) => (
              <article className="frame specialty-card" key={item.number}>
                <div className="titlebar"><span>{item.number} · {item.eyebrow}</span><i className="status-dot" /></div>
                <div className="card-body"><h3>{item.title}</h3><p>{item.description}</p></div>
                <TagList tags={item.tags} />
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap stream-section" aria-labelledby="stream-title">
          <SectionHeading id="stream" eyebrow="LEYVAJE // NOTES, PHOTOS & AUDIO" title="Dynamic stream" note="A personal feed of engineering notes, snapshots, and music." />
          <Feed />
        </section>

        <section className="section-wrap experience-section" aria-labelledby="experience-title">
          <SectionHeading id="experience" eyebrow="CAREER RECORD // PRODUCT & ENGINEERING" title="Experience" note="Mobile apps, financial products, and backend systems." />
          <div className="experience-grid">
            {experience.map((job, index) => (
              <article className={`frame experience-card ${index > 1 ? 'experience-card-compact' : ''}`} key={job.company}>
                <div className="titlebar"><span><i className="status-dot" /> {job.company}</span><span>{job.period}</span></div>
                <div className="experience-body"><div><h3>{job.role}</h3><p>{job.description}</p><TagList tags={job.tags} /></div></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap capabilities-section" aria-labelledby="capabilities-title">
          <SectionHeading id="capabilities" eyebrow="CORE COMPETENCE" title="Technical matrix" note="Tools and technologies used across mobile, backend, and delivery." />
          <div className="matrix-grid">
            {matrix.map((column) => (
              <article className="frame matrix-card" key={column.index}>
                <div className="titlebar"><span>{column.index}</span></div>
                <div className="matrix-body"><h3>{column.title}</h3><dl>{column.rows.map(([skill, level]) => <div key={skill}><dt>{skill}</dt><dd>{level}</dd></div>)}</dl></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap education-section" aria-labelledby="education-title">
          <SectionHeading id="education" eyebrow="ACADEMIC BACKGROUND" title="Education" />
          <div className="education-grid">
            <article className="frame education-card"><div className="titlebar"><span>M.SC. // ECONOMICS</span><span>SWEDEN</span></div><div className="education-body"><h3>Jönköping International Business School</h3></div></article>
            <article className="frame education-card"><div className="titlebar"><span>B.A. // MARKETING</span><span>MEXICO</span></div><div className="education-body"><h3>Universidad Anáhuac Mayab</h3></div></article>
          </div>
        </section>

        <section className="contact-wrap" id="contact">
          <div className="frame contact-card">
            <div className="titlebar"><span><i className="status-dot" /> LEYVAJE // DIRECT COMMUNICATION</span><span>ATTENDORN</span></div>
            <div className="contact-content"><p className="eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let’s build something useful.</h2><p>Based in Attendorn, Germany. Reach out about engineering, mobile apps, or product work.</p><div className="contact-actions"><a className="button button-dark" href="mailto:jose@leyvaje.com">Send email ↗</a><ContactActions compact /></div><div className="project-links"><span className="eyebrow">MORE FROM THE SITE</span><a href="/art/">Interactive art ↗</a><a href="/beatmaker">Beat maker ↗</a><a href="/chillbill">ChillBill ↗</a><a href="/two-in-flow/">Two in Flow ↗</a><a href="/assets/documents/jose_leyva_cv_2026.pdf">Download CV ↗</a></div><div className="social-links">{socialLinks.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}</div></div>
          </div>
        </section>
      </main>

      <footer className="footer"><span>© 2026 Jose Enrique Leyva N. · Attendorn, Germany</span><span>SYSTEMS, MOBILE & PRODUCT ENGINEERING</span></footer>
    </>
  );
}
