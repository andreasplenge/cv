import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import GeometricBackground from "@/components/GeometricBackground";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate input
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Signed in successfully");
        navigate("/edit");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <GeometricBackground />

      <div className="relative w-full max-w-sm">
        <p className="font-mono text-xs text-muted-foreground tracking-widest mb-2">
          // AUTHENTICATE
        </p>
        <h1 className="text-3xl font-light tracking-tight mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-muted-foreground mb-2 block">
              EMAIL
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="font-mono bg-background border-border"
              required
            />
          </div>
          <div>
            <label className="font-mono text-xs text-muted-foreground mb-2 block">
              PASSWORD
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="font-mono bg-background border-border"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full font-mono"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <a
            href="/"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to CV
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
