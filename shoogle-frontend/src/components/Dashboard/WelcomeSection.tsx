import z from "zod";
import api from "@/api";
import { useEffect } from "react";
import { ArrowRight, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/types/schema";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { getFirstName } from "@/utils";

const WelcomeSection = () => {
  const navigate = useNavigate();
  const firstName = getFirstName();
  const { user, setUserLoading } = useAuth();
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { business_name: "", whatsapp_number: "" },
  });

  useEffect(() => {
    const getSellerProfile = async () => {
      try {
        setUserLoading(true);
        const res = await api.get("/user/seller-profile");
        if (!res.data.data) user.isOnboarded = false;
        else user.isOnboarded = true;
      } catch (error) {
        console.log("error getting seller profile", error.response.data);
        if (error.response.data.statusCode === 401) {
          toast.error("Please Login as Seller");
          navigate("/");
        }
      } finally {
        setUserLoading(false);
      }
    };

    getSellerProfile();
  }, []);

  const submit = async (data: { business_name: string; whatsapp_number: string }) => {
    try {
      const res = await api.post("/user/create-seller-profile", data);
      user.isOnboarded = true;
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="mt-6 mb-8">
      <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
        Welcome back, {firstName}!
        <Hand className="h-7 w-7 text-blue-600" />
      </h1>
      <p className="text-muted-foreground">Ready to grow your business? Let's get started!</p>
      {!user.isOnboarded && (
        <Dialog defaultOpen={false}>
          <div className="mt-4 space-y-3 rounded-xl border border-black bg-primary/20 p-6">
            <h1>Please Complete Seller On-boarding to start and create listings!</h1>
            <DialogTrigger asChild>
              <Button>
                Complete On-boarding <ArrowRight />
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle hidden></DialogTitle>
            <DialogHeader className="mx-auto font-semibold">
              Fill following details to get started as a seller
            </DialogHeader>
            <Form {...form}>
              <form className="space-y-3">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business name</FormLabel>
                      <FormControl>
                        <Input placeholder="MBA Chaiwala" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Whatsapp Number</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="9999966666" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="h-12 w-full cursor-pointer text-base"
                  onClick={form.handleSubmit(submit)}
                >
                  Complete
                  <ArrowRight className="mr-3 h-5 w-5" />
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
export default WelcomeSection;
