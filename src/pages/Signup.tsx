import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Github, Sparkles, ArrowRight, Mail, User as UserIcon, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Particles } from "@/components/landing/Particles";

export default function Signup() {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialMode = searchParams.get("mode") === "login" ? "login" : "signup";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentMode = searchParams.get("mode");
    if (currentMode === "login" && mode !== "login") setMode("login");
    if (currentMode !== "login" && mode !== "signup") setMode("signup");
  }, [searchParams, mode]);

  const toggleMode = () => {
    setSearchParams(mode === "signup" ? { mode: "login" } : {});
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    
    try {
      if (mode === "signup") {
        await signUp(name, email, password);
      } else {
        await signIn(email, password);
      }
      navigate("/welcome", { replace: true });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onGithub = () => {
    setLoading(true);
    setTimeout(() => {
      // Mock github login for now
      signUp("Octo Dev", "octo@github.dev", "githubpass");
      navigate("/welcome", { replace: true });
    }, 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 grid-bg opacity-60 grid-drift" />
      <Particles count={28} />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 neon-border">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold tracking-tight">CodeBase Explainer</span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to home
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden flex-col justify-center lg:flex"
        >
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary blink" />
            Free during beta
          </span>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Understand any GitHub repo in <span className="text-gradient">seconds.</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Create your account to unlock AI summaries, architecture diagrams, dependency maps and developer insights.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {["Unlimited public repo analyses", "Save and share reports", "Beautiful interactive diagrams", "Onboard teammates 10× faster"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative rounded-2xl p-8 shadow-[var(--shadow-elevated)]"
        >
          <h2 className="text-2xl font-semibold tracking-tight">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signup" 
              ? "Start exploring repositories in under a minute."
              : "Sign in to continue exploring repositories."}
          </p>

          <button
            type="button"
            onClick={onGithub}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm font-medium hover:bg-surface transition-colors disabled:opacity-60"
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}
            
            {mode === "signup" && (
              <Field icon={UserIcon} label="Full name" value={name} onChange={setName} placeholder="Ada Lovelace" />
            )}
            <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@dev.com" required />
            <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required minLength={8} />

            <button
              type="submit"
              disabled={loading || !email}
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.01] disabled:opacity-60 glow-cta"
            >
              {loading ? (mode === "signup" ? "Creating account..." : "Signing in...") : (mode === "signup" ? "Create account" : "Sign in")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={toggleMode} className="text-primary hover:underline font-medium">Sign in</button>
                <br /><br />
                By signing up you agree to our Terms & Privacy Policy.
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button type="button" onClick={toggleMode} className="text-primary hover:underline font-medium">Sign up</button>
              </>
            )}
          </p>
        </motion.div>
      </main>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  minLength,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          value={value}
          required={required}
          minLength={minLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-surface px-10 py-2.5 text-sm outline-none ring-0 transition focus:border-primary/60 focus:bg-surface-2"
        />
      </span>
    </label>
  );
}