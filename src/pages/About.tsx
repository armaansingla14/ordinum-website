import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

const About = () => {
  const audiences = [
    { title: "Engineering teams", description: "Shipping AI products to production" },
    { title: "AI-first founders", description: "Building companies on intelligent systems" },
    { title: "Security & compliance", description: "Managing risk and regulatory requirements" },
    { title: "Enterprise teams", description: "Deploying internal copilots and agents" }
  ];

  return (
    <div className="page-container">
      <div className="section-container section-padding">
        <div className="max-w-3xl">
          <h1 className="section-title">About Ordinum</h1>
          
          <div className="section-body space-y-6">
            <p>
              Ordinum exists to bring order, accountability, and trust to AI systems.
            </p>
            
            {/* Why We Built Ordinum */}
            <div className="border-l-2 border-foreground/20 pl-6 py-4 my-8">
              <h2 className="text-lg font-medium text-foreground mb-3">Why we built Ordinum</h2>
              <p className="text-muted-foreground">
                We saw teams deploying AI systems without any way to explain, reproduce, or govern their behavior. When something went wrong, there was no record to investigate. When auditors asked questions, there were no answers. We built Ordinum because we believe AI systems should be as auditable and accountable as the organizations that deploy them.
              </p>
            </div>

            <p>
              As AI becomes more powerful and more widely deployed, organizations need a reliable way to understand, audit, and govern AI behavior. Without this visibility, AI systems remain opaque—creating risk across security, compliance, and trust.
            </p>
            <p>
              Ordinum is building the foundational infrastructure that makes AI safe to deploy at scale. We believe enterprise AI adoption depends on governance infrastructure that does not exist today.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-6">Built for teams deploying AI</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {audiences.map((audience, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 border border-border rounded-lg bg-secondary/20"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{audience.title}</p>
                    <p className="text-sm text-muted-foreground">{audience.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <p className="text-muted-foreground mb-4">Ready to get started?</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link to="/contact">
                  Request early access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:armaan@ordinum.org">Get in touch</a>
              </Button>
            </div>
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

export default About;
