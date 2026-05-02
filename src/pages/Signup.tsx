import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Github, Sparkles, ArrowRight, Mail, User as UserIcon, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

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
      navigate("/workspace/dashboard", { replace: true });
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
      navigate("/workspace/dashboard", { replace: true });
    }, 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground font-sans">

      {/* Background glowing orbs matching theme */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -left-[20%] top-[20%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-[10%] top-[40%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex w-full flex-col lg:flex-row min-h-screen">

        {/* Header (Absolute position for layout) */}
        <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-6 lg:px-40 lg:py-8 z-50">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 neon-border">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold tracking-tight">CodeBase Explainer</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            ← Back to home
          </Link>
        </header>

        {/* Left Side - Hero Content */}
        <div className="relative flex w-full lg:w-[65%] flex-col justify-center px-6 lg:px-24 py-24 lg:py-12">

          {/* Animated Connecting Lines Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center">
            <svg className="absolute left-0 w-full h-full" style={{ top: '50%', transform: 'translateY(-50%)' }} preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Paths */}
              <path d="M-100,100 C200,250 300,300 1000,300" stroke="currentColor" className="text-primary/40" strokeWidth="1.5" />
              <path d="M-100,300 L1000,300" stroke="currentColor" className="text-primary/60" strokeWidth="2" />
              <path d="M-100,500 C200,350 300,300 1000,300" stroke="currentColor" className="text-primary/40 shadow-lg " strokeWidth="1.5" />

              {/* Animated Ball 1 (Top Line) */}
              <circle r="5" fill="currentColor" className="text-primary" filter="url(#glow)">
                <animateMotion dur="5s" repeatCount="indefinite" path="M-100,100 C200,250 300,300 1000,300" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="5s" repeatCount="indefinite" />
              </circle>

              {/* Animated Ball 2 (Middle Line) */}
              <circle r="6" fill="currentColor" className="text-primary" filter="url(#glow)">
                <animateMotion dur="4s" repeatCount="indefinite" path="M-100,300 L1000,300" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* Animated Ball 3 (Bottom Line) */}
              <circle r="5" fill="currentColor" className="text-primary shadow-lg shadow-white" filter="url(#glow)">
                <animateMotion dur="6s" repeatCount="indefinite" path="M-100,500 C200,350 300,300 1000,300" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="6s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>


          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative ml-40 -mt-20 z-10 px-10 max-w-xl hidden lg:flex flex-col"
          >
            <span className="   mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary blink" />
              Free during beta
            </span>
            <h1 className="text-7xl font-semibold leading-tight tracking-tight md:text-5xl">
              Understand any GitHub repo in <span className="text-gradient">seconds.</span>
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Create your account to unlock AI summaries, architecture diagrams, dependency maps and developer insights.
            </p>
            <ul className="mt-32 space-y-3 text-sm text-muted-foreground">
              {["Unlimited public repo analyses", "Save and share reports", "Beautiful interactive diagrams", "Onboard teammates 10× faster"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-lg">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary ">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="relative z-10 flex w-full lg:w-[50%] items-center justify-center lg:-ml-36 p-6 lg:p-12">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="glass w-full max-w-md relative rounded-2xl p-8 shadow-[var(--shadow-elevated)]"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground mb-8">
              {mode === "signup"
                ? "Start exploring repositories in under a minute."
                : "Sign in to continue exploring repositories."}
            </p>

            <button
              type="button"
              onClick={onGithub}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm font-medium hover:bg-surface transition-colors disabled:opacity-60 mb-6"
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
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.01] disabled:opacity-60 glow-cta mt-2"
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
        </div>
      </div>
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