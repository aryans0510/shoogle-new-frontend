import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { generateJoinCode } from "./utils";

export function CreateCommunityForm({
  onCreate,
  proStatus,
  joinRestricted,
  creating,
}: {
  onCreate: (name: string, desc: string, code: string, reset: () => void) => Promise<void>;
  proStatus: boolean | null;
  joinRestricted: boolean;
  creating: boolean;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCreate(name, desc, generateJoinCode(), () => {
      setName("");
      setDesc("");
    });
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create a New Community</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Community name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={creating || joinRestricted}
          />
          <Input
            type="text"
            placeholder="Description (optional)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            disabled={creating || joinRestricted}
          />
          <Button type="submit" disabled={creating || joinRestricted}>
            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Community
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
