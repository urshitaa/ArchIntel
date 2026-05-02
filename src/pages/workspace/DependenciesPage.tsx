import { Network } from "lucide-react";
import { Panel } from "@/components/workspace/Shared";
import { RepositoryGraph } from "@/components/workspace/RepositoryGraph";
import { useOutletContext } from "react-router-dom";

export function DependenciesPage() {
  const { analysisResult } = useOutletContext<any>();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 h-full min-h-[800px]">
      <Panel title="Architecture Graph" icon={Network} className="lg:col-span-12 h-full" delay={0.1}>
        <div className="h-[700px] w-full">
          <RepositoryGraph data={analysisResult?.files} />
        </div>
      </Panel>
    </div>
  );
}
