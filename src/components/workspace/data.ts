export type RepoMeta = { owner: string; name: string; full: string };

export type FileNode = {
  name: string;
  type: "folder" | "file";
  path: string;
  children?: FileNode[];
  ext?: string;
  size?: string;
  loc?: number;
  modified?: string;
  summary?: string;
  imports?: string[];
  exports?: string[];
  preview?: string;
};

export function parseRepo(url: string): RepoMeta {
  const m = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  const owner = m?.[1] ?? "vercel";
  const name = (m?.[2] ?? "next.js").replace(/\.git$/, "");
  return { owner, name, full: `${owner}/${name}` };
}

/** Smart guess of stack from repo name keywords. */
export function guessStack(repo: RepoMeta) {
  const k = (repo.full + " " + repo.name).toLowerCase();
  const has = (s: string) => k.includes(s);
  const stack = {
    languages: [
      { name: "TypeScript", value: 64, color: "#3178c6" },
      { name: "JavaScript", value: 18, color: "#f7df1e" },
      { name: "CSS", value: 9, color: "#2965f1" },
      { name: "MDX", value: 6, color: "#fcb32c" },
      { name: "Other", value: 3, color: "#64748b" },
    ],
    frameworks: ["React 18", has("next") ? "Next.js 15" : "Vite 5", "Tailwind CSS"],
    libraries: ["zod", "lucide-react", "framer-motion", has("ai") ? "openai" : "swr"],
    tooling: ["ESLint", "Prettier", "Vitest", "SWC"],
    highlights: [
      "Uses React",
      has("next") ? "App Router detected" : "Vite + SWC",
      "Tailwind configured",
      has("ai") ? "AI embeddings" : "Type-safe APIs",
    ],
  };
  return stack;
}

export const fileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    summary: "Application source. Contains UI, pages, and business logic.",
    children: [
      {
        name: "components",
        type: "folder",
        path: "src/components",
        summary: "Reusable UI components used across pages.",
        children: [
          {
            name: "Button.tsx",
            type: "file",
            ext: "tsx",
            path: "src/components/Button.tsx",
            size: "2.1 KB",
            loc: 84,
            modified: "2 days ago",
            imports: ["react", "clsx", "@/lib/utils"],
            exports: ["Button", "buttonVariants"],
            summary: "Polymorphic button with variant + size props, asChild support.",
            preview: `export function Button({ variant = "default", ...props }) {\n  return <button className={cn(variants({ variant }))} {...props} />;\n}`,
          },
          {
            name: "Card.tsx",
            type: "file",
            ext: "tsx",
            path: "src/components/Card.tsx",
            size: "1.4 KB",
            loc: 52,
            modified: "5 days ago",
            imports: ["react", "@/lib/utils"],
            exports: ["Card", "CardHeader", "CardContent"],
            summary: "Composable card primitives with header/content/footer slots.",
            preview: `export const Card = forwardRef((props, ref) => (\n  <div ref={ref} className="rounded-lg border" {...props} />\n));`,
          },
        ],
      },
      {
        name: "pages",
        type: "folder",
        path: "src/pages",
        summary: "Top-level routes rendered by the router.",
        children: [
          {
            name: "index.tsx",
            type: "file",
            ext: "tsx",
            path: "src/pages/index.tsx",
            size: "3.8 KB",
            loc: 142,
            modified: "6 hours ago",
            imports: ["react", "next/link", "@/components/Button"],
            exports: ["default"],
            summary: "Marketing landing page with hero, features, and CTA.",
            preview: `export default function Home() {\n  return <main><Hero /><Features /></main>;\n}`,
          },
          {
            name: "api.ts",
            type: "file",
            ext: "ts",
            path: "src/pages/api.ts",
            size: "1.1 KB",
            loc: 38,
            modified: "Yesterday",
            imports: ["zod", "@/lib/db"],
            exports: ["GET", "POST"],
            summary: "REST handlers for server-side data fetching.",
            preview: `export async function GET(req) {\n  return Response.json(await db.query());\n}`,
          },
        ],
      },
      {
        name: "hooks",
        type: "folder",
        path: "src/hooks",
        summary: "Custom React hooks for shared stateful logic.",
        children: [
          {
            name: "useAuth.ts",
            type: "file",
            ext: "ts",
            path: "src/hooks/useAuth.ts",
            size: "0.9 KB",
            loc: 34,
            modified: "3 days ago",
            imports: ["react"],
            exports: ["useAuth"],
            summary: "Reads/writes auth state from localStorage with subscriptions.",
            preview: `export function useAuth() {\n  const [user, setUser] = useState(read());\n  return { user, signOut };\n}`,
          },
        ],
      },
      {
        name: "utils",
        type: "folder",
        path: "src/utils",
        summary: "Pure helper functions: formatting, parsing, math.",
        children: [
          {
            name: "format.ts",
            type: "file",
            ext: "ts",
            path: "src/utils/format.ts",
            size: "0.6 KB",
            loc: 22,
            modified: "1 week ago",
            imports: [],
            exports: ["formatNumber", "formatDate"],
            summary: "Locale-aware formatting helpers for numbers and dates.",
            preview: `export const formatNumber = (n) => Intl.NumberFormat().format(n);`,
          },
        ],
      },
      {
        name: "api",
        type: "folder",
        path: "src/api",
        summary: "API client wrappers and request schemas.",
        children: [
          {
            name: "client.ts",
            type: "file",
            ext: "ts",
            path: "src/api/client.ts",
            size: "1.7 KB",
            loc: 61,
            modified: "4 days ago",
            imports: ["zod"],
            exports: ["apiClient"],
            summary: "Typed fetch wrapper with retries and zod-validated responses.",
            preview: `export const apiClient = createClient({ baseUrl, retries: 3 });`,
          },
        ],
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
    ext: "json",
    path: "package.json",
    size: "1.9 KB",
    loc: 64,
    modified: "Today",
    imports: [],
    exports: [],
    summary: "Project manifest. Declares dependencies, scripts, and metadata.",
    preview: `{\n  "name": "app",\n  "scripts": { "dev": "vite" }\n}`,
  },
  {
    name: "README.md",
    type: "file",
    ext: "md",
    path: "README.md",
    size: "4.2 KB",
    loc: 120,
    modified: "1 week ago",
    imports: [],
    exports: [],
    summary: "Project documentation: setup, scripts, contribution guide.",
    preview: `# Project\nGetting started, install deps, run dev.`,
  },
];

/** Flatten file nodes for search. */
export function flattenFiles(nodes: FileNode[]): FileNode[] {
  const out: FileNode[] = [];
  const walk = (ns: FileNode[]) => {
    for (const n of ns) {
      out.push(n);
      if (n.children) walk(n.children);
    }
  };
  walk(nodes);
  return out;
}

export const summaryStyles = {
  easy: "This file is like a button you press to make something happen. It draws the button on the screen and lets you tell it what color and size to be.",
  concise: "Reusable button component with variant + size props, accessible focus states, and asChild rendering.",
  detailed:
    "Implements a polymorphic Button using class-variance-authority for variant management. Forwards refs, supports Radix Slot for composition (asChild), and exposes typed props extending native HTML button attributes. Tailwind classes drive visual variants while preserving keyboard focus rings.",
  technical:
    "React.forwardRef<HTMLButtonElement, ButtonProps>() returning a Comp = asChild ? Slot : 'button'. CVA buttonVariants() composes default | destructive | outline | secondary | ghost | link with size tokens (default | sm | lg | icon). Inherits ARIA + ring offset utilities; aligns with shadcn/ui conventions.",
};

export const dependencies = [
  { name: "react", version: "18.3.1", type: "direct" as const, deps: ["scheduler", "loose-envify"] },
  { name: "react-dom", version: "18.3.1", type: "direct" as const, deps: ["react", "scheduler"] },
  { name: "next", version: "15.0.0", type: "direct" as const, deps: ["react", "react-dom"] },
  { name: "zod", version: "3.23.8", type: "direct" as const, deps: [] },
  { name: "tailwindcss", version: "3.4.13", type: "direct" as const, deps: ["postcss"] },
  { name: "lucide-react", version: "0.462.0", type: "direct" as const, deps: ["react"] },
  { name: "framer-motion", version: "11.5.0", type: "direct" as const, deps: ["react"] },
  { name: "scheduler", version: "0.23.0", type: "transitive" as const, deps: [] },
  { name: "postcss", version: "8.4.47", type: "transitive" as const, deps: [] },
  { name: "loose-envify", version: "1.4.0", type: "transitive" as const, deps: [] },
];

export const aiAnswers: { match: RegExp; answer: string }[] = [
  {
    match: /auth|login|sign/i,
    answer:
      "Auth lives in `src/hooks/useAuth.ts`. It reads a mock user from `localStorage` and emits a custom event so the rest of the app re-renders when the user signs in or out. Production swap-in: replace the read/write helpers with calls to your auth provider (Supabase, Clerk, NextAuth).",
  },
  {
    match: /api|route|endpoint/i,
    answer:
      "API routes live under `src/pages/api.ts` (and `src/api/client.ts` on the client side). Handlers are exported as `GET`/`POST`, validated with `zod`, and call into a thin db layer. The client wrapper retries 3× and parses responses through schemas.",
  },
  {
    match: /state|store|context/i,
    answer:
      "State is mostly local React state plus a few custom hooks. Cross-tab state (auth) uses `localStorage` + a `storage` event listener. There is no global store — components pass props or use context for theming.",
  },
  {
    match: /build|deploy|ci/i,
    answer:
      "Build uses Vite (`vite build`) with SWC for fast TS transforms. Tailwind is compiled via PostCSS. Output is a static bundle in `dist/` ready to deploy to any CDN. CI runs `vitest run` before building.",
  },
];

export function answerFor(q: string): string {
  const hit = aiAnswers.find((a) => a.match.test(q));
  return (
    hit?.answer ??
    "Based on the indexed repo, the most relevant modules are in `src/components` and `src/pages`. Try asking about auth, API routes, state management, or the build process for a deeper answer."
  );
}