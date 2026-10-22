import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

const Solution = () => {
  const capabilities = [
    {
      title: "Decision audit trails",
      description: "Every AI decision is recorded with full context, including prompts, outputs, tool calls, and decision metadata."
    },
    {
      title: "Replay and explainability",
      description: "Step through past AI interactions to understand exactly what happened and why."
    },
    {
      title: "Governance visibility",
      description: "Understand how AI systems are used across your organization, with centralized oversight."
    },
    {
      title: "Compliance readiness",
      description: "Generate audit-ready reports for regulators, auditors, and internal stakeholders."
    }
  ];

  const whatGetsRecorded = [
    { label: "Prompts", description: "The full input context sent to AI models" },
    { label: "Outputs", description: "Complete responses including reasoning chains" },
    { label: "Tool Calls", description: "Every action and API call made by agents" },
    { label: "Decision Metadata", description: "Timestamps, user context, and decision outcomes" }
  ];

  const notList = [
    "A logging tool — logs are fragments, not complete decision records",
    "An observability platform — dashboards don't create audit trails",
    "A prompt tracing tool — traces show execution, not governance context"
  ];

  return (
    <div className="page-container">
      <div className="section-container section-padding">
        <div className="max-w-3xl">
          <h1 className="section-title">A system of record for AI behavior</h1>
          
          <div className="section-body mb-12">
            <p>
              Ordinum sits between your application and your AI models, automatically recording prompts, outputs, tool calls, and decision context. These records are transformed into replayable timelines and audit-ready reports.
            </p>
            <p className="mt-4">
              Ordinum is designed as infrastructure, not a feature—making it difficult to retrofit into existing systems after the fact.
            </p>
          </div>

          {/* What Gets Recorded */}
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-6">What Ordinum captures</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {whatGetsRecorded.map((item, index) => (
                <div 
                  key={index}
                  className="border border-border rounded-lg p-4 bg-secondary/20"
                >
                  <p className="font-medium text-foreground mb-1">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Capabilities */}
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-6">Core capabilities</h2>
            <div className="space-y-6">
              {capabilities.map((feature, index) => (
                <div 
                  key={index}
                  className="border-l-2 border-border pl-6 py-2"
                >
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What Ordinum Is Not */}
          <div className="mb-16 p-6 border border-border rounded-lg bg-secondary/10">
            <h2 className="text-xl font-semibold mb-4">What Ordinum is not</h2>
            <div className="space-y-3">
              {notList.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-muted-foreground/50 mt-0.5">✕</span>
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-foreground/80">
              Ordinum is purpose-built infrastructure for AI governance—a true system of record that existing tools cannot provide.
            </p>
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <p className="text-muted-foreground mb-4">See how integration works.</p>
            <Button asChild variant="outline">
              <Link to="/how-it-works">
                How It Works
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border bg-secondary/30">
        <div className="section-container py-16">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold mb-4">Request early access</h2>
            <WaitlistForm compact />
            <p className="text-sm text-muted-foreground/60 mt-4">We'll reach out personally.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solution;
