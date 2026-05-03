import { useState, useEffect, useRef } from "react";
import { Github, ArrowRight, GitBranch, Database, Layers, Box, Code2 } from "lucide-react";
import robotImg from "../assets/robo1.png";
import rightImg from "../assets/landing_right.png";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
// ─── Tiny helpers ────────────────────────────────────────────────────────────

function useNavigate() { return (path: string) => console.log("navigate →", path); }
//function useAuth() { return { user: null }; }

// ─── Particle Canvas ─────────────────────────────────────────────────────────

function ParticleField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        let raf: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const DOTS = Array.from({ length: 55 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            alpha: Math.random() * 0.5 + 0.15,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            DOTS.forEach((d) => {
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0) d.x = canvas.width;
                if (d.x > canvas.width) d.x = 0;
                if (d.y < 0) d.y = canvas.height;
                if (d.y > canvas.height) d.y = 0;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,230,200,${d.alpha})`;
                ctx.fill();
            });
            // draw connecting lines
            DOTS.forEach((a, i) => {
                DOTS.slice(i + 1).forEach((b) => {
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(0,210,185,${0.12 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                });
            });
            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    );
}

// ─── Robot Image (Left) ──────────────────────────────────────────────────────

function RobotImage() {
    return (
        <div style={{
            position: "absolute",
            left: "-2%",
            top: "60%",
            transform: "translateY(-50%)",
            width: 620,
            animation: "floatLeft 6s ease-in-out infinite",
            zIndex: 2,
        }}>
            <img src={robotImg} alt="AI Robot" style={{
                width: "200%",
                height: "auto",
                filter: "drop-shadow(0 0 30px rgba(0,210,185,0.25))",
                transition: "transform 0.3s ease"
            }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
        </div>
    );
}

function RightImage() {
    return (
        <div style={{
            position: "absolute",
            right: "-2%",
            top: "60%",
            transform: "translateY(-50%)",
            width: 500,
            animation: "floatLeft 6s ease-in-out infinite",
            zIndex: 2,
        }}>
            <img src={rightImg} alt="AI Robot" style={{
                width: "200%",
                height: "auto",
                filter: "drop-shadow(0 0 30px rgba(0,210,185,0.25))",
                transition: "transform 0.3s ease"
            }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
        </div>
    );
}

// ─── Feature Cards (Right) ───────────────────────────────────────────────────

function FeatureCards() {
    const cards = [
        { icon: <Database size={20} color="#00d4b8" />, title: "Architecture Diagrams", desc: "Visualize the structure of any project." },
        { icon: <GitBranch size={20} color="#00d4b8" />, title: "Dependency Graphs", desc: "See how everything connects." },
        { icon: <Layers size={20} color="#00d4b8" />, title: "AI Explanations", desc: "Get clear, concise insights." }
    ];

    return (
        <div style={{
            position: "absolute",
            right: "1%",
            top: "80%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            zIndex: 2,
            animation: "floatRight 7s ease-in-out infinite",
        }}>
            {cards.map((c, i) => (
                <div key={i} style={{
                    background: "rgba(8,16,30,0.88)",
                    border: "1px solid rgba(0,210,185,0.2)",
                    borderRadius: 14,
                    padding: "16px 20px",
                    width: 380,
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 0 40px rgba(0,200,170,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    animation: `fadeInLine 0.5s ease ${i * 0.15}s both`,
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                    cursor: "default"
                }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateX(-8px)";
                        e.currentTarget.style.borderColor = "rgba(0,210,185,0.4)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateX(0)";
                        e.currentTarget.style.borderColor = "rgba(0,210,185,0.2)";
                    }}
                >
                    <div style={{
                        background: "rgba(0,210,185,0.1)",
                        borderRadius: 10,
                        padding: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "inset 0 0 10px rgba(0,210,185,0.05)"
                    }}>
                        {c.icon}
                    </div>
                    <div>
                        <h4 style={{ margin: 0, color: "#e2e8f0", fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>{c.title}</h4>
                        <p style={{ margin: "4px 0 0", color: "rgba(148,163,184,0.85)", fontSize: 12, lineHeight: 1.4 }}>{c.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Corner Globe ────────────────────────────────────────────────────────────

function CornerGlobe() {
    return (
        <div style={{
            position: "absolute",
            top: "15%",
            right: "-4%",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, rgba(0,210,185,0.3), rgba(2,13,26,0.9))",
            boxShadow: "0 0 50px rgba(0,210,185,0.15), inset -15px -15px 30px rgba(0,0,0,0.6)",
            border: "1px solid rgba(0,210,185,0.15)",
            zIndex: 1,
            animation: "spinGlobe 25s linear infinite",
            overflow: "hidden"
        }}>
            <div style={{
                position: "absolute",
                width: 50, height: 25,
                background: "rgba(0,210,185,0.15)",
                borderRadius: "50%",
                top: "25%", left: "15%",
                transform: "rotate(-25deg)",
                filter: "blur(2px)"
            }} />
            <div style={{
                position: "absolute",
                width: 70, height: 35,
                background: "rgba(0,210,185,0.2)",
                borderRadius: "50%",
                top: "55%", right: "15%",
                transform: "rotate(15deg)",
                filter: "blur(3px)"
            }} />
            <div style={{
                position: "absolute",
                top: "-20%", left: "-20%", right: "-20%", bottom: "-20%",
                borderRadius: "50%",
                border: "2px solid rgba(0,210,185,0.1)",
                transform: "rotateX(75deg) rotateY(20deg)",
                boxShadow: "0 0 10px rgba(0,210,185,0.2)"
            }} />
        </div>
    );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
    return (
        <nav style={{
            position: "fixed",
            top: 0, left: 0, right: 0,
            zIndex: 50,
            background: "rgba(5,12,24,0.7)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,210,185,0.1)",
            padding: "0 48px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    width: 30, height: 30,
                    background: "linear-gradient(135deg,#00d4b8,#0088ff)",
                    borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Code2 size={16} color="#fff" />
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: "#e2e8f0", letterSpacing: "-0.02em" }}>
                    CodeBase Explainer
                </span>
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                {["Features", "How it Works", "Insights", "My Reports"].map((link) => (
                    <a key={link} href="#" style={{ color: "rgba(148,163,184,0.8)", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#00d4b8")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(148,163,184,0.8)")}
                    >
                        {link}
                    </a>
                ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <a href="#" style={{ color: "rgba(148,163,184,0.8)", fontSize: 13, textDecoration: "none" }}>Sign In</a>
                <button style={{
                    background: "linear-gradient(135deg,#00d4b8,#00a89a)",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#020d1a",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "transform 0.2s, box-shadow 0.2s",
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,184,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                    Try for Free <ArrowRight size={13} />
                </button>
            </div>
        </nav>
    );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────

export default function Landing() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [repoUrl, setRepoUrl] = useState("https://github.com/vercel/next.js");
    const [inputFocused, setInputFocused] = useState(false);
    console.log("User", user);
    // const handleAnalyze = () => {
    //     let owner = "vercel", repo = "next.js";
    //     if (user) {
    //         navigate(`/workspace/dashboard`);
    //     } else {
    //         navigate('/auth/login')
    //     }
    // };

    return (
        <>
            {/* Global keyframes */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');

        @keyframes floatLeft  { 0%,100%{transform:translateY(-50%) translateX(0)} 50%{transform:translateY(-50%) translateX(8px)} }
        @keyframes floatRight { 0%,100%{transform:translateY(-50%) translateX(0)} 50%{transform:translateY(-50%) translateX(-8px)} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeInLine { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:none} }
        @keyframes slideUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes pulseGlow  { 0%,100%{box-shadow:0 0 18px rgba(0,212,184,0.35)} 50%{box-shadow:0 0 38px rgba(0,212,184,0.65)} }
        @keyframes dotBlink   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes gridDrift  { 0%{background-position:0 0} 100%{background-position:40px 40px} }
        @keyframes spinGlobe  { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }

        .hero-word span { display:inline-block; animation:slideUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .hero-word span:nth-child(1){animation-delay:.05s}
        .hero-word span:nth-child(2){animation-delay:.12s}
        .hero-word span:nth-child(3){animation-delay:.19s}
        .hero-word span:nth-child(4){animation-delay:.26s}

        .highlight-repo { background: linear-gradient(90deg,#00d4b8,#00a0ff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        .analyze-btn:hover { filter:brightness(1.12); box-shadow:0 0 28px rgba(0,212,184,0.45) !important; }

        .grid-bg {
          background-image: linear-gradient(rgba(0,210,185,0.045) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,210,185,0.045) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridDrift 8s linear infinite;
        }
      `}</style>

            {/* <Navbar /> */}

            <section style={{
                position: "relative",
                minHeight: "100vh",
                background: "linear-gradient(160deg,#020d1a 0%,#040f20 50%,#050e1c 100%)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 60,
                fontFamily: "'Space Grotesk', sans-serif",
            }}>
                {/* Grid bg */}
                <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

                {/* Radial glow center */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse 65% 55% at 50% 42%, rgba(0,200,170,0.12) 0%, transparent 70%)",
                    zIndex: 0,
                }} />
                {/* Radial glow bottom-left */}
                <div style={{
                    position: "absolute",
                    bottom: "-10%", left: "-5%",
                    width: 600, height: 400,
                    background: "radial-gradient(ellipse at center, rgba(0,80,200,0.1) 0%, transparent 70%)",
                    zIndex: 0,
                }} />

                {/* Particles */}
                <ParticleField />

                {/* Side mock panels & Globe */}
                <RobotImage />
                <RightImage />
                {/* <FeatureCards /> */}
                <CornerGlobe />


                {/* Center content */}
                <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 720, padding: "0 24px", }}>

                    {/* Badge */}
                    <div style={{ animation: "slideUp 0.5s ease both", display: "flex", justifyContent: "center", marginBottom: 28 }}>
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "rgba(0,210,185,0.07)",
                            border: "1px solid rgba(0,210,185,0.22)",
                            borderRadius: 100,
                            padding: "6px 16px",

                            fontSize: 12,
                            color: "rgba(0,210,185,0.85)",
                            letterSpacing: "0.02em",
                        }}>
                            <span style={{
                                width: 7, height: 7, borderRadius: "50%",
                                background: "#00d4b8",
                                boxShadow: "0 0 10px #00d4b8",
                                animation: "dotBlink 1.4s ease-in-out infinite",
                                display: "inline-block",
                            }} />
                            New: AI 3-Step Breakdown is live
                            <ArrowRight size={11} style={{ opacity: 0.7 }} />
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontSize: "clamp(38px,7vw,72px)",
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: "-0.03em",
                        color: "#f0f8ff",
                        marginBottom: 20,
                    }}>
                        <div className="hero-word">
                            {"Explore. Analyze.".split(" ").map((w, i) => (
                                <span key={i} style={{ marginRight: "0.25em" }}>{w}</span>
                            ))}
                        </div>
                        <div className="hero-word" style={{ animationDelay: "0.18s" }}>
                            <span className="highlight-repo">Understand.</span>
                        </div>
                    </h1>

                    {/* Subtext */}
                    <p style={{
                        fontSize: 17,
                        color: "rgba(148,163,184,0.85)",
                        lineHeight: 1.65,
                        maxWidth: 520,
                        margin: "0 auto 36px",
                        animation: "slideUp 0.55s ease 0.3s both",
                    }}>
                        Turn any GitHub repository into knowledge.<br />
                        Diagrams, graphs, and AI explanations in seconds.
                    </p>

                    {/* Input row */}
                    <div style={{ animation: "slideUp 0.55s ease 0.42s both" }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: "rgba(8,20,38,0.75)",
                            border: `1px solid ${inputFocused ? "rgba(0,212,184,0.55)" : "rgba(0,212,184,0.2)"}`,
                            borderRadius: 14,
                            padding: "6px 6px 6px 16px",
                            backdropFilter: "blur(14px)",
                            boxShadow: inputFocused
                                ? "0 0 0 3px rgba(0,212,184,0.1), 0 0 30px rgba(0,212,184,0.12)"
                                : "0 4px 30px rgba(0,0,0,0.3)",
                            transition: "border-color 0.25s, box-shadow 0.25s",
                            maxWidth: 600,
                            margin: "0 auto",
                        }}>
                            <Github size={17} color="rgba(0,210,185,0.65)" style={{ flexShrink: 0 }} />
                            <input
                                value={repoUrl}
                                onChange={e => setRepoUrl(e.target.value)}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                                placeholder="https://github.com/owner/repo"
                                style={{
                                    flex: 1,
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    fontSize: 13.5,
                                    fontFamily: "'Fira Code', monospace",
                                    color: "#cbd5e1",
                                    padding: "10px 4px",
                                    minWidth: 0,
                                }}
                            />
                            <Link to={`${user ? `workspace/dashboard` : `/signup?mode=login`}`} >
                                <button
                                    className="analyze-btn"

                                    style={{
                                        background: "linear-gradient(135deg,#00d4b8 0%,#00a89a 100%)",
                                        border: "none",
                                        borderRadius: 10,
                                        padding: "11px 22px",
                                        fontSize: 13.5,
                                        fontWeight: 700,
                                        color: "#020d1a",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 7,
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                        transition: "filter 0.2s, box-shadow 0.2s",
                                        animation: "pulseGlow 3s ease-in-out infinite",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Try it now
                                    <ArrowRight size={15} />
                                </button>
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div style={{
                            marginTop: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 20,
                            fontSize: 12,
                            color: "rgba(148,163,184,0.6)",
                        }}>
                            {["No signup required", "Results in seconds", "Built for developers"].map((t, i) => (
                                <span key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        background: "#00d4b8",
                                        boxShadow: "0 0 8px #00d4b8",
                                        animation: `dotBlink 1.4s ${i * 0.4}s ease-in-out infinite`,
                                        display: "inline-block",
                                    }} />
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
