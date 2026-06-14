import { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileText,
  Video,
  WifiOff,
  Bluetooth,
  Cpu,
  Send,
  RefreshCw,
  Play,
  Database,
  Users,
  Radio,
  CheckCircle2,
  Signal,
  MapPin,
  TrendingUp,
  Activity,
} from "lucide-react";

const C = {
  bg: "#F6F1E7",
  surface: "#FFFFFF",
  surfaceAlt: "#FBF7EE",
  ink: "#2A2A28",
  muted: "#8A8579",
  line: "#E3DBC8",
  teal: "#1D5C4F",
  tealLight: "#E3EEEA",
  amber: "#D8632F",
  amberLight: "#FBE8DD",
};

type LibraryItem = {
  code: string;
  title: string;
  type: "pdf" | "video";
  size: string;
  preview: string;
};

type FeedItem = {
  name: string;
  loc: string;
  from: string;
  file: string;
  hops?: number;
};

type NodeItem = {
  name: string;
  status: "online" | "syncing" | "offline";
  peers: number;
};

type Message = {
  role: "assistant" | "user";
  text: string;
};

type TabsItem = {
  id: "library" | "mesh" | "tutor" | "impact";
  label: string;
  icon: LucideIcon;
};

const LIBRARY: LibraryItem[] = [
  {
    code: "CSC 301",
    title: "Data Structures & Algorithms — Past Questions (2019–2024)",
    type: "pdf",
    size: "2.4 MB",
    preview: `1. Explain the difference between a stack and a queue, giving one real-world example of each. (2021)

2. Write a function to reverse a singly linked list in O(n) time. State the time and space complexity. (2022)

3. Given an array [4, 2, 7, 1, 9, 3], trace through one full pass of bubble sort, showing the array after each swap. (2020)

4. Differentiate between BFS and DFS traversal of a graph. Under what circumstances would you prefer one over the other? (2023)

5. A binary search tree contains the values 50, 30, 70, 20, 40, 60, 80. Draw the tree and state its height. (2024)`,
  },
  {
    code: "MTH 201",
    title: "Calculus II — Lecture Notes, Weeks 1–10",
    type: "pdf",
    size: "1.8 MB",
    preview: `Week 6: Techniques of Integration — Integration by Parts

Formula: ∫u dv = uv − ∫v du

Worked example:
Find ∫x·eˣ dx

Let u = x, dv = eˣ dx
Then du = dx, v = eˣ

∫x·eˣ dx = x·eˣ − ∫eˣ dx = x·eˣ − eˣ + C = eˣ(x − 1) + C

Tip: choose u as the part that becomes simpler when differentiated (polynomials before exponentials/trig — remember "LIATE").

Practice: try ∫x²·cos(x) dx using integration by parts twice.`,
  },
  {
    code: "CSC 405",
    title: "Computer Networks — Recorded Lecture, Week 5",
    type: "video",
    size: "14.2 MB",
    preview: `Transcript excerpt — Week 5: The OSI Model

"...so when we talk about the seven layers, think of it like sending a letter. The Application layer is you writing the message. The Presentation layer is putting it in a language the recipient understands — encoding, encryption. The Session layer manages the conversation itself, like opening and closing a phone call.

Then we drop down to Transport — this is where TCP and UDP live. TCP is reliable, it confirms delivery; UDP is fast but doesn't check. Network layer handles addressing — that's where IP comes in. Data Link and Physical are the actual cables, radio waves, switches..."

[00:14:32 — Diagram: OSI layers mapped to TCP/IP model]`,
  },
  {
    code: "GST 110",
    title: "Use of English — Tutorial Handout",
    type: "pdf",
    size: "0.6 MB",
    preview: `Topic: Common Errors in Academic Writing

1. Subject-verb agreement
   Wrong: "The list of items are on the table."
   Right: "The list of items is on the table." (subject is "list", singular)

2. Tense consistency
   Wrong: "She walked into the room and sees her friend."
   Right: "She walked into the room and saw her friend."

3. Misuse of "would of" / "should of"
   These should always be "would have" / "should have".

4. Comma splices
   Wrong: "It was raining, we stayed indoors."
   Right: "It was raining, so we stayed indoors." / "It was raining; we stayed indoors."

Exercise: Identify and correct the errors in the five sentences below.`,
  },
  {
    code: "PHY 101",
    title: "Mechanics — Worked Examples & Solutions",
    type: "pdf",
    size: "1.1 MB",
    preview: `Example 3.2 — Projectile Motion

A ball is thrown horizontally from the top of a 20 m tall building with an initial speed of 15 m/s. Find (a) the time taken to reach the ground, and (b) the horizontal distance travelled.

Solution:
(a) Vertical motion: h = ½gt²
    20 = ½ × 9.8 × t²
    t² = 40 / 9.8 = 4.08
    t ≈ 2.02 s

(b) Horizontal motion: x = v × t
    x = 15 × 2.02
    x ≈ 30.3 m

Note: horizontal and vertical motions are independent — the 15 m/s does not affect how fast the ball falls.`,
  },
  {
    code: "ENG 305",
    title: "Software Engineering — Past Questions",
    type: "pdf",
    size: "2.0 MB",
    preview: `1. Compare the Waterfall and Agile software development models. List two advantages and two disadvantages of each. (2022)

2. What is meant by "technical debt"? Describe two strategies a team can use to manage it. (2023)

3. Draw a use-case diagram for a simple library management system, identifying at least three actors. (2021)

4. Explain the purpose of unit testing versus integration testing, with an example of each. (2024)

5. A client requests a new feature mid-sprint. Discuss how an Agile team should handle this request. (2023)`,
  },
];

const TypeIcon = ({ type }: { type: LibraryItem["type"] }) => {
  if (type === "video") return <Video size={18} />;
  return <FileText size={18} />;
};

const FEED_WAVE1 = [
  {
    name: "Bisi",
    loc: "Hostel B, Rm 204",
    from: "seed node",
    file: "CSC 301 — Past Questions",
  },
  {
    name: "Tunde",
    loc: "Library annex",
    from: "seed node",
    file: "MTH 201 — Lecture Notes",
  },
  {
    name: "Ngozi",
    loc: "Faculty walkway",
    from: "seed node",
    file: "PHY 101 — Worked Examples",
  },
];
const FEED_WAVE2: FeedItem[] = [
  {
    name: "Femi",
    loc: "Hostel B, Rm 211",
    from: "Bisi",
    file: "CSC 301 — Past Questions",
    hops: 2,
  },
  {
    name: "Chidi",
    loc: "Cafeteria",
    from: "Tunde",
    file: "MTH 201 — Lecture Notes",
    hops: 2,
  },
  {
    name: "Aisha",
    loc: "Faculty of Science",
    from: "Ngozi",
    file: "PHY 101 — Worked Examples",
    hops: 2,
  },
  {
    name: "Kelechi",
    loc: "Hostel B, Rm 108",
    from: "Bisi",
    file: "CSC 405 — Recorded Lecture",
    hops: 2,
  },
];

const NODES: NodeItem[] = [
  { name: "Main Library", status: "online", peers: 312 },
  { name: "Faculty of Engineering", status: "online", peers: 240 },
  { name: "Hostel B Common Room", status: "online", peers: 198 },
  { name: "Student Union Building", status: "online", peers: 156 },
  { name: "Faculty of Science", status: "syncing", peers: 87 },
  { name: "Hostel D", status: "offline", peers: 0 },
];

// --- Mesh network node layout (viewBox 0 0 400 400) ---
const SEED = { x: 200, y: 200 };
const RING1 = [
  { x: 200, y: 110 },
  { x: 277.9, y: 155 },
  { x: 122.1, y: 155 },
];
const RING2 = [
  { x: 313.1, y: 86.9 },
  { x: 86.9, y: 86.9 },
  { x: 86.9, y: 313.1 },
  { x: 313.1, y: 313.1 },
];
const EDGES_WAVE1 = [
  [SEED, RING1[0]],
  [SEED, RING1[1]],
  [SEED, RING1[2]],
];
const EDGES_WAVE2 = [
  [RING1[0], RING2[0]],
  [RING1[0], RING2[1]],
  [RING1[1], RING2[0]],
  [RING1[1], RING2[3]],
  [RING1[2], RING2[1]],
  [RING1[2], RING2[2]],
];

function MeshMap() {
  const [wave, setWave] = useState(0);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    setWave(0);
    setFeed([]);
    timers.current = [
      setTimeout(() => {
        setWave(1);
        setFeed(FEED_WAVE1);
      }, 500),
      setTimeout(() => {
        setWave(2);
        setFeed((f) => [...FEED_WAVE2, ...f]);
      }, 1400),
    ];
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setWave(0);
    setFeed([]);
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const devicesReached = wave === 0 ? 0 : wave === 1 ? 3 : 7;
  const dataSaved = (devicesReached * 2.4).toFixed(1);

  const edgeStyle = (active: boolean) => ({
    stroke: active ? C.amber : C.line,
    strokeWidth: active ? 2 : 1,
    strokeDasharray: "4 4",
    transition: "stroke 0.4s, stroke-width 0.4s",
  });

  const nodeFill = (active: boolean) => (active ? C.teal : C.surface);
  const nodeStroke = (active: boolean) => (active ? C.teal : C.muted);

  return (
    <div className="flex gap-4">
      <div
        className="rounded-lg p-4 max-w-xl sm:w-1/2"
        style={{ background: C.surface, border: `1px solid ${C.line}` }}
      >
        <svg
          width="100%"
          viewBox="0 0 400 400"
          role="img"
          aria-label="Mesh propagation map"
        >
          {EDGES_WAVE1.map(([a, b], i) => (
            <line
              key={`e1-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              style={edgeStyle(wave >= 1)}
            />
          ))}
          {EDGES_WAVE2.map(([a, b], i) => (
            <line
              key={`e2-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              style={edgeStyle(wave >= 2)}
            />
          ))}

          {/* Seed node */}
          <g>
            <rect
              x={SEED.x - 22}
              y={SEED.y - 22}
              width="44"
              height="44"
              rx="8"
              fill={C.teal}
              stroke={C.teal}
            />
            <text
              x={SEED.x}
              y={SEED.y + 38}
              textAnchor="middle"
              fontSize="11"
              fontFamily="'IBM Plex Mono', monospace"
              fill={C.muted}
            >
              SEED
            </text>
          </g>

          {/* Ring 1 */}
          {RING1.map((p, i) => (
            <circle
              key={`r1-${i}`}
              cx={p.x}
              cy={p.y}
              r="14"
              fill={nodeFill(wave >= 1)}
              stroke={nodeStroke(wave >= 1)}
              strokeWidth="1.5"
              style={{ transition: "fill 0.4s, stroke 0.4s" }}
            />
          ))}

          {/* Ring 2 */}
          {RING2.map((p, i) => (
            <circle
              key={`r2-${i}`}
              cx={p.x}
              cy={p.y}
              r="14"
              fill={nodeFill(wave >= 2)}
              stroke={nodeStroke(wave >= 2)}
              strokeWidth="1.5"
              style={{ transition: "fill 0.4s, stroke 0.4s" }}
            />
          ))}
        </svg>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-lg p-3"
            style={{ background: C.tealLight, border: `1px solid ${C.line}` }}
          >
            <div className="flex items-center gap-2" style={{ color: C.teal }}>
              <Users size={16} />
              <span className="text-sm font-medium">Devices reached</span>
            </div>
            <p
              className="mt-1 text-2xl"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.ink }}
            >
              {devicesReached}
            </p>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ background: C.amberLight, border: `1px solid ${C.line}` }}
          >
            <div className="flex items-center gap-2" style={{ color: C.amber }}>
              <Database size={16} />
              <span className="text-sm font-medium">Mobile data avoided</span>
            </div>
            <p
              className="mt-1 text-2xl"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.ink }}
            >
              {dataSaved} MB
            </p>
          </div>
        </div>

        {feed.length > 0 && (
          <div
            className="rounded-lg p-3 flex flex-col gap-2 overflow-y-auto"
            style={{
              background: C.surface,
              border: `1px solid ${C.line}`,
              maxHeight: "160px",
            }}
          >
            <p
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: C.muted }}
            >
              <Activity size={12} /> Peer activity
            </p>
            {feed.map((f, i) => (
              <div
                key={i}
                className="text-xs"
                style={{
                  color: C.ink,
                  fontFamily: "'IBM Plex Mono', monospace",
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: C.teal }}>{f.name}</span> ({f.loc})
                received <span style={{ color: C.amber }}>{f.file}</span> from{" "}
                {f.from}
                {f.hops ? ` · ${f.hops} hops` : ""}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={run}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: C.teal, color: C.surface }}
          >
            <Play size={15} /> Run propagation
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: C.surface,
              color: C.ink,
              border: `1px solid ${C.line}`,
            }}
          >
            <RefreshCw size={15} /> Reset
          </button>
        </div>

        <p className="text-sm" style={{ color: C.muted, lineHeight: 1.7 }}>
          One device downloads content from the seed node over WiFi. From there,
          it hops device-to-device over Bluetooth / WiFi-Direct — no data spent,
          no internet needed past the first hop.
        </p>
      </div>
    </div>
  );
}

function Library({
  onOpen,
  openItem,
}: {
  onOpen: (index: number | null) => void;
  openItem: number | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      {LIBRARY.map((item, i) => {
        const isOpen = openItem === i;
        return (
          <div
            key={i}
            className="rounded-lg overflow-hidden"
            style={{ border: `1px solid ${C.line}`, background: C.surface }}
          >
            <button
              onClick={() => onOpen(isOpen ? null : i)}
              className="w-full flex items-center gap-3 p-3 text-left"
            >
              <div
                className="flex items-center justify-center rounded-md p-2"
                style={{ background: C.tealLight, color: C.teal }}
              >
                <TypeIcon type={item.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{
                      background: C.amberLight,
                      color: C.amber,
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    {item.code}
                  </span>
                  <span className="text-xs" style={{ color: C.muted }}>
                    {item.size}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: C.ink }}>
                  {item.title}
                </p>
              </div>
              <div
                className="flex items-center gap-1 text-xs shrink-0"
                style={{ color: C.teal }}
              >
                <CheckCircle2 size={14} />
                <span>Cached</span>
              </div>
            </button>
            {isOpen && (
              <div className="px-4 pb-4">
                <div
                  className="rounded-lg p-3 text-sm whitespace-pre-wrap"
                  style={{
                    background: C.surfaceAlt,
                    border: `1px solid ${C.line}`,
                    color: C.ink,
                    lineHeight: 1.7,
                    fontFamily:
                      item.type === "video"
                        ? "'Space Grotesk', sans-serif"
                        : "'IBM Plex Mono', monospace",
                    fontSize: "12.5px",
                  }}
                >
                  {item.preview}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Tutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi, I'm the MeshLib study assistant — running on this seed node, no internet needed. Ask me anything about your course materials.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system:
            "You are the MeshLib offline study assistant, running locally on a seed node device in a Nigerian university library with no internet connection. Help students understand their coursework clearly and concisely, using simple language and examples relevant to a Nigerian undergraduate. Keep responses focused and not too long.",
          messages: next.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = (await res.json()) as {
        content?: Array<{ type: string; text: string }>;
      };
      const reply = (data.content || [])
        .filter((c): c is { type: "text"; text: string } => c.type === "text")
        .map((c) => c.text)
        .join("\n");
      setMessages((m) => [
        ...m,
        { role: "assistant", text: reply || "Sorry, I couldn't process that." },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Connection error — try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 rounded-lg p-3 overflow-y-auto"
        style={{
          background: C.surface,
          border: `1px solid ${C.line}`,
          height: "280px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="rounded-lg px-3 py-2 text-sm max-w-[85%]"
              style={{
                background: m.role === "user" ? C.tealLight : C.surfaceAlt,
                color: C.ink,
                lineHeight: 1.6,
                border: `1px solid ${C.line}`,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: C.surfaceAlt,
                color: C.muted,
                border: `1px solid ${C.line}`,
              }}
            >
              Thinking…
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your coursework…"
          className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: C.surface,
            border: `1px solid ${C.line}`,
            color: C.ink,
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          className="flex items-center justify-center rounded-lg px-3"
          style={{
            background: C.teal,
            color: C.surface,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Send size={16} />
        </button>
      </div>
      <p className="text-xs" style={{ color: C.muted }}>
        Demo note: this assistant calls a hosted model for the live demo. On a
        real seed node, a compact offline model runs directly on the device.
      </p>
    </div>
  );
}

function ConnectScreen({ onConnect }: { onConnect: () => void }) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(onConnect, 1100);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-12">
      <div
        className="rounded-full p-4 mb-4"
        style={{ background: C.tealLight, color: C.teal }}
      >
        <Bluetooth size={32} />
      </div>
      <p
        className="text-xs uppercase tracking-wide mb-1"
        style={{ color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Nearby network
      </p>
      <h2 className="text-xl font-medium mb-1" style={{ color: C.ink }}>
        MeshLib-04
      </h2>
      <p className="text-sm mb-6" style={{ color: C.muted }}>
        UNILAG Main Library · No internet required
      </p>
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
        style={{
          background: C.teal,
          color: C.surface,
          opacity: connecting ? 0.7 : 1,
        }}
      >
        {connecting ? (
          <RefreshCw size={15} className="animate-spin" />
        ) : (
          <Bluetooth size={15} />
        )}
        {connecting ? "Connecting…" : "Connect"}
      </button>
      <p
        className="text-xs mt-6 max-w-xs"
        style={{ color: C.muted, lineHeight: 1.7 }}
      >
        Connecting joins this device to the seed node's local network — no data
        bundle, no signup, no account needed.
      </p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="rounded-lg p-3"
      style={{ background: bg, border: `1px solid ${C.line}` }}
    >
      <div className="flex items-center gap-2" style={{ color }}>
        <Icon size={15} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p
        className="mt-1 text-xl"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.ink }}
      >
        {value}
      </p>
      <p className="text-xs" style={{ color: C.muted }}>
        {sub}
      </p>
    </div>
  );
}

function Impact() {
  const maxPeers = Math.max(...NODES.map((n) => n.peers));
  const statusColor = (s: NodeItem["status"]) =>
    s === "online" ? C.teal : s === "syncing" ? C.amber : C.muted;
  const statusLabel = (s: NodeItem["status"]) =>
    s === "online" ? "Online" : s === "syncing" ? "Syncing" : "Offline";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat
          icon={Users}
          label="Students reached"
          value="1,240"
          sub="this week"
          color={C.teal}
          bg={C.tealLight}
        />
        <Stat
          icon={Database}
          label="Data saved"
          value="38 GB"
          sub="this week"
          color={C.amber}
          bg={C.amberLight}
        />
        <Stat
          icon={MapPin}
          label="Seed nodes"
          value="6"
          sub="across campus"
          color={C.teal}
          bg={C.tealLight}
        />
      </div>

      <div
        className="rounded-lg p-4"
        style={{ background: C.surface, border: `1px solid ${C.line}` }}
      >
        <p className="text-sm font-medium mb-3" style={{ color: C.ink }}>
          Seed nodes — today's activity
        </p>
        <div className="flex flex-col gap-3">
          {NODES.map((n, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm" style={{ color: C.ink }}>
                  {n.name}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: statusColor(n.status),
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {statusLabel(n.status)} · {n.peers} peers
                </span>
              </div>
              <div
                className="rounded-full h-1.5 overflow-hidden"
                style={{ background: C.line }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max((n.peers / maxPeers) * 100, 2)}%`,
                    background: statusColor(n.status),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm" style={{ color: C.muted, lineHeight: 1.7 }}>
        Every seed node syncs with the internet on a schedule, then
        redistributes new content across its mesh — turning one data bundle into
        coverage for hundreds of students.
      </p>
    </div>
  );
}

export default function MeshLibDemo() {
  const [screen, setScreen] = useState<"connect" | "console">("connect");
  const [tab, setTab] = useState<"library" | "mesh" | "tutor" | "impact">(
    "library",
  );
  const [openItem, setOpenItem] = useState<number | null>(null);

  const tabs: TabsItem[] = [
    { id: "library", label: "Library", icon: BookOpen },
    { id: "mesh", label: "Mesh map", icon: Radio },
    { id: "tutor", label: "AI tutor", icon: Cpu },
    { id: "impact", label: "Impact", icon: TrendingUp },
  ];

  return (
    <div
      style={{
        background: C.bg,
        fontFamily: "'Space Grotesk', sans-serif",
        color: C.ink,
      }}
      className="w-full rounded-xl overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      {/* Console header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: C.ink, color: C.bg }}
      >
        <div className="flex items-center gap-2">
          <Bluetooth size={18} />
          <span
            className="text-sm font-medium tracking-wide"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            MESHLIB · NODE #04
          </span>
        </div>
        <div
          className="flex items-center gap-3 text-xs"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.muted }}
        >
          <span className="hidden sm:inline">UNILAG MAIN LIBRARY</span>
          <span className="flex items-center gap-1">
            <WifiOff size={14} /> offline
          </span>
          <span className="flex items-center gap-1">
            <Signal size={14} /> 7 peers
          </span>
          {/* <span className="flex items-center gap-1">
            <Battery size={14} /> 92%
          </span> */}
        </div>
      </div>

      {screen === "connect" ? (
        <ConnectScreen onConnect={() => setScreen("console")} />
      ) : (
        <>
          {/* Tabs */}
          <div
            className="flex gap-1 px-4 pt-3"
            style={{ borderBottom: `1px solid ${C.line}` }}
          >
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg"
                  style={{
                    color: active ? C.teal : C.muted,
                    borderBottom: active
                      ? `2px solid ${C.teal}`
                      : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  <Icon size={15} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-4">
            {tab === "library" && (
              <>
                <p className="text-xs mb-3" style={{ color: C.muted }}>
                  Tap a file to preview the cached content — no internet needed.
                </p>
                <Library onOpen={setOpenItem} openItem={openItem} />
              </>
            )}
            {tab === "mesh" && <MeshMap />}
            {tab === "tutor" && <Tutor />}
            {tab === "impact" && <Impact />}
          </div>
        </>
      )}
    </div>
  );
}
