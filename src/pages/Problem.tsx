import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

const Problem = () => {
  const scaleIssues = [
    "Logs capture fragments, not complete decision context",
    "Prompts alone don't explain what data was accessed or why",
    "There's no single source of truth when incidents occur",
    "Reconstructing AI behavior after the fact is manual and incomplete"
  ];

  return (
    <div className="page-container">
      <div className="section-container section-padding">
        <div className="max-w-3xl">
          <h1 className="section-title">AI is moving faster than governance</h1>
          
          <div className="space-y-6 section-body">
            <p>
              Companies are deploying AI agents and internal copilots at unprecedented speed. These systems make decisions with real consequences—approving transactions, generating customer responses, influencing business strategy.
            </p>
            <p>
              Yet most teams cannot explain why an AI made a specific decision, what data it used, or how to reproduce its behavior.
            </p>

            {/* Concrete Example */}
            <div className="border-l-2 border-border pl-6 py-4 my-8">
              <p className="text-foreground font-medium mb-2">A real scenario:</p>
              <p className="text-muted-foreground">
                An AI agent approves a high-value transaction that triggers a compliance review. The team needs to explain the decision to auditors, but the only evidence is scattered across application logs, model API calls, and incomplete prompt traces. There's no clear record of what context the AI had, what tools it called, or why it made the decision it did.
              </p>
            </div>

            <p>
              This creates serious risk for security, compliance, and trust. Regulators are asking questions. Customers expect accountability. Internal teams need visibility.
            </p>
            <p>
              Today, there is no system of record for AI behavior. As AI adoption accelerates, this gap becomes untenable.
            </p>
          </div>

          {/* Why This Breaks at Scale */}
          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-6">Why this breaks at scale</h2>
            <div className="space-y-3">
              {scaleIssues.map((issue, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{issue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <p className="text-foreground font-medium mb-2">There's a better way.</p>
            <p className="text-muted-foreground mb-6">See how Ordinum creates a single source of truth for every AI decision.</p>
            <Button asChild>
              <Link to="/solution">
                Our Solution
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

export default Problem;
