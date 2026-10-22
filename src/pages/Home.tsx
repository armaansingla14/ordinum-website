import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Play, Shield } from "lucide-react";
import ordinumLogo from "@/assets/ordinum-logo-new.jpg";

const Home = () => {
  const steps = [
    {
      icon: Database,
      title: "AI runs inside your app",
      description: "Agents, copilots, and AI features operate as normal"
    },
    {
      icon: Play,
      title: "Ordinum records every decision",
      description: "Prompts, outputs, tool calls, and context captured in real time"
    },
    {
      icon: Shield,
      title: "Teams replay, audit, and govern",
      description: "Debug incidents, prove compliance, and build trust"
    }
  ];

  const benefits = [
    "Faster incident resolution with complete decision replay",
    "Audit-ready documentation for regulators and stakeholders",
    "Full visibility into AI behavior across your organization",
    "Infrastructure-level integration that scales with your systems"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        {/* Subtle background logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img 
            src={ordinumLogo} 
            alt="" 
            className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] object-contain opacity-[0.06]"
          />
        </div>
        
        <div className="section-container relative z-10 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
              The system of record for AI decisions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium mb-2 leading-relaxed">
              Audit, explain, and control every AI decision in production.
            </p>
            <p className="text-base text-muted-foreground/70 mb-6">
              Resolve AI incidents in minutes instead of days.
            </p>
            <p className="text-base md:text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Ordinum captures prompts, outputs, and context from AI agents and copilots, transforming them into replayable timelines and audit-ready reports.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button asChild size="lg" className="min-w-[220px]">
                <Link to="/contact">
                  Request early access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/how-it-works">See how it works</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground/60">
              Built for teams deploying AI agents and internal copilots in production.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Step Visual Flow */}
      <section className="border-t border-border bg-secondary/30">
        <div className="section-container py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">How Ordinum works</h2>
            <p className="text-muted-foreground">AI governance in three steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-14 h-14 rounded-full border border-border bg-background flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-foreground" />
                </div>
                <div className="absolute top-7 left-[calc(50%+2rem)] right-0 h-px bg-border hidden md:block last:hidden" 
                     style={{ display: index === 2 ? 'none' : undefined }} />
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Teams Use Ordinum */}
      <section className="border-t border-border">
        <div className="section-container py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8">Why teams use Ordinum</h2>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                  <p className="text-lg text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="border-t border-border bg-secondary/30">
        <div className="section-container py-16">
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <p className="text-sm font-medium text-foreground mb-1">Production Ready</p>
                <p className="text-sm text-muted-foreground">Built for teams deploying AI at scale</p>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-foreground mb-1">Enterprise Security</p>
                <p className="text-sm text-muted-foreground">Designed with compliance in mind</p>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-foreground mb-1">Audit Trail Architecture</p>
                <p className="text-sm text-muted-foreground">Inspired by financial system standards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border">
        <div className="section-container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to bring order to AI decisions?</h2>
            <p className="text-muted-foreground mb-8">Join the teams building the future of AI governance.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[220px]">
                <Link to="/contact">
                  Request early access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="mailto:armaan@ordinum.org">Get in touch</a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground/60 mt-6">We'll reach out personally.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
