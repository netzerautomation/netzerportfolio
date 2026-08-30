import { createFileRoute } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Moon, Sun, ArrowRight, Workflow, X, ChevronLeft, ChevronRight } from "lucide-react";

import heroFlow from "@/assets/hero-flow.jpg";
import logoMark from "@/assets/logo-mark.png";
import portraitAsset from "@/assets/netzer-portrait.jpg.asset.json";
import wfEmail from "@/assets/wf-110955.png.asset.json";
import wfChat from "@/assets/wf-111033.png.asset.json";
import wfSocial from "@/assets/wf-111109.png.asset.json";
import wfMining from "@/assets/wf-111337.png.asset.json";
import wfReport from "@/assets/wf-111440.png.asset.json";
import lead1 from "@/assets/lead-223217.png.asset.json";
import lead2 from "@/assets/lead-223305.png.asset.json";
import lead3 from "@/assets/lead-223316.png.asset.json";
import lead4 from "@/assets/lead-223349.png.asset.json";
import lead5 from "@/assets/lead-224941.png.asset.json";
import lead6 from "@/assets/lead-224954.png.asset.json";
import lead7 from "@/assets/lead-225158.png.asset.json";
import lead8 from "@/assets/lead-225206.png.asset.json";
import fbAgent from "@/assets/wf-facebook-agent.png.asset.json";
import makeCert from "@/assets/netzer-make-certificate.pdf.asset.json";
import zapierCert from "@/assets/netzer-zapier-certificate.pdf.asset.json";
import certMakeImg from "@/assets/cert-make.png.asset.json";
import certZapierImg from "@/assets/cert-zapier.png.asset.json";




const FEEDBACK_SHOTS = [
  { src: wfEmail.url, caption: "Email Feedback — Gmail watch to HTTP webhook" },
  { src: wfChat.url, caption: "Chat Feedback — Messenger capture & reply" },
  { src: wfSocial.url, caption: "Social Feedback — Facebook Pages comments" },
  {
    src: wfMining.url,
    caption: "Feedback mining — AI analysis, iterator, database",
  },
  { src: wfReport.url, caption: "Monthly report — aggregate, draft, email" },
];

const LEAD_SHOTS = [
  { src: lead1.url, caption: "Lead capture form → scoring steps (Zapier)" },
  { src: lead2.url, caption: "Lead score recorded → split into Hot/Warm/Cold" },
  { src: lead3.url, caption: "Personalized emails, follow-ups & Slack alert" },
  { src: lead4.url, caption: "Full qualification zap overview" },
  { src: lead5.url, caption: "Automated lead follow-up — schedule & loop" },
  { src: lead6.url, caption: "Follow-up paths per lead temperature" },
  { src: lead7.url, caption: "Meeting scheduling — Calendly to Sheets" },
  { src: lead8.url, caption: "Lead assignment to sales reps" },
];

const FB_SHOTS = [
  {
    src: fbAgent.url,
    caption:
      "AI Agent for Facebook — n8n webhook → Google Doc → Gemini AI Agent with memory → HTTP",
  },
];


/* ---------- lightbox ---------- */

type LightboxItem = { src: string; caption: string };
type LightboxState = { items: LightboxItem[]; index: number } | null;
type LightboxCtx = (state: LightboxState) => void;

const LightboxContext = createContext<LightboxCtx>(() => {});

export function useLightbox() {
  return useContext(LightboxContext);
}

/** Convenience helper: open a single image. */
export function openSingle(open: LightboxCtx, item: LightboxItem) {
  open({ items: [item], index: 0 });
}

function Lightbox({
  state,
  onClose,
}: {
  state: LightboxState;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  const items = state?.items ?? [];
  const index = state?.index ?? 0;
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;
  const current = items[index];

  const go = useCallback(
    (dir: -1 | 1) => {
      // Lightbox navigation is handled by the parent via a controlled state.
      // We dispatch a CustomEvent so the parent can update state without
      // threading setters down.
      window.dispatchEvent(
        new CustomEvent("lightbox-nav", { detail: dir }),
      );
    },
    [],
  );

  useEffect(() => {
    if (state) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) go(-1);
      if (e.key === "ArrowRight" && hasNext) go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, onClose, hasPrev, hasNext, go]);

  if (!state || !current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.caption}
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {hasPrev && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          className="animate-fade-in absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground active:scale-90 sm:left-6"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          className="animate-fade-in absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground active:scale-90 sm:right-6"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
      <div
        className="relative max-h-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
        <figure
          key={current.src}
          className={`overflow-hidden rounded-xl border border-border bg-surface shadow-2xl transition-all duration-200 ${
            visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <img
            src={current.src}
            alt={current.caption}
            className="max-h-[82vh] w-auto max-w-full object-contain"
          />
          {current.caption && (
            <figcaption className="border-t border-border/60 bg-surface-2 px-4 py-2 font-mono text-xs text-muted-foreground">
              {current.caption}
            </figcaption>
          )}
        </figure>
        {items.length > 1 && (
          <p className="mt-2 text-center font-mono text-xs text-muted-foreground">
            {index + 1} / {items.length}
          </p>
        )}
      </div>
    </div>
  );
}


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Netzer Paul Tonogbanua — Workflow & AI Automation Specialist" },
      {
        name: "description",
        content:
          "Netzer Paul Tonogbanua builds AI-powered automation workflows with Make.com, n8n, and Zapier — integrating APIs, webhooks, and LLMs to reduce manual work and scale operations.",
      },
      {
        property: "og:title",
        content: "Netzer Paul Tonogbanua — Workflow & AI Automation Specialist",
      },
      {
        property: "og:description",
        content:
          "AI Workflow Automation Specialist building scalable automation with Make.com, n8n, Zapier, APIs, and LLMs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Workflows", href: "#workflows" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    title: "Workflow Automation",
    desc: "Designing and building end-to-end automations in Make.com, n8n, and Zapier that connect your tools and eliminate manual handoff.",
    tags: ["Make.com", "n8n", "Zapier"],
  },
  {
    title: "AI Integration",
    desc: "Embedding LLMs and AI agents into your pipelines for classification, extraction, summarization, and sentiment analysis.",
    tags: ["LLMs", "AI Agents", "Prompt Engineering"],
  },
  {
    title: "API & Webhooks",
    desc: "Wiring REST APIs, HTTP requests, and webhooks so systems talk to each other reliably with proper error handling.",
    tags: ["REST APIs", "Webhooks", "HTTP"],
  },
  {
    title: "Data Processing",
    desc: "Mapping, transforming, and validating JSON data across nodes — routing with filters, conditions, and loops.",
    tags: ["JSON", "Data Mapping", "Transformation"],
  },
  {
    title: "Business Automation",
    desc: "Automating CRM, email, lead generation, and customer-support processes to reduce repetitive work and lift throughput.",
    tags: ["CRM", "Email", "Lead Gen"],
  },
  {
    title: "Analysis & Reporting",
    desc: "AI-driven categorization, trend analysis, and monthly reporting built on structured, validated feedback data.",
    tags: ["Classification", "Trends", "Reporting"],
  },
];

const WORKFLOWS = [
  {
    name: "Feedback Intelligence Pipeline",
    desc: "Collects customer feedback from multiple channels, then uses AI to categorize by type, topic, sentiment, and urgency — rolling results into trend analysis and monthly reports.",
    flow: ["Forms & Email", "Make.com", "LLM Classifier", "Sheets + Reports"],
    tools: ["Make.com", "ChatGPT", "Google Forms", "Google Sheets"],
    metric: "100% of feedback auto-categorized",
  },
  {
    name: "Lead Generation and Qualification Workflow",
    desc: "Captures leads from forms, scores them on timeline, budget, and company size, then splits into Hot/Warm/Cold paths with AI-personalized emails, scheduled follow-ups, meeting booking, and sales-rep assignment.",
    flow: ["Google Forms", "Zapier Scoring", "Hot / Warm / Cold Paths", "Gmail + Calendar + Slack"],
    tools: ["Zapier", "AI by Zapier", "Google Sheets", "Calendly", "Slack"],
    metric: "Response time cut from hours to minutes",
  },
  {
    name: "AI Agent for Facebook",
    desc: "An n8n-powered AI agent that responds to Facebook messages via webhook, retrieves context from a Google Doc, reasons with Google Gemini (with memory), and replies through an HTTP request — enabling conversational, on-brand auto-replies at scale.",
    flow: ["Webhook", "Google Doc", "AI Agent (Gemini + Memory)", "HTTP Reply"],
    tools: ["n8n", "Google Gemini", "Google Docs", "Webhooks", "Simple Memory"],
    metric: "Automated Facebook messaging replies",
  },
];

const EXPERIENCE = [
  {
    role: "Customer Service Specialist",
    org: "Master NNTD Corp. — E-commerce",
    period: "Jan 2025 – Jan 2026",
    points: [
      "Managed high-volume customer emails — shipping, missing items, refunds, and order issues — resolved efficiently.",
      "Provided product guidance, troubleshooted checkout issues, and supported manual invoice creation.",
      "Maintained accurate order records and collected feedback on packaging and product quality.",
      "Investigated operational and financial discrepancies, processed memberships, and coordinated with fulfillment teams.",
      "Used structured problem-solving and data management to improve service processes and surface recurring issues.",
    ],
  },
  {
    role: "Education — BSc Information Technology",
    org: "Mindanao Polytechnic College",
    period: "2015 – 2019",
    points: [
      "Four-year degree focused on information technology fundamentals that underpin today's automation and integration work.",
    ],
  },
];

const SKILLS = [
  "Make.com",
  "n8n",
  "Zapier",
  "LLMs & Prompt Engineering",
  "REST APIs",
  "Webhooks",
  "JSON",
  "Data Mapping",
  "Google Sheets",
  "Gmail",
  "Google Drive",
  "Google Forms",
  "Google Calendar",
  "ChatGPT",
  "Google Gemini",
  "Data Extraction",
  "Classification",
  "Sentiment Analysis",
  "Summarization",
];



const CERTIFICATES = [
  {
    title: "No Code Automation with Make.com",
    issuer: "Tara AI Community+",
    date: "August 23, 2026",
    img: certMakeImg.url,
    highlights:
      "Make.com Interface, Scenario Structure, Filters, Triggers, Connecting Apps, Actions, Data Manipulation, Advanced Routing, HTTP Requests & AI Agents",
  },
  {
    title: "No Code Automation with Zapier",
    issuer: "Tara AI Community+",
    date: "August 17, 2026",
    img: certZapierImg.url,
    highlights:
      "Zapier Interface, Triggers, Formatter, Delay, Filter, Paths, Looping, Sub Zaps, Webhooks & AI with Human-in-the-Loop",
  },
];



const LINKS = {
  phone: "+639386946310",
  email: "netzer.it@gmail.com",
  onlinejobs: "https://www.onlinejobs.ph/jobseekers/info/2695411",
  upwork: "https://www.upwork.com/freelancers/~01f45cc516bc831fdd",
};

/* ---------- effects ---------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function useRevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useRipple() {
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const host = (ev.target as HTMLElement).closest?.(
        "[data-ripple]",
      ) as HTMLElement | null;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ink = document.createElement("span");
      ink.className = "ripple-ink";
      ink.style.width = ink.style.height = `${size}px`;
      ink.style.left = `${ev.clientX - rect.left - size / 2}px`;
      ink.style.top = `${ev.clientY - rect.top - size / 2}px`;
      host.appendChild(ink);
      window.setTimeout(() => ink.remove(), 650);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left accent-grad"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const t = saved === "light" ? "light" : "dark";
    setTheme(t);
    document.documentElement.classList.toggle("light", t === "light");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    window.localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="ripple-host flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-90"
    >
      {mounted && theme === "light" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

/* ---------- page ---------- */

function Index() {
  useRevealObserver();
  useRipple();
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const openLightbox = useCallback((s: LightboxState) => setLightbox(s), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  // Handle prev/next navigation dispatched from the Lightbox component.
  useEffect(() => {
    const onNav = (e: Event) => {
      const dir = (e as CustomEvent<-1 | 1>).detail;
      setLightbox((prev) => {
        if (!prev) return prev;
        const nextIndex = prev.index + dir;
        if (nextIndex < 0 || nextIndex >= prev.items.length) return prev;
        return { ...prev, index: nextIndex };
      });
    };
    window.addEventListener("lightbox-nav", onNav);
    return () => window.removeEventListener("lightbox-nav", onNav);
  }, []);

  return (
    <LightboxContext.Provider value={openLightbox}>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Nav />
        <Hero />
        <Marquee />
        <Services />
        <Workflows />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </div>
      <Lightbox state={lightbox} onClose={closeLightbox} />
    </LightboxContext.Provider>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="group flex items-center gap-2.5">
          <img
            src={logoMark}
            alt=""
            width={28}
            height={28}
            loading="eager"
            className="opacity-90 transition-transform group-hover:rotate-6"
          />
          <span className="font-display text-[1.05rem] font-semibold tracking-tight sm:text-base">
            Netzer Paul Tonogbanua
          </span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#contact"
            data-ripple
            className="ripple-host rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            Let's talk
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="grid-bg absolute inset-0 -z-10 opacity-60" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent-glow), transparent)",
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <p className="section-label mb-5">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
              Workflow & AI Automation Specialist
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Building automation that{" "}
              <span className="text-accent-grad">runs itself</span>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              I'm Netzer Paul Tonogbanua. I design AI-powered workflows with
              Make.com, n8n, and Zapier — connecting APIs, webhooks, and LLMs to
              cut manual work and scale operations reliably.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                data-ripple
                className="ripple-host rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              >
                View my work
              </a>
              <a
                href="#contact"
                data-ripple
                className="ripple-host rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-95"
              >
                Get in touch
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="font-mono">South Cotabato, PH</span>
              <span className="font-mono">EN · Filipino</span>
              <span className="font-mono">Available for remote work</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <div className="relative">
            <div className="glow relative overflow-hidden rounded-3xl border border-border">
              <img
                src={portraitAsset.url}
                alt="Portrait of Netzer Paul Tonogbanua"
                width={941}
                height={1672}
                loading="eager"
                className="aspect-[3/4] w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3 backdrop-blur-md">
                <span className="font-mono text-xs text-muted-foreground">
                  Netzer Paul Tonogbanua
                </span>
                <span className="font-mono text-xs text-primary">automation lead</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="border-y border-border/60 bg-surface/60 py-5">
      <div className="relative overflow-hidden">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <span key={i} className="font-mono text-sm text-muted-foreground">
              {s}
              <span className="ml-10 text-primary/40">/</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHead({
  label,
  title,
  sub,
}: {
  label: string;
  title: string;
  sub?: string;
}) {
  return (
    <Reveal>
      <div className="mb-12 max-w-2xl">
        <p className="section-label mb-3">{label}</p>
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
      </div>
    </Reveal>
  );
}

function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHead
        label="Services"
        title="What I automate"
        sub="From single-node fixes to multi-step pipelines — I design, build, and optimize workflows that turn repetitive work into reliable systems."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 90}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40">
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                style={{ background: "var(--accent-glow)" }}
              />
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[0.7rem] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Workflows() {
  const openLightbox = useLightbox();
  return (
    <section
      id="workflows"
      className="border-y border-border/60 bg-surface/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          label="Workflow & Automation Projects"
          title="Systems that run themselves"
          sub="Real automation architectures — trigger to outcome. Each pipeline is designed for reliability, error handling, and zero manual babysitting."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {WORKFLOWS.map((w, i) => (
            <Reveal key={w.name} delay={(i % 2) * 110}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 sm:p-7">
                <div
                  aria-hidden
                  className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                  style={{ background: "var(--accent-glow)" }}
                />
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-lg font-semibold leading-snug">
                    {w.name}
                  </h3>
                  <Workflow className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {w.desc}
                </p>

                {/* node flow */}
                <div className="mt-5 flex flex-wrap items-center gap-y-2">
                  {w.flow.map((node, j) => (
                    <span key={node} className="flex items-center">
                      <span className="rounded-lg border border-primary/25 bg-surface-2 px-2.5 py-1.5 font-mono text-[0.7rem] text-foreground transition-colors group-hover:border-primary/50">
                        {node}
                      </span>
                      {j < w.flow.length - 1 && (
                        <ArrowRight className="mx-1.5 h-3.5 w-3.5 text-primary/60" />
                      )}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {w.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[0.7rem] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {(() => {
                  const shots =
                    w.name === "Feedback Intelligence Pipeline"
                      ? FEEDBACK_SHOTS
                      : w.name === "Lead Generation and Qualification Workflow"
                        ? LEAD_SHOTS
                        : w.name === "AI Agent for Facebook"
                          ? FB_SHOTS
                          : null;
                  if (!shots) return null;
                  return (
                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {shots.map((shot, idx) => (
                        <button
                          key={shot.src}
                          type="button"
                          onClick={() =>
                            openLightbox({ items: shots, index: idx })
                          }
                          className="group/shot block w-full overflow-hidden rounded-lg border border-border bg-surface-2 text-left transition-colors hover:border-primary/50 active:scale-[0.98]"
                        >
                          <img
                            src={shot.src}
                            alt={shot.caption}
                            loading="lazy"
                            className="h-24 w-full object-cover object-left-top transition-transform duration-500 group-hover/shot:scale-105"
                          />
                          <span className="block px-2 py-1.5 font-mono text-[0.6rem] leading-tight text-muted-foreground">
                            {shot.caption}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })()}

                <p className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-mono">{w.metric}</span>
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const openLightbox = useLightbox();
  return (
    <section id="experience">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          label="Experience"
          title="Background"
          sub="Hands-on customer-operations experience paired with an IT degree — the problem-solving foundation behind reliable automation work."
        />
        <Reveal>
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-[5px] top-2 bottom-2 w-px bg-border sm:left-[6px]"
            />
            <div className="space-y-12">
              {EXPERIENCE.map((e) => (
                <div key={e.role} className="relative pl-7 sm:pl-9">
                  <span className="absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-display text-lg font-semibold">
                      {e.role}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {e.period}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-primary">{e.org}</p>
                  <ul className="mt-4 space-y-2.5">
                    {e.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <p className="section-label mb-4">Certifications</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {CERTIFICATES.map((cert, idx) => (
                  <button
                    key={cert.title}
                    type="button"
                    onClick={() =>
                      openLightbox({
                        items: CERTIFICATES.map((c) => ({
                          src: c.img,
                          caption: `${c.title} — ${c.issuer} (${c.date})`,
                        })),
                        index: idx,
                      })
                    }

                    className="group block overflow-hidden rounded-xl border border-border bg-surface/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 active:scale-[0.99]"
                  >
                    <img
                      src={cert.img}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </button>
                ))}
              </div>

            </div>
          </Reveal>
          <Reveal delay={110}>
            <div className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <p className="section-label mb-4">Languages</p>
              <ul className="space-y-2.5">
                {["English", "Filipino"].map((l) => (
                  <li key={l} className="flex items-center gap-3 text-sm">
                    <span className="text-primary">◆</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section
      id="projects"
      className="border-t border-border/60 bg-surface/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          label="Project Highlights"
          title="Selected work"
          sub="A look at an automation system I designed, built, and shipped — and the tools it runs on."
        />

        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="grid md:grid-cols-[1.3fr_1fr]">
              <div className="p-8 sm:p-10">
                <p className="section-label mb-4">Feedback Intelligence System</p>
                <h3 className="font-display text-2xl font-bold leading-tight">
                  AI-powered customer feedback collection & analysis pipeline
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Built a personal AI-powered automation workflow that collects
                  customer feedback from multiple sources and analyzes it using
                  AI. The system automatically categorizes feedback by type,
                  topic, sentiment, urgency, and summary — then organizes the
                  results for trend analysis and monthly reporting.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Sources", "Multi-channel ingest"],
                    ["Analysis", "AI categorization"],
                    ["Outputs", "Trends + reports"],
                    ["Reporting", "Monthly cadence"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-xl border border-border bg-surface-2 px-3 py-2.5 transition-colors hover:border-primary/40"
                    >
                      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                        {k}
                      </p>
                      <p className="mt-0.5 text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border bg-surface/50 p-8 sm:p-10 md:border-l md:border-t-0">
                <p className="section-label mb-4">Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Make.com",
                    "n8n",
                    "Zapier",
                    "ChatGPT",
                    "Google Gemini",
                    "REST APIs",
                    "Webhooks",
                    "HTTP Requests",
                    "Google Sheets",
                    "JSON",
                    "Data Mapping",
                    "Gmail",
                    "Google Drive",
                    "Google Forms",
                    "Google Calendar",
                    "Prompt Engineering",
                    "Data Extraction",
                    "Classification",
                    "Sentiment Analysis",
                    "Summarization",
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[0.7rem] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border/60"
    >
      <div
        aria-hidden
        className="absolute -bottom-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full"
        style={{ background: "var(--accent-glow)" }}
      />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center">
        <Reveal>
          <p className="section-label mb-4">Contact</p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl text-balance">
            Let's automate your busywork.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Tell me what's repetitive, broken, or slow. I'll scope an automation
            that runs reliably in the background.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-10 grid max-w-md gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${LINKS.email}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 active:scale-95"
            >
              <span className="text-primary">✉</span>
              <span className="truncate text-sm">{LINKS.email}</span>
            </a>
            <a
              href={`tel:${LINKS.phone}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 active:scale-95"
            >
              <span className="text-primary">☎</span>
              <span className="truncate text-sm">{LINKS.phone}</span>
            </a>
            <a
              href={LINKS.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 active:scale-95"
            >
              <span className="text-primary">↗</span>
              <span className="truncate text-sm">Upwork profile</span>
            </a>
            <a
              href={LINKS.onlinejobs}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 active:scale-95"
            >
              <span className="text-primary">↗</span>
              <span className="truncate text-sm">OnlineJobs.ph</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <a
            href={`mailto:${LINKS.email}`}
            data-ripple
            className="ripple-host mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            Start a conversation
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <img src={logoMark} alt="" width={22} height={22} loading="lazy" />
          <span className="font-display text-sm font-semibold">
            Netzer<span className="text-primary">.</span>Paul
          </span>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Workflow & AI Automation Specialist · South Cotabato, PH
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} Netzer Paul Tonogbanua
        </p>
      </div>
    </footer>
  );
}
