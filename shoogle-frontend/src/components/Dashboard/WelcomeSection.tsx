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
      {/* Enhanced Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold text-gray-800">
              Welcome back, {firstName}!
              <Hand className="h-8 w-8 text-blue-600" />
            </h1>
            <p className="text-gray-600 text-lg">Ready to grow your business? Let's get started!</p>
            
            {/* Quick Stats */}
            {user.isOnboarded && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Active Seller</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
                  <span className="text-blue-600 font-semibold">📊</span>
                  <span className="text-gray-600">Dashboard Ready</span>
                </div>
              </div>
            )}
          </div>
          
          {user.isOnboarded && (
            <div className="text-right">
              <div className="text-2xl mb-1">🎉</div>
              <p className="text-xs text-gray-500">You're all set!</p>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Section */}
      {!user.isOnboarded && (
        <Dialog defaultOpen={false}>
          <div className="space-y-4 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🚀</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Complete Your Seller Setup</h2>
                <p className="text-gray-600 mb-4">Just 2 quick details and you'll be ready to start selling!</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>Account created</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-orange-500">⏳</span>
                    <span>Business details needed</span>
                  </div>
                </div>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Complete Setup (2 min) <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </div>
            </div>
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
