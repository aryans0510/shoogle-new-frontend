import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function JoinCommunityForm({
  onJoin,
  proStatus,
  joinRestricted,
  joining,
}: {
  onJoin: (code: string, reset: () => void) => Promise<void>;
  proStatus: boolean | null;
  joinRestricted: boolean;
  joining: boolean;
}) {
  const [joinCode, setJoinCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onJoin(joinCode, () => setJoinCode(""));
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Join a Community</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Enter join code"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            required
            disabled={joining || joinRestricted}
          />
          <Button type="submit" disabled={joining || joinRestricted}>
            {joining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Join Community
          </Button>
          {joinRestricted && (
            <div className="mt-2 text-xs text-destructive">
              {proStatus === false
                ? "Upgrade to Pro to create or join communities."
                : "Pro sellers can join up to 3 communities only."}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
