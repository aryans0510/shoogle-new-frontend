import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string | null;
  join_code: string;
}

export function ExploreCommunities({
  loading,
  communities,
}: {
  loading: boolean;
  communities: Community[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Explore Communities</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4 text-center">
            <Loader2 className="mr-2 inline animate-spin" /> Loading...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {communities.length === 0 && (
              <div className="py-2 text-muted-foreground">No communities yet.</div>
            )}
            {communities.slice(0, 8).map(c => (
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
