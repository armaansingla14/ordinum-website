import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Integrate the Ordinum SDK or API",
      description: "Connect Ordinum to your AI infrastructure—agent frameworks, internal copilots, or custom model pipelines. Integration is designed to fit naturally into existing workflows with minimal performance overhead."
    },
    {
      number: "02",
      title: "AI agents and copilots run as normal",
      description: "Your AI systems continue operating without changes to their core behavior. Ordinum works in the background, invisible to end users."
    },
    {
      number: "03",
      title: "Full decision context captured in real time",
      description: "Ordinum automatically records prompts, outputs, tool calls, and decision metadata as your AI systems operate."
    },
    {
      number: "04",
      title: "Data transformed into actionable records",
      description: "Raw captures are structured into replayable timelines and audit-ready reports that teams can use immediately."
    },
    {
      number: "05",
      title: "Teams debug, govern, and comply",
      description: "Use Ordinum for incident investigation, compliance reporting, governance oversight, and building trust with stakeholders."
    }
  ];

  const useCases = [
    { title: "Incident Debugging", description: "Replay exact AI decisions to understand what went wrong" },
    { title: "Compliance Reporting", description: "Generate audit-ready documentation on demand" },
    { title: "Governance Oversight", description: "Monitor AI behavior across your organization" },
    { title: "Stakeholder Trust", description: "Demonstrate accountability to customers and partners" }
  ];

  return (
    <div className="page-container">
      <div className="section-container section-padding">
        <div className="max-w-3xl">
          <h1 className="section-title">How Ordinum works</h1>
          <p className="section-body mb-12">
            From integration to audit-ready reports in five steps.
          </p>
          
          {/* Step by Step Flow */}
          <div className="space-y-8 mb-16">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full border-2 border-foreground/20 flex items-center justify-center bg-background">
                    <span className="text-sm font-semibold text-foreground">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-8 bg-border mx-auto mt-2" />
                  )}
                </div>
                <div className="pt-2 pb-4">
                  <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Use Cases Grid */}
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-6">What teams use Ordinum for</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {useCases.map((useCase, index) => (
                <div 
                  key={index}
                  className="border border-border rounded-lg p-4 bg-secondary/20"
                >
                  <p className="font-medium text-foreground mb-1">{useCase.title}</p>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <p className="text-muted-foreground mb-4">Learn about the team behind Ordinum.</p>
            <Button asChild variant="outline">
              <Link to="/about">
                About Us
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

export default HowItWorks;
