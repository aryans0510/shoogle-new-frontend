import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
// TODO: Create backend APIs for communities and migrate this page
// import api from "@/api";
import { Users } from "lucide-react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { YourCommunities } from "@/components/Community/YourCommunities";
import { CreateCommunityForm } from "@/components/Community/CreateCommunityForm";
import { JoinCommunityForm } from "@/components/Community/JoinCommunityForm";
import { ExploreCommunities } from "@/components/Community/ExploreCommunities";
import { generateJoinCode } from "@/components/Community/utils";

interface Community {
  id: string;
  name: string;
  description: string | null;
  join_code: string;
  created_by: string;
  created_at: string;
}

export default function Community() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [myCommunityMemberships, setMyCommunityMemberships] = useState<Community[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [proStatus, setProStatus] = useState<boolean | null>(null);

  // Fetch Pro status on mount
  useEffect(() => {
    if (!user) {
      setProStatus(null);
      return;
    }
    // TODO: Migrate to backend API when seller profile endpoint returns pro_status
    // For now, set to false
    setProStatus(false);
  }, [user]);

  // Fetch ALL communities (for suggestion, browsing)
  useEffect(() => {
    // TODO: Create backend API for communities
    setLoadingCommunities(false);
    setCommunities([]);
  }, []);

  // Fetch my memberships (the communities this user is a member of)
  function fetchMyMemberships() {
    if (!user) return;
    // TODO: Create backend API for community memberships
    setFetchLoading(false);
    setMyCommunityMemberships([]);
  }

  useEffect(() => {
    fetchMyMemberships();
    // eslint-disable-next-line
  }, [user]);

  // CREATE a new community
  async function handleCreateCommunity(
    name: string,
    desc: string,
    code: string,
    reset: () => void,
  ) {
    // TODO: Create backend API for communities
    toast.error("Feature coming soon", {
      description: "Community features will be available after backend migration.",
    });
    setCreating(false);
  }

  // JOIN a community via join code
  async function handleJoinCommunity(code: string, reset: () => void) {
    // TODO: Create backend API for community memberships
    toast.error("Feature coming soon", {
      description: "Community features will be available after backend migration.",
    });
    setJoining(false);
  }

  // Restriction on join: only Pro users & up to 3 communities
  const joinRestricted =
    proStatus === false || (myCommunityMemberships.length >= 3 && proStatus === true);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-shopgpt-50/30 to-magic-50/20 px-4 py-8 pb-28">
      <div className="mx-auto max-w-2xl">
        <Card className="mb-6">
          <CardHeader className="flex flex-col items-center">
            <Users className="mb-2 h-10 w-10 text-primary" />
            <CardTitle className="mb-2 text-2xl font-bold">Seller Communities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-muted-foreground">
              Join or create a community of sellers to collaborate, refer customers, and grow
              together!
              <br />
              <span className="mt-2 block font-medium text-primary">
                <span>
                  Only <span className="underline">Pro sellers</span> can join communities.
                  <br /> Each Pro seller can join up to <b>3</b> communities and must refer 3
                  clients per community per period.
                </span>
              </span>
            </p>
            {proStatus === false && (
              <div className="mt-2 rounded border border-destructive bg-destructive/10 px-4 py-2 text-destructive">
                Only Pro sellers can join or interact with communities. <br />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate("/dashboard/subscriptions")}
                >
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Communities List */}
        <YourCommunities memberships={myCommunityMemberships} fetchLoading={fetchLoading} />

        {/* Create Community */}
        <CreateCommunityForm
          onCreate={handleCreateCommunity}
          proStatus={proStatus}
          joinRestricted={joinRestricted}
          creating={creating}
        />

        {/* Join Community */}
        <JoinCommunityForm
          onJoin={handleJoinCommunity}
          proStatus={proStatus}
          joinRestricted={joinRestricted}
          joining={joining}
        />

        {/* Explore Communities */}
        <ExploreCommunities loading={loadingCommunities} communities={communities} />

        <Button variant="secondary" className="mt-8 w-full" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
