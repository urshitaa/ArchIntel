import { Users } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { Panel } from "@/components/workspace/Shared";
import { Contributors } from "@/components/workspace/Contributors";

export function ContributorsPage() {
  const { analysisResult } = useOutletContext<any>();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Panel title="Contributors" icon={Users} className="lg:col-span-12" delay={0.1}>
        <Contributors result={analysisResult} />
      </Panel>
    </div>
  );
}
