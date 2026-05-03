import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "./Index";
import { Rocket, Zap, Users, Check, Hexagon } from "lucide-react";

const plans = [
  {
    name: "FREE",
    price: "0",
    period: "Forever",
    icon: Rocket,
    features: [
      "3 Public Repos / month",
      "Explain up to 5 files",
      "Basic Code Explanations",
      "Community Support",
    ],
    buttonClass: "border border-primary text-primary bg-transparent hover:bg-primary/10",
  },
  {
    name: "PRO",
    price: "9",
    period: "/month",
    billed: "Billed monthly",
    icon: Zap,
    popular: true,
    features: [
      "Unlimited Public Repos",
      "Explain up to 50 files",
      "Advanced Explanations",
      "Diagrams & Visuals",
      "Priority Support",
    ],
    buttonClass: "bg-primary text-primary-foreground hover:brightness-110",
  },
  {
    name: "TEAM",
    price: "29",
    period: "/month",
    billed: "Billed monthly",
    icon: Users,
    features: [
      "Everything in Pro",
      "Unlimited Private Repos",
      "Explain up to 500 files",
      "Team Workspaces",
      "Priority Support",
    ],
    buttonClass: "border border-primary text-primary bg-transparent hover:bg-primary/10",
  },
];

export function Pricing() {
  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar showLogo />
      
      <div className="flex-1 container py-24 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Powerful plans for <span className="text-primary">every developer</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explain more. Understand better. Ship faster.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col items-center rounded-3xl p-8 bg-[#0a111a]/80 backdrop-blur-sm border ${
                plan.popular 
                  ? "border-primary shadow-[0_0_30px_hsl(var(--primary)/0.15)] md:-translate-y-2 z-10" 
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 rounded-tr-3xl">
                  <div className="absolute top-6 -right-7 bg-primary text-primary-foreground text-[10px] font-bold py-1.5 px-10 transform rotate-45 text-center shadow-lg uppercase tracking-wider">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="relative flex items-center justify-center w-20 h-20 mb-6 text-primary">
                <Hexagon className={`absolute inset-0 w-20 h-20 ${plan.popular ? 'fill-primary/10 stroke-primary stroke-[1.5]' : 'stroke-primary stroke-[1.5]'}`} />
                <plan.icon className={`relative z-10 w-8 h-8 ${plan.popular ? 'fill-primary' : ''}`} />
              </div>

              {/* Title & Price */}
              <h3 className="text-lg font-bold text-primary tracking-wide mb-4 uppercase">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-5xl font-extrabold text-foreground">${plan.price}</span>
                {plan.period !== "Forever" && (
                  <span className="text-muted-foreground text-sm font-medium">{plan.period}</span>
                )}
              </div>
              <div className="h-6 mb-8 text-sm text-muted-foreground/80 font-medium">
                {plan.billed || plan.period}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border/40 mb-8" />

              {/* Features */}
              <ul className="w-full space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[15px] text-muted-foreground/90">
                    <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                title="Coming soon!"
                className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 cursor-not-allowed opacity-90 ${plan.buttonClass}`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
