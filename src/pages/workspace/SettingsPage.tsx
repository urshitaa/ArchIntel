import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { LayoutGrid, Code, GitBranch, FileText, Share2, X, CheckCircle2, FileDown, RectangleVertical, RectangleHorizontal } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { PrintReport } from "@/components/workspace/PrintReport";

const exportToggles = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "tech_stack", label: "Tech Stack", icon: Code },
  { id: "tree_structure", label: "Tree Structure", icon: GitBranch },
  { id: "summaries", label: "Summaries", icon: FileText },
  { id: "graph", label: "Graph", icon: Share2 },
];

export function SettingsPage() {
  const { analysisResult } = useOutletContext<any>();
  const [enabled, setEnabled] = useState<Set<string>>(new Set(["overview", "tech_stack", "tree_structure", "summaries"]));
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const toggle = (k: string) =>
    setEnabled((s) => {
      const n = new Set(s);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });

  const handleExport = async () => {
    if (!analysisResult || !analysisResult.repository) {
      toast.error("No analysis data available to export. Please analyze a repository first.");
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading("Generating comprehensive PDF report...");
    
    try {
      const targetElement = reportRef.current;
      if (!targetElement) throw new Error("Report container not found");
      
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff", 
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      const isPortrait = orientation === "portrait";
      const pdf = new jsPDF({
        orientation: isPortrait ? "p" : "l",
        unit: "mm",
        format: pageSize.toLowerCase()
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = pdfWidth / imgWidth;
      const heightInPdf = imgHeight * ratio;
      
      let position = 0;
      let heightLeft = heightInPdf;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, heightInPdf);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, heightInPdf);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`CodeBase_Report_${analysisResult.repository.name || "App"}.pdf`);
      
      toast.success("PDF exported successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-full min-h-[80vh] items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/5 bg-[#0d1217] p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="w-6" /> {/* Spacer for centering */}
          <h2 className="text-[15px] font-semibold text-white">Export to PDF</h2>
          <button className="text-slate-400 transition-colors hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {exportToggles.map((item, idx) => {
            const isSelected = enabled.has(item.id);
            const Icon = item.icon;
            const isLastOdd = exportToggles.length % 2 !== 0 && idx === exportToggles.length - 1;

            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                  isLastOdd ? "col-span-2" : ""
                } ${
                  isSelected 
                    ? "border-[#20b2aa]/50 bg-[#20b2aa]/5 text-[#20b2aa]" 
                    : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {isSelected && (
                  <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#20b2aa] text-white">
                    <CheckCircle2 className="h-3 w-3" strokeWidth={3} />
                  </div>
                )}
                <Icon className="h-6 w-6" strokeWidth={1.5} />
                <span className="text-[13px] font-medium text-slate-300">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="my-6 h-px w-full bg-white/5" />

        {/* Page Settings */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Page Size</span>
            <select 
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="w-24 rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-[#20b2aa]/50"
            >
              <option value="A4" className="bg-[#0d1217]">A4</option>
              <option value="Letter" className="bg-[#0d1217]">Letter</option>
              <option value="Legal" className="bg-[#0d1217]">Legal</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Orientation</span>
            <div className="flex gap-2">
              <button
                onClick={() => setOrientation("portrait")}
                className={`flex h-9 w-12 items-center justify-center rounded-lg border transition-colors ${
                  orientation === "portrait"
                    ? "border-[#20b2aa]/50 bg-[#20b2aa]/10 text-[#20b2aa]"
                    : "border-white/10 bg-transparent text-slate-400 hover:bg-white/5"
                }`}
              >
                <RectangleVertical className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setOrientation("landscape")}
                className={`flex h-9 w-12 items-center justify-center rounded-lg border transition-colors ${
                  orientation === "landscape"
                    ? "border-[#20b2aa]/50 bg-[#20b2aa]/10 text-[#20b2aa]"
                    : "border-white/10 bg-transparent text-slate-400 hover:bg-white/5"
                }`}
              >
                <RectangleHorizontal className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 rounded-xl border border-white/10 bg-transparent py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5">
            Cancel
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#20b2aa] py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] hover:bg-[#1da199] disabled:opacity-70 disabled:hover:scale-100"
          >
            {isExporting ? "Exporting..." : "Export to PDF"}
            {!isExporting && <FileDown className="h-4 w-4" />}
          </button>
        </div>
      </motion.div>

      {/* Hidden PDF Report component */}
      <PrintReport ref={reportRef} result={analysisResult} enabled={enabled} />
    </div>
  );
}
