import { ContactActions, MobileNavigation } from '@/components/interactions';
import { Feed } from '@/components/feed';

const navigation = [
  ['Hero', '#overview'],
  ['Dynamic stream', '#stream'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Technical matrix', '#capabilities'],
  ['Education', '#education'],
  ['Contact', '#contact'],
] as const;

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
  {
    period: '2011 — 2012',
    company: 'TRIVAGO',
    role: 'Online Marketing',
    description: 'Online marketing work at trivago.',
    tags: ['Online Marketing'],
  },
  {
    period: '2007 — 2009',
    company: 'MEXICO',
    role: 'Branding Manager',
    description: 'Brand strategy and management in Mexico.',
    tags: ['Branding', 'Marketing'],
  },
];

const matrix = [
  { index: '01 // MOBILE', title: 'Mobile & UI', rows: [['Flutter · Dart', 'App'], ['Swift · SwiftUI', 'iOS'], ['RxSwift · Combine', 'Reactive'], ['Apple Pay · Watch', 'APIs']] },
  { index: '02 // BACKEND', title: 'Backend & data', rows: [['Scala · Python', 'Code'], ['REST APIs', 'Web'], ['PostgreSQL', 'Data']] },
  { index: '03 // DELIVERY', title: 'DevOps & tooling', rows: [['Git · CircleCI', 'CI/CD'], ['Fastlane · Firebase', 'Mobile'], ['AWS', 'Cloud']] },
];

const projects = [
  { name: 'ChillBill', href: '/chillbill', detail: 'Personal finance app', status: 'LIVE' },
  { name: 'Two in Flow', href: '/two-in-flow/', detail: 'A shared space for two', status: 'LIVE' },
  { name: 'PlaySpotWhee', href: 'https://playspot-whee.vercel.app', detail: 'Find a place to play', status: 'LIVE' },
  { name: 'A mi mesa', detail: 'Coming soon', status: 'SOON' },
  { name: 'Mimur', detail: 'Coming soon', status: 'SOON' },
  { name: 'NotedTS', href: 'https://github.com/leyvaje/NotedTS', detail: 'TypeScript notes', status: 'LIVE' },
];

const socialLinks = [
  ['GitHub', 'https://github.com/leyvaje'],
  ['LinkedIn', 'https://linkedin.com/in/-leyva'],
  ['Twitter', 'https://twitter.com/leyvaje'],
  ['Instagram', 'https://instagram.com/leyvajex'],
  ['SoundCloud', 'https://soundcloud.com/lejoe'],
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
            <span className="location-chip" aria-label="Beatmaker keyboard shortcuts"><span className="status-dot" /> A KICK · S SNARE · D HI-HAT</span>
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
              <span>FRANKFURT & ATTENDORN, GERMANY <b>·</b> 10+ YEARS IN SOFTWARE</span>
            </div>
            <div className="hero-content">
              <p className="eyebrow hero-label">PRODUCT BUILDER · PRODUCT MINDED</p>
              <h1>Jose Enrique<br /><span>Leyva</span></h1>
              <p className="hero-subtitle">Full-stack app developer building mobile products and the systems behind them.</p>
              <div className="hero-bottom">
                <p className="hero-copy">Full-stack app developer with 10+ years building production-grade apps — iOS, Flutter, and backend systems. Based in Frankfurt and Attendorn, Germany.</p>
                <div className="hero-actions">
                  <ContactActions />
                  <a className="button button-soft" href="#stream">Explore the stream ↓</a>
                </div>
              </div>
            </div>
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

        <section className="section-wrap projects-section" aria-labelledby="projects-title">
          <SectionHeading id="projects" eyebrow="SELECTED WORK // APPS & TOOLS" title="Projects" note="Things I have built, with more in the workshop." />
          <div className="projects-grid">
            {projects.map((project) => <article className="frame project-card" key={project.name}>
              <div className="titlebar"><span><i className="status-dot" /> {project.status}</span><span>PROJECT</span></div>
              <div className="project-card-body"><h3>{project.name}</h3><p>{project.detail}</p>{project.href ? <a className="text-link" href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined}>Explore project ↗</a> : <span className="project-coming-soon">Coming soon</span>}</div>
            </article>)}
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
            <article className="frame education-card"><div className="titlebar"><span>M.SC. // ECONOMICS</span><span>SWEDEN</span></div><div className="education-body"><div className="education-heading"><span className="flag flag-sweden" role="img" aria-label="Monochrome Swedish flag" /><h3>Jönköping International Business School</h3></div></div></article>
            <article className="frame education-card"><div className="titlebar"><span>B.A. // MARKETING</span><span>MEXICO</span></div><div className="education-body"><div className="education-heading"><span className="flag flag-mexico" role="img" aria-label="Monochrome Mexican flag" /><h3>Universidad Anáhuac Mayab</h3></div></div></article>
          </div>
          <div className="language-strip"><span className="eyebrow">LANGUAGES</span><span>Spanish · Native</span><span>English · C2</span><span>German · C1</span><span>Swedish · A1</span></div>
        </section>

        <section className="contact-wrap" id="contact">
          <div className="frame contact-card">
            <div className="titlebar"><span><i className="status-dot" /> LEYVAJE // DIRECT COMMUNICATION</span><span>FRANKFURT & ATTENDORN</span></div>
            <div className="contact-content"><p className="eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let’s build something useful.</h2><p>Based in Frankfurt and Attendorn, Germany. Reach out about engineering, mobile apps, or product work.</p><div className="contact-actions"><a className="button button-dark" href="mailto:appalapas@gmail.com">Send email ↗</a><ContactActions compact /></div><div className="project-links"><span className="eyebrow">MORE FROM THE SITE</span><a href="/assets/documents/jose_leyva_cv_2026.pdf">Download CV ↗</a></div><div className="social-links">{socialLinks.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}</div></div>
          </div>
        </section>
      </main>

      <section className="section-wrap mentions-section" aria-labelledby="mentions-title"><SectionHeading id="mentions" eyebrow="CREDITS // INSPIRATION" title="Special mentions" /><div className="mentions-grid"><a className="frame mention-card" href="https://wed.mx/en/" target="_blank" rel="noreferrer"><span className="eyebrow">PARTNER DESIGN STUDIO</span><strong>WED ↗</strong><span>Partner design studio in Mérida, Mexico</span></a><a className="frame mention-card" href="https://patatap.com" target="_blank" rel="noreferrer"><span className="eyebrow">INSPIRATION</span><strong>Patatap ↗</strong><span>Inspiring beat-making web experience</span></a></div></section>
      <footer className="footer"><span>© 2026 Jose Enrique Leyva N. · Frankfurt & Attendorn, Germany</span><span>SYSTEMS, MOBILE & PRODUCT BUILDING</span></footer>
    </>
  );
}
