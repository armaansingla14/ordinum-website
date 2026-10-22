import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface WaitlistFormProps {
  compact?: boolean;
}

const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  company: z
    .string()
    .trim()
    .max(255, "Company name must be less than 255 characters")
    .optional()
    .nullable()
    .transform((val) => val || null),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

const WaitlistForm = ({ compact = false }: WaitlistFormProps) => {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);

    // Validate inputs with zod
    const validationResult = waitlistSchema.safeParse({
      email: email,
      company: company,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: firstError.message,
      });
      setIsLoading(false);
      return;
    }

    const validatedData: WaitlistFormData = validationResult.data;

    const { error } = await supabase
      .from("waitlist")
      .insert({ 
        email: validatedData.email, 
        company: validatedData.company 
      });

    if (error) {
      // Handle duplicate email without exposing database internals
      const isDuplicate = error.message?.toLowerCase().includes("duplicate") || 
                          error.message?.toLowerCase().includes("already exists");
      
      if (isDuplicate) {
        toast({
          title: "Already registered",
          description: "This email is already on our waitlist.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later.",
        });
      }
      setIsLoading(false);
      return;
    }

    setSubmitted(true);
    setIsLoading(false);
  };

  if (submitted) {
    return (
      <div className={`text-center ${compact ? 'py-4' : 'py-8'}`}>
        <p className="text-foreground font-medium">Thanks for your interest.</p>
        <p className="text-muted-foreground mt-1">We'll reach out personally within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${compact ? 'space-y-3' : 'space-y-4'}`}>
      <div>
        <Input
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={255}
          className="h-12 bg-background border-border focus:border-foreground"
        />
      </div>
      {!compact && (
        <div>
          <Input
            type="text"
            placeholder="Company name (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            maxLength={255}
            className="h-12 bg-background border-border focus:border-foreground"
          />
        </div>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12"
        variant="default"
      >
        {isLoading ? "Submitting..." : "Request early access"}
        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
};

export default WaitlistForm;
