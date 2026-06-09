import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Copy,
  Check,
  
  Zap,
  Shield,
  Sparkles,
  Swords,
  Crown,
  Mountain,
  Trophy,
  Flame,
  Star,
  ArrowRight,
  MessageCircle,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GullMC — Parkour Civilization Minecraft Server" },
      {
        name: "description",
        content:
          "Climb from Noob to Champion on GullMC — a parkour civilization Minecraft server with ranks, rivalries, and a thriving Discord community.",
      },
    ],
  }),
  component: Landing,
});

const SERVER_IP = "gullmc.mcsh.io";
const DISCORD_URL = "https://discord.gg/9SWPzwptje";

const RANKS = [
  { name: "Noob", tagline: "First steps. Every legend starts here.", Icon: Sparkles, hue: "from-sky-300/40 to-cyan-500/20" },
  { name: "Pro", tagline: "Cleared the warm-up. Real lines unlocked.", Icon: Zap, hue: "from-cyan-300/40 to-blue-500/20" },
  { name: "Master", tagline: "Precision movement. No wasted frames.", Icon: Mountain, hue: "from-blue-300/40 to-indigo-500/20" },
  { name: "Grandmaster", tagline: "Map architects bow. Routes are yours.", Icon: Crown, hue: "from-indigo-300/40 to-violet-500/20" },
  { name: "Fighter", tagline: "PvP parkour. Movement is a weapon.", Icon: Swords, hue: "from-violet-300/40 to-fuchsia-500/20" },
  { name: "Champion", tagline: "The summit. Civilization remembers your name.", Icon: Trophy, hue: "from-fuchsia-300/50 to-cyan-400/30" },
];

const RULES = [
  { Icon: Shield, title: "Respect the Civilization", body: "No harassment, hate speech, or doxxing. Treat every player like a future ally." },
  { Icon: Flame, title: "No Cheats or Macros", body: "Parkour is earned. Auto-clickers, fly hacks, and movement mods = instant ban." },
  { Icon: Star, title: "Build with Intent", body: "Griefing protected zones is forbidden. Wilderness builds must respect neighboring claims." },
  { Icon: Activity, title: "Keep Chat Clean", body: "English in global chat. Drama belongs in DMs, not in the town square." },
];

type ServerStatus =
  | { state: "loading" }
  | { state: "online"; online: number; max: number }
  | { state: "offline" };

function Landing() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<ServerStatus>({ state: "loading" });
  const [activeRank, setActiveRank] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`,
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error("bad response");
        const data = (await res.json()) as {
          online: boolean;
          players?: { online: number; max: number };
        };
        if (cancelled) return;
        if (data.online && data.players) {
          setStatus({
            state: "online",
            online: data.players.online,
            max: data.players.max,
          });
        } else {
          setStatus({ state: "offline" });
        }
      } catch {
        if (!cancelled) setStatus({ state: "offline" });
      }
    };
    fetchStatus();
    const id = setInterval(fetchStatus, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
    } catch {
      /* no-op */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };


  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Background layers */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 grid-bg" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 0%, oklch(0.55 0.22 250 / 0.35), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 30%, oklch(0.78 0.18 215 / 0.25), transparent 60%), radial-gradient(ellipse 70% 50% at 50% 100%, oklch(0.45 0.2 270 / 0.35), transparent 70%)",
          }}
        />
        <svg className="absolute inset-x-0 bottom-0 w-full opacity-30" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave" x1="0" x2="1">
              <stop offset="0" stopColor="oklch(0.78 0.16 220)" stopOpacity="0.4" />
              <stop offset="1" stopColor="oklch(0.55 0.22 280)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave)"
            d="M0,160 C240,260 480,60 720,140 C960,220 1200,80 1440,160 L1440,320 L0,320 Z"
          />
        </svg>
      </div>

      <Nav />

      <Hero
        status={status}
        copied={copied}
        onCopy={handleCopy}
      />


      <Status status={status} />

      <Ranks activeRank={activeRank} setActiveRank={setActiveRank} />

      <Rules />

      <DiscordCTA />

      <Footer />
    </div>
  );
}

function Nav() {
  const sections = [
    { id: "status", label: "Status" },
    { id: "ranks", label: "Ranks" },
    { id: "rules", label: "Rules" },
    { id: "discord", label: "Discord" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass flex w-full max-w-5xl items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan to-accent glow-border">
            <span className="font-display text-sm font-black text-primary-foreground">G</span>
          </div>
          <span className="font-display text-lg font-bold tracking-widest">GULLMC</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-accent px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Join</span>
        </a>
      </nav>
    </header>
  );
}

function Hero({
  status,
  copied,
  onCopy,
}: {
  status: ServerStatus;
  copied: boolean;
  onCopy: () => void;
}) {

  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-cyan"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
        </span>
        Parkour Civilization · v2.1 Live
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display mt-6 text-5xl font-black leading-[0.95] sm:text-7xl md:text-8xl"
      >
        <span className="block">RISE.</span>
        <span className="block bg-gradient-to-r from-cyan via-primary to-accent bg-clip-text text-transparent glow-text">
          LEAP. RULE.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
      >
        GullMC is a parkour-driven Minecraft civilization. Climb six tiers,
        carve your route through the skyline, and earn your place in a
        community built on precision and rivalry.
      </motion.p>

      {/* IP + live count cluster */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-10 flex w-full max-w-xl flex-col items-center gap-4"
      >
        <div className="glass flex w-full items-center gap-2 rounded-2xl p-2 sm:p-3">
          <div className="flex flex-1 flex-col items-start px-3 py-1 text-left">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Server IP
            </span>
            <span className="font-display text-base font-bold tracking-wider text-foreground sm:text-xl">
              {SERVER_IP}
            </span>
          </div>
          <button
            onClick={onCopy}
            className="group relative inline-flex h-11 min-w-[120px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan to-accent px-4 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_-4px_oklch(0.78_0.2_220/0.7)]"
            aria-label="Copy server IP"
          >
            <motion.span
              key={copied ? "check" : "copy"}
              initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy IP
                </>
              )}
            </motion.span>
          </button>
        </div>

        <LivePill status={status} />

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-muted-foreground"
      >
        ↓ scroll the ascent
      </motion.div>
    </section>
  );
}

function LivePill({ status }: { status: ServerStatus }) {
  const isOffline = status.state === "offline";
  const isLoading = status.state === "loading";
  const dotColor = isOffline
    ? "bg-destructive"
    : isLoading
      ? "bg-muted-foreground"
      : "bg-cyan";
  return (
    <div className="glass glow-border flex items-center gap-3 rounded-full px-5 py-2.5">
      <span className="relative flex h-2.5 w-2.5">
        {!isOffline && !isLoading && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dotColor} opacity-70`} />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotColor}`} />
      </span>
      <span className="font-display text-sm font-bold tracking-wider">
        {status.state === "online" && (
          <>
            <motion.span
              key={status.online}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block text-cyan glow-text"
            >
              {status.online}
            </motion.span>
            <span className="text-muted-foreground"> / {status.max} </span>
            <span className="text-muted-foreground">online</span>
          </>
        )}
        {status.state === "offline" && (
          <span className="text-destructive">Server Offline</span>
        )}
        {status.state === "loading" && (
          <span className="text-muted-foreground">Checking server…</span>
        )}
      </span>
    </div>
  );
}

function Status({ status }: { status: ServerStatus }) {
  return (
    <section id="status" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Live telemetry"
          title="Server Status"
          subtitle="Pulled live from the Minecraft server every 30 seconds."
        />
        <div className="mt-12">
          <StatusCard status={status} />
        </div>
      </div>
    </section>
  );
}

function StatusCard({ status }: { status: ServerStatus }) {
  if (status.state === "loading") {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Pinging
        </div>
        <div className="font-display mt-3 text-2xl text-muted-foreground">
          Checking server status…
        </div>
      </div>
    );
  }

  if (status.state === "offline") {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15">
          <Activity className="h-6 w-6 text-destructive" />
        </div>
        <div className="font-display mt-5 text-3xl font-black text-destructive sm:text-4xl">
          Server Offline
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          We can't reach <span className="text-foreground">{SERVER_IP}</span> right now. Hop in Discord — staff usually posts updates within minutes.
        </p>
      </div>
    );
  }

  const pct = status.max > 0 ? Math.min(100, (status.online / status.max) * 100) : 0;
  return (
    <div className="glass rounded-3xl p-8 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">
            Online
          </div>
          <div className="font-display mt-2 text-5xl font-black sm:text-7xl">
            <span className="bg-gradient-to-r from-cyan to-accent bg-clip-text text-transparent glow-text">
              {status.online}
            </span>
            <span className="text-2xl text-muted-foreground"> / {status.max}</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Citizens currently on <span className="text-foreground">{SERVER_IP}</span>
          </div>
        </div>
        <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cyan">
            Live
          </span>
        </div>
      </div>
      <div className="mt-8">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>{pct.toFixed(0)}% capacity</span>
          <span>{status.max} max slots</span>
        </div>
      </div>
    </div>
  );
}



function Ranks({
  activeRank,
  setActiveRank,
}: {
  activeRank: number;
  setActiveRank: (n: number) => void;
}) {
  const active = RANKS[activeRank];
  return (
    <section id="ranks" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Civilization progression"
          title="Six Tiers to Champion"
          subtitle="Every rank is earned through parkour trials, build contributions, and PvP standing. No pay-to-win."
        />

        {/* Timeline */}
        <div className="mt-16">
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
            <div className="relative grid grid-cols-3 gap-4 md:grid-cols-6">
              {RANKS.map((r, i) => {
                const Icon = r.Icon;
                const isActive = i === activeRank;
                return (
                  <button
                    key={r.name}
                    onMouseEnter={() => setActiveRank(i)}
                    onFocus={() => setActiveRank(i)}
                    onClick={() => setActiveRank(i)}
                    className="group flex flex-col items-center gap-3 text-center"
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.12 : 1,
                        boxShadow: isActive
                          ? "0 0 40px -4px oklch(0.78 0.2 220 / 0.7)"
                          : "0 0 0px 0 transparent",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className={`glass relative grid h-16 w-16 place-items-center rounded-2xl ${
                        isActive ? "border-cyan/60" : ""
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${r.hue} opacity-60`} />
                      <Icon className="relative h-7 w-7 text-cyan" />
                      <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-deep font-display text-[10px] font-bold text-cyan glow-border">
                        {i + 1}
                      </span>
                    </motion.div>
                    <div
                      className={`font-display text-xs font-bold tracking-widest transition-colors ${
                        isActive ? "text-foreground glow-text" : "text-muted-foreground"
                      }`}
                    >
                      {r.name.toUpperCase()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active rank panel */}
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 rounded-3xl p-8 text-center sm:p-10"
          >
            <div className="text-[10px] uppercase tracking-[0.35em] text-cyan">
              Tier {activeRank + 1} of 6
            </div>
            <h3 className="font-display text-3xl font-black sm:text-5xl">
              <span className="bg-gradient-to-r from-cyan to-accent bg-clip-text text-transparent glow-text">
                {active.name}
              </span>
            </h3>
            <p className="max-w-xl text-muted-foreground">{active.tagline}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Rules() {
  return (
    <section id="rules" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="The protocol"
          title="Server Rules"
          subtitle="Short list. Strictly enforced. Read it once, live it always."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {RULES.map((r, i) => {
            const Icon = r.Icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass group flex gap-4 rounded-2xl p-6 transition-all hover:border-cyan/40"
              >
                <div className="glass grid h-12 w-12 shrink-0 place-items-center rounded-xl">
                  <Icon className="h-5 w-5 text-cyan" />
                </div>
                <div>
                  <div className="font-display text-lg font-bold tracking-wide">
                    {String(i + 1).padStart(2, "0")} · {r.title}
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{r.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DiscordCTA() {
  return (
    <section id="discord" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="glass glow-border relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 0%, oklch(0.78 0.2 220 / 0.4), transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-cyan">
              <MessageCircle className="h-3 w-3" />
              The Civilization
            </div>
            <h2 className="font-display mt-6 text-4xl font-black sm:text-6xl">
              Join the <span className="bg-gradient-to-r from-cyan to-accent bg-clip-text text-transparent glow-text">GullMC</span>
              <br className="hidden sm:block" /> Community on Discord

            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Find teammates, share clips, enter weekly parkour trials, and
              shape the next civilization update with the team.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-accent px-6 font-display text-sm font-bold tracking-wider text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Open Discord <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#top"
                className="glass inline-flex h-12 items-center gap-2 rounded-xl px-6 font-display text-sm font-bold tracking-wider text-foreground"
              >
                Back to top
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 px-4 py-10 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-5xl">
        © {new Date().getFullYear()} GullMC · Parkour Civilization · Not affiliated with Mojang or Microsoft.
      </div>
    </footer>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-[0.35em] text-cyan">{eyebrow}</div>
      <h2 className="font-display mt-3 text-4xl font-black sm:text-5xl">
        <span className="bg-gradient-to-r from-foreground to-cyan bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
