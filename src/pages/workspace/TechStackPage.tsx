import { Box } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { TechStack } from "@/components/workspace/TechStack";

export function TechStackPage() {
  const { analysisResult } = useOutletContext<any>();

  return (
    <div className="h-full flex flex-col">
      <TechStack result={analysisResult} />
    </div>
  );
}
