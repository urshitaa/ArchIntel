import { Layers } from "lucide-react";
import { Panel } from "@/components/workspace/Shared";
import { ArchitectureView } from "@/components/workspace/ArchitectureView";
import { useOutletContext } from "react-router-dom";

export function ArchitecturePage() {
  const { analysisResult } = useOutletContext<any>();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 h-full">
      <Panel title="Architecture" icon={Layers} className="lg:col-span-12 h-full" delay={0.1}>
        <ArchitectureView files={analysisResult?.files} />
      </Panel>
    </div>
  );
}
