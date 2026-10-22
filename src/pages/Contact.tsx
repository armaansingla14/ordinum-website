import WaitlistForm from "@/components/WaitlistForm";

const Contact = () => {
  return (
    <div className="page-container">
      <div className="section-container section-padding">
        <div className="max-w-xl">
          <h1 className="section-title">Contact</h1>
          
          <p className="section-body mb-8">
            Have questions or want to talk? Reach out to us.
          </p>

          <div className="mb-12">
            <a 
              href="mailto:armaan@ordinum.org" 
              className="text-lg font-medium text-foreground hover:underline underline-offset-4"
            >
              armaan@ordinum.org
            </a>
          </div>

          <div className="border-t border-border pt-12">
            <h2 className="text-xl font-semibold mb-2">Request early access</h2>
            <p className="text-muted-foreground mb-6">
              We are working closely with early design partners. Join the waitlist to get early access and help shape the product.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
