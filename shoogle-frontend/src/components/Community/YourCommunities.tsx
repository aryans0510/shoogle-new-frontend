import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string | null;
  join_code: string;
}

export function YourCommunities({
  memberships,
  fetchLoading,
}: {
  memberships: Community[];
  fetchLoading: boolean;
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Your Communities</CardTitle>
      </CardHeader>
      <CardContent>
        {fetchLoading ? (
          <div className="flex justify-center py-4 text-center">
            <Loader2 className="mr-2 inline animate-spin" /> Loading...
          </div>
        ) : memberships.length === 0 ? (
          <div className="py-4 text-muted-foreground">You haven't joined any communities yet.</div>
        ) : (
          <div>
            <div className="mb-3 text-xs text-muted-foreground">
              Joined: {memberships.length} / 3 communities
            </div>
            <div className="flex flex-col gap-3">
              {memberships.map(c => (
                <div key={c.id} className="border-b pb-2 last:border-none">
                  <div className="font-semibold">{c.name}</div>
                  {c.description && (
                    <div className="text-sm text-muted-foreground">{c.description}</div>
                  )}
                  <div>
                    <span className="select-all text-xs text-muted-foreground">
                      Join code: <span className="font-mono">{c.join_code}</span>
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-semibold text-primary">
                      Referral quota: <b>3 per period</b>. Progress: (coming soon)
                    </span>
                  </div>
                </div>
              ))}
              {memberships.length >= 3 && (
                <div className="bg-warning text-warning-foreground mt-2 rounded border px-3 py-2 text-xs">
                  Maximum community limit reached. Leave a community to join another.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
