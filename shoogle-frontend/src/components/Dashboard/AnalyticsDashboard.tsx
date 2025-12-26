import { BarChart3 } from "lucide-react";

const AnalyticsDashboard = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-8 animate-in fade-in">
      <button
        onClick={onBack}
        className="mb-8 rounded-md border bg-background px-4 py-2 text-base font-medium shadow-sm hover:bg-accent"
      >
        ← Back to Dashboard
      </button>
      <div className="flex flex-col items-center gap-3">
        <BarChart3 className="h-12 w-12 text-[#2596ff]" />
        <h2 className="mb-1 text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="mb-2 text-lg text-muted-foreground">Analytics coming soon!</p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
