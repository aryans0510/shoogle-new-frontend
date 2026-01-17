import api from "@/api";
import { z } from "zod";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, ShoppingCart, Phone, Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema, loginSchema } from "@/types/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "shopping" | "selling";
  onSuccess: () => void;
  initialAuthMode?: "login" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSuccess, initialAuthMode = "signup" }) => {
  const navigate = useNavigate();
  const { setUser, user } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup">(initialAuthMode);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  // Reset auth mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialAuthMode);
    }
  }, [isOpen, initialAuthMode]);

  // Cleanup truecaller's intervals
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        isPollingRef.current = false;
      }
    };
  }, []);

  // handle form change
  const currentSchema = authMode === "signup" ? signupSchema : loginSchema;
  let form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  useEffect(() => {
    form.setValue("name", "", { shouldValidate: authMode === "signup" }); // Update mode → triggers refine
    form.reset();
  }, [authMode, form]);

  const handleSignup = async (data: { name: string; email: string; password: string }) => {
    const { name, email, password } = data;
    try {
      await api.post("/auth/signup", { name, email, password });
      toast.success("Account Created", { description: "Please Login to continue" });
      setAuthMode("login");
    } catch (error) {
      // console.log("Error", error.response.data || error);
      if (error.response.data.statusCode === 400) {
        toast.error(error.response.data.message, {
          description: "Make sure to use correct login method and password",
        });
        setAuthMode("login");
        return;
      }
      toast.error(error.response.data.message || "Internal Server Error");
    }
  };

  const handleLogin = async (data: { name: string; email: string; password: string }) => {
    const { email, password } = data;
    try {
      const res = await api.post("/auth/login", { email, password, mode });
      toast.success("Welcome to Shoogle!", {
        description: `Successfully logged in. Let's start ${mode}!`,
      });
      setUser(res.data.data);
      onSuccess();
    } catch (error) {
      // console.log("Error", error.response.data || error);
      toast.error(error.response.data.message);
    }
  };

  const handleGoogleAuth = async () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google?type=${mode}`;
  };

  const isIOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) return true;

    return (
      navigator.platform === "MacIntel" &&
      typeof navigator.maxTouchPoints === "number" &&
      navigator.maxTouchPoints > 1
    );
  };

  const handleTruecallerAuth = async () => {
    // De-bounce
    if (isPollingRef.current) {
      toast.warning("Authentication in progress. Please Wait.");
      return;
    }

    const uuid = uuidv4();
    const sessionId = `${mode}-${uuid}`;

    const truecallerUrl = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${sessionId}&partnerKey=zQNin3abedc67151f4e999ef3d1fc3fbec153&partnerName=shoogle_dev&lang=en&privacyUrl=https%3A%2F%2Fshoogle.in%2Fprivacy&termsUrl=https%3A%2F%2Fshoogle.in%2Fterms&loginPrefix=continue&loginSuffix=login&ctaPrefix=continuewith&ctaColor=%233780F6&ctaTextColor=%23ffffff&btnShape=round&skipOption=useanothernum&ttl=120000`;
    // const truecallerUrl = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${sessionId}&partnerKey=6BPzvb311008eb0a8407caa0bf2a2fb8f68a6&partnerName=Shoogle&lang=en&privacyUrl=https%3A%2F%2Fshoogle.in%2Fprivacy&termsUrl=https%3A%2F%2Fshoogle.in%2Fterms&loginPrefix=continue&loginSuffix=login&ctaPrefix=continuewith&ctaColor=%233780F6&ctaTextColor=%23ffffff&btnShape=round&skipOption=useanothernum&ttl=120000`;
    window.open(truecallerUrl, "_blank", "noopener,noreferrer");

    isPollingRef.current = true;
    let count: number = 0;
    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(`/auth/truecaller/status?sessionId=${sessionId}&type=${mode}`);
        if (data.message === "exit_flow") {
          clearInterval(intervalRef.current);
          isPollingRef.current = false;
        }
        if (data.success) {
          clearInterval(intervalRef.current);
          isPollingRef.current = false;
          setUser(data.data);
          toast.success("Login success");
          navigate("/discover");
        }
      } catch (error) {
        // console.log("Error occured", error.response.data || error);
        toast.error("Some Error Occured");
        if (count > 2) {
          clearInterval(intervalRef.current);
          isPollingRef.current = false;
          return;
        }
        count++;
      }
    }, 3000);
  };

  const handleSkipLogin = () => {
    if (mode !== "shopping") return;

    toast.success("Guest Mode", {
      description: "You're browsing as a guest with limited access",
    });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-center text-2xl font-bold">
            {mode === "shopping" ? (
              <>
                <ShoppingCart className="text-primary" />
                <p>Let's get you shopping</p>
              </>
            ) : (
              <>
                <Store className="text-primary" />
                <p>Ready to start selling?</p>
              </>
            )}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            {mode === "selling"
              ? "It only takes 30 seconds to get started!"
              : "Sign in to unlock the full Shoogle experience"}
          </p>
        </DialogHeader>

        <div className="flex rounded-lg bg-muted p-1">
          <Button
            variant={authMode === "signup" ? "default" : "ghost"}
            onClick={() => setAuthMode("signup")}
            className="flex-1 rounded-tr-none rounded-br-none"
            size="sm"
          >
            Sign Up
          </Button>
          <Button
            variant={authMode === "login" ? "default" : "ghost"}
            onClick={() => setAuthMode("login")}
            className="flex-1 rounded-tl-none rounded-bl-none"
            size="sm"
          >
            Login
          </Button>
        </div>

        <Form {...form}>
          <form className="space-y-3">
            {authMode === "signup" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jhon Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="jhon@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Minimum 5 characters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              onClick={
                authMode === "signup"
                  ? form.handleSubmit(handleSignup)
                  : form.handleSubmit(handleLogin)
              }
              className="h-12 w-full cursor-pointer text-base"
            >
              <Mail className="mr-3 h-5 w-5" />
              {loading ? "Please wait..." : authMode === "signup" ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>
        <Button
          onClick={handleGoogleAuth}
          variant="outline"
          className="w-full cursor-pointer text-base"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mr-3"
          >
            <path d="M10.88 21.94 15.46 14" />
            <path d="M21.17 8H12" />
            <path d="M3.95 6.06 8.54 14" />
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          Continue with Google
        </Button>
        <Button
          onClick={handleTruecallerAuth}
          variant="outline"
          className={`w-full cursor-pointer text-base ${isIOS() ? "hidden" : "flex"}`}
          disabled={isPollingRef.current}
        >
          <Phone className="mr-3" />
          Continue with Truecaller
        </Button>
        {mode === "shopping" && (
          <Button
            onClick={handleSkipLogin}
            variant="link"
            className="w-full cursor-pointer text-muted-foreground"
            disabled={loading}
          >
            Skip for now (limited access)
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
