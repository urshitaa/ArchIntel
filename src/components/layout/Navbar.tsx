import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Settings,
  LogOut,
  Zap,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import logo from "../../assets/Logo.png";

const dashboardNavLinks = [
  { label: "Dashboard", href: "/workspace/dashboard" },
  { label: "Reports", href: "/reports" },
  { label: "Insights", href: "/insights" },
  { label: "Pricing", href: "/pricing" },
];

const landingNavLinks = [
  { label: "Features", href: "/features" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "Insights", href: "/insights" },
  { label: "My Reports", href: "/reports" },
];

export function Navbar({
  showLogo = true,
  isLanding = false,
  scrolled = false,
  onMenuClick,
  credits = 0,
}: {
  showLogo?: boolean;
  isLanding?: boolean;
  scrolled?: boolean;
  onMenuClick?: () => void;
  credits?: number;
}) {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerClasses = isLanding
    ? `fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"
    }`
    : "sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl w-full";

  const innerClasses = isLanding
    ? `container flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 mx-auto ${scrolled
      ? "glass-strong shadow-[var(--shadow-soft)]"
      : "glass"
    }`
    : "flex items-center justify-between gap-6 px-6 py-3.5 w-full";

  const activeLinks = isLanding
    ? landingNavLinks
    : dashboardNavLinks;

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={containerClasses}
      >
        <div className={innerClasses}>
          {/* Left Section */}
          <div className="flex items-center gap-12">
            {showLogo ? (
              isLanding ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                  className="group flex items-center gap-2.5"
                >
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-9 w-auto object-contain"
                  />
                </a>
              ) : (
                <Link
                  to="/"
                  className="flex items-center gap-2"
                >
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-9 w-auto object-contain"
                  />
                </Link>
              )
            ) : (
              <div className="flex items-center gap-4">
                {/* Optional content */}
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
            {(user
              ? dashboardNavLinks
              : landingNavLinks
            ).map((l) => {
              const isActive =
                location.pathname === l.href ||
                (l.href !== "/" &&
                  location.pathname.startsWith(l.href));

              return (
                <Link
                  key={l.href}
                  to={l.href}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors whitespace-nowrap ${isActive
                    ? "text-foreground font-medium underline decoration-primary decoration-2 underline-offset-[6px]"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 ml-auto">
            {user ? (
              <>
                <span className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground sm:inline-flex">
                  <Zap className="h-3 w-3 text-primary" />
                  <span>
                    <b className="text-foreground">
                      {credits}
                    </b>{" "}
                    credits
                  </span>
                </span>

                <IconButton>
                  <Bell className="h-4 w-4" />
                </IconButton>

                <IconButton>
                  <Settings className="h-4 w-4" />
                </IconButton>

                <UserMenu
                  user={user}
                  onSignOut={() => {
                    signOut();
                    navigate("/");
                  }}
                />
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    navigate("/signup?mode=login")
                  }
                  className="hidden sm:inline-flex items-center px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="hidden sm:inline-flex shimmer relative items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.45)] hover:shadow-[0_0_36px_hsl(var(--primary)/0.7)]"
                >
                  Try for Free
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            {showLogo && (
              <button
                onClick={() =>
                  onMenuClick
                    ? onMenuClick()
                    : setMobileMenuOpen(!mobileMenuOpen)
                }
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/50 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground ml-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </motion.header >

      {/* Mobile Menu */}
      <AnimatePresence>
        {
          mobileMenuOpen && !onMenuClick && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{ opacity: 0, height: 0 }}
              className="fixed inset-x-0 top-[72px] z-30 overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border md:hidden"
            >
              <div className="p-4 flex flex-col gap-2">
                {activeLinks.map((l) => {
                  const isActive =
                    location.pathname === l.href ||
                    (l.href !== "/" &&
                      location.pathname.startsWith(
                        l.href
                      ));

                  return (
                    <Link
                      key={l.href}
                      to={l.href}
                      onClick={() =>
                        setMobileMenuOpen(false)
                      }
                      className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${isActive
                        ? "text-foreground underline decoration-primary decoration-2 underline-offset-[6px]"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                        }`}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )
        }
      </AnimatePresence >
    </>
  );
}

export function IconButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/50 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
      {children}
    </button>
  );
}

export function UserMenu({
  user,
  onSignOut,
}: {
  user: { name: string; email: string };
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-xs font-semibold text-primary-foreground neon-border"
      >
        <span className="text-foreground">
          {initials || "U"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{
                opacity: 0,
                y: -6,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -6,
                scale: 0.97,
              }}
              transition={{ duration: 0.15 }}
              className="glass absolute right-0 top-11 z-50 w-56 rounded-xl p-2 shadow-[var(--shadow-elevated)]"
            >
              <div className="px-3 py-2">
                <div className="text-sm font-medium">
                  {user.name}
                </div>

                <div className="truncate text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>

              <div className="my-1 h-px bg-border" />

              <button
                onClick={onSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}