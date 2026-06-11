import React from "react";
import { MONO } from "./editorialUtils";

export function EditorialChrome({
  ink,
  accent,
  active = "work",
  projects = [],
  activeProjectIndex = -1,
  onNav,
  onProjectSelect,
}) {
  return (
    <header className="ed-chrome">
      <button
        type="button"
        className="ed-chrome-brand"
        style={{ fontFamily: MONO, color: ink }}
        onClick={() => onNav?.("work")}
      >
        VARNA DAS
      </button>

      <nav className="ed-chrome-projects" aria-label="Projects">
        <span className="ed-chrome-projects-label" style={{ fontFamily: MONO, color: `${ink}66` }}>
          PROJECTS
        </span>
        <div className="ed-chrome-project-nums">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`ed-chrome-project-num${activeProjectIndex === i ? " is-active" : ""}`}
              style={{
                fontFamily: MONO,
                color: activeProjectIndex === i ? accent : ink,
              }}
              onClick={() => onProjectSelect?.(i)}
              aria-current={activeProjectIndex === i ? "true" : undefined}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </nav>

      <nav className="ed-chrome-links" aria-label="Site">
        {[
          { id: "work", label: "WORK" },
          { id: "about", label: "ABOUT" },
          { id: "contact", label: "CONTACT" },
        ].map((link) => (
          <button
            key={link.id}
            type="button"
            className={`ed-chrome-link${active === link.id ? " is-active" : ""}`}
            style={{
              fontFamily: MONO,
              color: active === link.id ? accent : ink,
            }}
            onClick={() => onNav?.(link.id)}
          >
            {link.id === "contact" && (
              <span className="ed-chrome-link-dot" style={{ background: accent }} aria-hidden />
            )}
            {link.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
