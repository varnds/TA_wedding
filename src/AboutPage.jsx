import React from "react";
import { LayoutTabBar } from "./LayoutTabBar";
import { ABOUT_LAYOUTS, CAREER, STUDIES, BIO_PARAGRAPHS } from "./layoutContent";
import {
  MotifClothesline,
  MotifSeasonSky,
  MotifSeasonHills,
  MotifFabricPattern,
  MotifGarmentSwatch,
  MotifClothespin,
} from "./sceneMotifs";
import { MONO, HEADER, BODY } from "./editorialUtils";

function AboutContact({ ink, accent }) {
  return (
    <div id="about-contact" className="about-card-contact">
      <p className="about-card-contact-lead" style={{ fontFamily: HEADER, color: ink }}>
        Open to freelance & full-time — <em style={{ color: accent, fontStyle: "normal" }}>say hello.</em>
      </p>
      <a href="mailto:hello@varnadas.com" style={{ fontFamily: MONO, color: ink }}>
        hello@varnadas.com
      </a>
    </div>
  );
}

function AboutTimeline({ ink, bodyInk, accent, pegSections = false }) {
  const block = (title, rows) => (
    <section className={`about-card-section${pegSections ? " about-card-section--peg" : ""}`}>
      {pegSections && <MotifClothespin accent={accent} />}
      <h2 className="about-card-section-title" style={{ fontFamily: MONO, color: accent }}>{title}</h2>
      <ul className="about-card-list">
        {rows.map((row) => (
          <li key={row.period} style={{ borderColor: `${ink}10` }}>
            <span style={{ fontFamily: MONO, color: `${ink}55` }}>{row.period}</span>
            <span style={{ fontFamily: HEADER, color: ink }}>{row.role || row.title}</span>
            <span style={{ fontFamily: BODY, color: bodyInk }}>{row.place}</span>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="about-card-timeline">
      {block("Career", CAREER)}
      {block("Studies", STUDIES)}
    </div>
  );
}

function AboutBio({ ink, bodyInk, pegSections = false, accent }) {
  return (
    <section className={`about-card-section about-card-section--bio${pegSections ? " about-card-section--peg" : ""}`}>
      {pegSections && <MotifClothespin accent={accent} />}
      <h2 className="about-card-section-title" style={{ fontFamily: MONO, color: accent }}>Bio</h2>
      <div className="about-card-bio" style={{ fontFamily: BODY, color: bodyInk }}>
        {BIO_PARAGRAPHS.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

function AboutHeader({ ink, accent, extra }) {
  return (
    <header className="card-study-header about-card-header">
      <div className="card-study-header-top">
        <div>
          <p className="about-card-kicker" style={{ fontFamily: MONO, color: accent }}>Product & UX designer</p>
          <h1 className="card-study-title" style={{ fontFamily: HEADER, color: ink }}>Varna Das</h1>
          <p className="about-card-place" style={{ fontFamily: MONO, color: `${ink}66` }}>San Francisco Bay Area</p>
        </div>
        {extra}
      </div>
    </header>
  );
}

function AboutLine({ ink, bodyInk, accent, cloth }) {
  return (
    <article className="about-layout about-layout--line">
      <MotifClothesline ink={ink} accent={accent} />
      <AboutHeader
        ink={ink}
        accent={accent}
        extra={<MotifGarmentSwatch hue={cloth} fabric="weave" accent={accent} ink={ink} />}
      />
      <AboutBio ink={ink} bodyInk={bodyInk} accent={accent} pegSections />
      <AboutTimeline ink={ink} bodyInk={bodyInk} accent={accent} pegSections />
      <AboutContact ink={ink} accent={accent} />
    </article>
  );
}

function AboutFold({ ink, bodyInk, accent, cloth, clothTint }) {
  return (
    <article className="about-layout about-layout--fold" style={{ background: cloth }}>
      <div className="fold-texture" aria-hidden>
        <MotifFabricPattern fabric="weave" ink={ink} accent={accent} opacity={0.05} />
      </div>
      <div className="fold-hue-band" style={{ background: clothTint || cloth, borderColor: `${ink}12` }} aria-hidden />
      <div className="fold-inner">
        <AboutHeader ink={ink} accent={accent} extra={<span className="fold-fabric-label" style={{ fontFamily: MONO, color: `${ink}55` }}>weave</span>} />
        <div className="about-card-body">
          <AboutBio ink={ink} bodyInk={bodyInk} accent={accent} />
          <AboutTimeline ink={ink} bodyInk={bodyInk} accent={accent} />
          <AboutContact ink={ink} accent={accent} />
        </div>
      </div>
    </article>
  );
}

function AboutSky({ ink, bodyInk, accent, season }) {
  const { sky1, sky2, sky3, sun, isNight } = season || {};
  return (
    <article className="about-layout about-layout--sky">
      <div className="scene-sky-hero">
        <MotifSeasonSky
          sky1={sky1}
          sky2={sky2}
          sky3={sky3}
          sun={sun}
          ink={ink}
          showSun={!isNight}
        />
        <div className="scene-sky-hero-copy about-sky-copy">
          <p className="about-card-kicker" style={{ fontFamily: MONO, color: accent }}>About</p>
          <h1 className="card-study-title" style={{ fontFamily: HEADER, color: ink }}>Varna Das</h1>
          <p className="about-card-place" style={{ fontFamily: MONO, color: `${ink}88` }}>Product & UX · Bay Area</p>
        </div>
      </div>
      <div className="scene-sky-body">
        <AboutBio ink={ink} bodyInk={bodyInk} accent={accent} />
        <AboutTimeline ink={ink} bodyInk={bodyInk} accent={accent} />
        <AboutContact ink={ink} accent={accent} />
      </div>
    </article>
  );
}

function AboutHills({ ink, bodyInk, accent, cloth, season }) {
  const { sky1, sky2, sky3, sun, hill1, hill2, hill3, isNight } = season || {};
  return (
    <article className="about-layout about-layout--hills">
      <div className="scene-hills-backdrop" aria-hidden>
        <MotifSeasonSky
          sky1={sky1}
          sky2={sky2}
          sky3={sky3}
          sun={sun}
          ink={ink}
          showSun={!isNight}
          className="scene-hills-sky"
        />
      </div>
      <div className="scene-hills-content" style={{ background: cloth }}>
        <AboutHeader ink={ink} accent={accent} />
        <AboutBio ink={ink} bodyInk={bodyInk} accent={accent} />
        <AboutTimeline ink={ink} bodyInk={bodyInk} accent={accent} />
        <AboutContact ink={ink} accent={accent} />
      </div>
      <footer className="scene-hills-foot" aria-hidden>
        <MotifSeasonHills hill1={hill1} hill2={hill2} hill3={hill3} />
      </footer>
    </article>
  );
}

const ABOUT_COMPONENTS = {
  line: AboutLine,
  fold: AboutFold,
  sky: AboutSky,
  hills: AboutHills,
};

export function AboutPage({
  ink,
  bodyInk,
  accent,
  cloth,
  clothTint,
  season,
  layoutId,
  onLayoutChange,
}) {
  const resolvedLayoutId = ABOUT_COMPONENTS[layoutId] ? layoutId : "fold";
  const Layout = ABOUT_COMPONENTS[resolvedLayoutId];

  return (
    <div className={`about-page-wrap about-page-wrap--card about-page-wrap--${resolvedLayoutId}`}>
      <LayoutTabBar
        tabs={ABOUT_LAYOUTS}
        activeId={resolvedLayoutId}
        onChange={onLayoutChange}
        ink={ink}
        accent={accent}
        mutedInk={`${ink}55`}
        className="layout-tab-bar--card about-layout-tabs"
      />
      <Layout
        ink={ink}
        bodyInk={bodyInk}
        accent={accent}
        cloth={cloth}
        clothTint={clothTint}
        season={season}
      />
    </div>
  );
}
