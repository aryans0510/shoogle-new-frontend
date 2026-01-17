import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// TODO: Create backend API for business_customers and migrate this component
// import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface Customer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

const PromotionsSection: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all business customers
  const { data: customers, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["business-customers", user?.id],
    queryFn: async () => {
      // TODO: Create backend API for business_customers
      return [] as Customer[];
    },
    enabled: false, // Disabled until backend API is ready
  });

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    setIsLoading(true);

    const response = await fetch(`${window.location.origin}/functions/v1/send-promotion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: user.id,
        message,
        send_via: ["notification"], // Only send via notification now
      }),
    });
    if (!response.ok) {
      toast.error("Failed to send promotion", {
        description: "Server error",
      });
      setIsLoading(false);
      return;
    }
    toast.success("Promotion sent!", {
      description: "Your customers will receive it soon.",
    });
    setMessage("");
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Promotion to Your Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write your promotional message here..."
            disabled={isLoading}
          />
          <Button
            disabled={!message.trim() || isLoading || isCustomersLoading}
            onClick={handleSend}
          >
            {isLoading ? "Sending..." : "Send Promotion"}
          </Button>
          <p className="text-xs text-muted-foreground">
            {customers?.length
              ? `You have ${customers.length} customer${customers.length === 1 ? "" : "s"} in your list.`
              : "No customers in your list yet."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionsSection;
