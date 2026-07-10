"use client";

import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import { StrategyOrb } from "./components/StrategyOrb";

type Company = {
  id: string;
  number: string;
  name: string;
  mark: string;
  accent: string;
  image: string;
  tags: string[];
  lens: string;
  thesis: string;
  edge: string;
  risk: string;
  next: string;
};

const companies: Company[] = [
  {
    id: "openai",
    number: "01",
    name: "OpenAI",
    mark: "O",
    accent: "#a975ff",
    image: "/visuals/openai-agentic-work.png",
    tags: ["AGENTS", "WORK"],
    lens: "The AI work surface",
    thesis: "ChatGPT is moving from conversational assistant to a persistent, tool-using operating layer for knowledge work.",
    edge: "Direct consumer pull + frontier models + Codex/agent distribution.",
    risk: "Agent blast radius and enormous compute/capital dependence.",
    next: "Longer-running enterprise agents that act across files, browsers, data, and business systems.",
  },
  {
    id: "google",
    number: "02",
    name: "Google DeepMind",
    mark: "G",
    accent: "#4db7ff",
    image: "/visuals/google-stack.png",
    tags: ["STACK", "ROBOTICS"],
    lens: "The intelligence layer",
    thesis: "Gemini is being threaded through Search, Android, Workspace, Cloud, chips, and the physical world.",
    edge: "Vertical integration from TPU to product surface, plus default distribution.",
    risk: "Search trust, answer quality, privacy, and ad-model cannibalization.",
    next: "Make Gemini the default interface for search and enterprise agents, then extend into robotics and ambient hardware.",
  },
  {
    id: "anthropic",
    number: "03",
    name: "Anthropic",
    mark: "A",
    accent: "#54e1a2",
    image: "/visuals/anthropic-enterprise.png",
    tags: ["TRUST", "CODE"],
    lens: "The trusted work layer",
    thesis: "Claude is optimized for high-value enterprise work: coding, reasoning, documents, and long-horizon collaboration.",
    edge: "Enterprise credibility, safety posture, Claude Code, and cloud neutrality.",
    risk: "Powerful agents multiply failure impact as permissions and context expand.",
    next: "Turn Claude Code, Cowork, MCP, and partner services into the operating layer for teams.",
  },
  {
    id: "meta",
    number: "04",
    name: "Meta",
    mark: "M",
    accent: "#ff4fa4",
    image: "/visuals/meta-personal-ai.png",
    tags: ["OPEN", "GLASSES"],
    lens: "Personal AI at scale",
    thesis: "Meta combines open-weight reach with proprietary personal AI and wearables across its social graph.",
    edge: "Billions of distribution points, social context, and the glasses wedge.",
    risk: "Open-model misuse, privacy, consent, and engagement-driven product incentives.",
    next: "Make Meta AI useful inside conversations, commerce, creator workflows, and all-day glasses.",
  },
  {
    id: "xai",
    number: "05",
    name: "xAI",
    mark: "X",
    accent: "#ff733d",
    image: "/visuals/xai-realtime-data.png",
    tags: ["REAL-TIME", "SPEED"],
    lens: "The live-data challenger",
    thesis: "Grok is built around high-velocity compute, real-time information, and a tight loop with X.",
    edge: "Fresh social signals, native search/tool use, and a fast release cadence.",
    risk: "Platform incentives, deepfakes, disinformation, and governance credibility.",
    next: "Push Grok from X-native chatbot into a lower-cost, multimodal enterprise agent.",
  },
];

const filters = ["ALL", "AGENTS", "STACK", "TRUST", "OPEN", "REAL-TIME"];

const risks = [
  ["01", "Autonomy", "When an agent can act, a wrong answer becomes a wrong action."],
  ["02", "Search trust", "AI answers reshape how people discover, verify, and value information."],
  ["03", "Blast radius", "The more context and permission a system gets, the more its failures matter."],
  ["04", "Social privacy", "Cameras, microphones, and social graphs turn context into product fuel."],
  ["05", "Governance", "Velocity without credible controls compounds regulatory and reputational risk."],
];

const matrixRows = [
  ["Control point", "ChatGPT / API", "Search / Cloud", "Enterprise work", "Social graph / glasses", "X / live data"],
  ["Model posture", "Closed frontier", "Tiered multimodal", "Safety-led frontier", "Open + proprietary", "Fast + permissive"],
  ["Best wedge", "Execution", "Integration", "Trust", "Reach", "Recency"],
  ["Strategic bet", "Own the work loop", "Own the stack", "Own the enterprise layer", "Own the personal interface", "Own the live signal"],
];

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="source-link">
      {children} <span>↗</span>
    </a>
  );
}

export default function Home() {
  const [activeId, setActiveId] = useState("openai");
  const [filter, setFilter] = useState("ALL");
  const activeCompany = companies.find((company) => company.id === activeId) ?? companies[0];
  const visibleCompanies = useMemo(
    () => companies.filter((company) => filter === "ALL" || company.tags.includes(filter)),
    [filter],
  );

  return (
    <main className="site-shell">
      <header className="site-nav">
        <a className="wordmark" href="#top" aria-label="Five One home">
          <span className="wordmark-mark">5</span>
          <span>FIVE / ONE</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#constellation">Constellation</a>
          <a href="#matrix">Matrix</a>
          <a href="#risks">Risk surface</a>
        </nav>
        <a className="nav-status" href="#sources">
          <span className="status-dot" />
          FACT-CHECKED / 2026
        </a>
      </header>

      <section className="hero" id="top">
        <StrategyOrb />
        <div className="hero-grain" />
        <div className="hero-copy">
          <p className="eyebrow">THE FRONTIER AI STRATEGY INDEX <span>—</span> 10.07.26</p>
          <h1>
            Five companies.
            <br />
            Five control points.
            <br />
            <em>One interface.</em>
          </h1>
          <p className="hero-dek">
            OpenAI, Google DeepMind, Anthropic, Meta, and xAI are not playing the same game. They are trying to own different parts of the next AI stack.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#constellation">
              Enter the constellation <span>↓</span>
            </a>
            <a className="button button-quiet" href="#sources">
              Read the source notes <span>↗</span>
            </a>
          </div>
        </div>
        <div className="hero-labels" aria-hidden="true">
          <span className="hero-label label-openai">OPENAI / WORK</span>
          <span className="hero-label label-google">GOOGLE / STACK</span>
          <span className="hero-label label-anthropic">ANTHROPIC / TRUST</span>
          <span className="hero-label label-meta">META / REACH</span>
          <span className="hero-label label-xai">xAI / LIVE SIGNAL</span>
        </div>
        <div className="hero-foot">
          <span>SCROLL TO COMPARE</span>
          <span className="hero-line" />
          <span>5 LABS / 4 SURFACES / 1 RACE</span>
        </div>
      </section>

      <section className="thesis-section section-pad" id="constellation">
        <div className="section-kicker">
          <span>00 / THE THESIS</span>
          <span>MODELS ARE NOT THE PRODUCT</span>
        </div>
        <div className="thesis-grid">
          <h2>
            The race is moving
            <br />
            from <span>answers</span>
            <br />
            to <strong>ownership.</strong>
          </h2>
          <div className="thesis-copy">
            <p>Benchmark scores matter. But the durable advantage is the control point around the model: the work loop, the operating stack, the enterprise permission layer, the personal interface, or the live signal.</p>
            <div className="signal-list">
              <span><b>01</b> Models</span>
              <span><b>02</b> Agents</span>
              <span><b>03</b> Distribution</span>
              <span><b>04</b> Trust</span>
            </div>
          </div>
        </div>
      </section>

      <section className="company-section section-pad">
        <div className="section-kicker">
          <span>01 / THE FIVE</span>
          <span>CLICK A SIGNAL TO CHANGE THE LENS</span>
        </div>
        <div className="filter-row" role="toolbar" aria-label="Filter companies by strategic wedge">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-button ${filter === item ? "is-active" : ""}`}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="company-grid">
          {visibleCompanies.map((company) => (
            <button
              type="button"
              key={company.id}
              className={`company-card ${activeId === company.id ? "is-active" : ""}`}
              style={{ "--accent": company.accent } as CSSProperties}
              onClick={() => setActiveId(company.id)}
              aria-pressed={activeId === company.id}
            >
              <span className="card-topline">
                <span>{company.number}</span>
                <span>{company.lens}</span>
              </span>
              <span className="card-image-wrap">
                <Image src={company.image} alt="" fill sizes="(max-width: 720px) 100vw, 33vw" className="card-image" />
                <span className="card-scanline" />
                <span className="card-mark">{company.mark}</span>
              </span>
              <span className="card-content">
                <span className="card-name">{company.name}</span>
                <span className="card-tags">
                  {company.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </span>
                <span className="card-arrow">↗</span>
              </span>
            </button>
          ))}
        </div>
        <div className="company-detail" style={{ "--accent": activeCompany.accent } as CSSProperties}>
          <div className="detail-heading">
            <span className="detail-number">{activeCompany.number}</span>
            <div>
              <p className="eyebrow">CURRENT LENS / {activeCompany.lens}</p>
              <h3>{activeCompany.name}</h3>
            </div>
          </div>
          <p className="detail-thesis">{activeCompany.thesis}</p>
          <div className="detail-columns">
            <div><span className="mini-label">ADVANTAGE</span><p>{activeCompany.edge}</p></div>
            <div><span className="mini-label">EXPOSURE</span><p>{activeCompany.risk}</p></div>
            <div><span className="mini-label">NEXT MOVE</span><p>{activeCompany.next}</p></div>
          </div>
        </div>
      </section>

      <section className="matrix-section section-pad" id="matrix">
        <div className="section-kicker">
          <span>02 / THE MATRIX</span>
          <span>THE SAME RACE / DIFFERENT TRACKS</span>
        </div>
        <div className="matrix-wrap" role="region" aria-label="Comparison matrix" tabIndex={0}>
          <div className="matrix-row matrix-head">
            {matrixRows[0].map((cell) => <div key={cell}>{cell}</div>)}
          </div>
          {matrixRows.slice(1).map((row) => (
            <div className="matrix-row" key={row[0]}>
              {row.map((cell, index) => <div key={`${row[0]}-${cell}`} className={index === 0 ? "row-label" : ""}>{cell}</div>)}
            </div>
          ))}
        </div>
        <div className="matrix-note"><span>READ THE GAP</span> — The most defensible strategy is the one that turns capability into habit before the market catches up.</div>
      </section>

      <section className="risk-section section-pad" id="risks">
        <div className="section-kicker risk-kicker">
          <span>03 / RISK SURFACE</span>
          <span>CAPABILITY WITHOUT CONTROL IS A PRODUCT DECISION</span>
        </div>
        <div className="risk-heading">
          <h2>Every wedge<br /><em>creates a shadow.</em></h2>
          <p>Each strategy has a specific failure mode. The risk is not abstract; it follows the surface each company is trying to own.</p>
        </div>
        <div className="risk-grid">
          {risks.map(([number, title, copy]) => (
            <article className="risk-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="next-section section-pad">
        <div className="section-kicker">
          <span>04 / NEXT 12–24 MONTHS</span>
          <span>THE MOVE TO WATCH</span>
        </div>
        <div className="next-heading">
          <h2>From model releases<br /><span>to interface wars.</span></h2>
          <p>The next round is not just about being smarter. It is about being present, trusted, and useful at the exact moment a decision is made.</p>
        </div>
        <div className="timeline">
          <div className="timeline-line" />
          {companies.map((company, index) => (
            <button
              type="button"
              className="timeline-item"
              key={company.id}
              style={{ "--accent": company.accent } as CSSProperties}
              onClick={() => { setActiveId(company.id); document.querySelector("#constellation")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <span className="timeline-number">{company.number}</span>
              <span className="timeline-dot" />
              <span className="timeline-copy">
                <span className="timeline-company">{company.name}</span>
                <strong>{index === 0 ? "Persistent agents" : index === 1 ? "Ambient intelligence" : index === 2 ? "Team-native work" : index === 3 ? "Personal interface" : "Live-data agent"}</strong>
                <span>{company.next}</span>
              </span>
              <span className="timeline-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <footer className="site-footer section-pad" id="sources">
        <div className="footer-lockup">
          <span className="wordmark-mark">5</span>
          <div>
            <strong>FIVE / ONE</strong>
            <p>AI strategy, without the benchmark tunnel vision.</p>
          </div>
        </div>
        <div className="footer-sources">
          <span className="mini-label">SOURCE NOTES / LAST CHECKED JUL 9, 2026</span>
          <div className="source-list">
            <SourceLink href="https://openai.com/index/gpt-5-6/">OpenAI / GPT‑5.6 + agents</SourceLink>
            <SourceLink href="https://cloud.google.com/blog/products/ai-machine-learning/innovations-from-google-io-26-on-google-cloud">Google / Gemini + Cloud</SourceLink>
            <SourceLink href="https://www.anthropic.com/responsible-scaling-policy">Anthropic / RSP</SourceLink>
            <SourceLink href="https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs/amp/">Meta / Muse Spark</SourceLink>
            <SourceLink href="https://x.ai/news/grok-4">xAI / Grok 4</SourceLink>
          </div>
        </div>
        <div className="footer-end">BUILT FOR THE<br /><span>NEXT INTERFACE</span></div>
      </footer>
    </main>
  );
}
