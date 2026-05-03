// import { useState, useRef } from "react";
// import { MessageSquare, Star, Paperclip, Send, X } from "lucide-react";
// import { toast } from "sonner";

// export function FeedbackPage() {
//   const [rating, setRating] = useState(0);
//   const [hoveredStar, setHoveredStar] = useState(0);
//   const [feedbackType, setFeedbackType] = useState("Suggestion");
//   const [message, setMessage] = useState("");
//   const [attachedFile, setAttachedFile] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setAttachedFile(file);
//   };

//   const handleRemoveFile = () => {
//     setAttachedFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleSubmit = () => {
//     if (rating === 0) {
//       toast.error("Please select a rating");
//       return;
//     }
//     if (!message.trim()) {
//       toast.error("Please provide your feedback");
//       return;
//     }

//     toast.success("Feedback sent! Thank you for your input.");
//     setMessage("");
//     setRating(0);
//     setFeedbackType("Suggestion");
//     setAttachedFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="flex-1 w-full h-full flex flex-col items-center justify-center py-10 px-4">
//       <div className="w-full max-w-3xl bg-[#0f172a] border border-border/50 rounded-2xl shadow-xl overflow-hidden relative">
//         {/* Glow behind the icon */}
//         <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#2dd4bf]/20 blur-3xl pointer-events-none rounded-full" />

//         <div className="p-10 flex flex-col items-center border-b border-white/5">
//           <div className="w-16 h-16 rounded-full border border-[#2dd4bf]/30 bg-[#0b1121] flex items-center justify-center mb-6 relative z-10 shadow-[0_0_25px_rgba(45,212,191,0.15)]">
//             <MessageSquare className="w-7 h-7 text-[#2dd4bf]" />
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">We value your feedback</h2>
//           <p className="text-slate-400">Help us build a better CodeBase Explainer</p>
//         </div>

//         <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
//           {/* Left Column */}
//           <div className="flex flex-col gap-10">
//             <div>
//               <h3 className="text-sm font-medium text-slate-300 mb-4">How would you rate CodeBase Explainer?</h3>
//               <div className="flex items-center gap-2">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     onMouseEnter={() => setHoveredStar(star)}
//                     onMouseLeave={() => setHoveredStar(0)}
//                     onClick={() => setRating(star)}
//                     className="focus:outline-none transition-transform hover:scale-110"
//                   >
//                     <Star
//                       className={`w-8 h-8 transition-colors ${star <= (hoveredStar || rating)
//                           ? "fill-[#2dd4bf] text-[#2dd4bf]"
//                           : "text-[#2dd4bf] fill-transparent stroke-1"
//                         }`}
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-sm font-medium text-slate-300 mb-4">What type of feedback is this?</h3>
//               <div className="flex flex-wrap gap-3">
//                 {["Suggestion", "Bug Report", "Other"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setFeedbackType(type)}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${feedbackType === type
//                         ? "bg-[#2dd4bf]/10 border border-[#2dd4bf] text-[#2dd4bf]"
//                         : "bg-[#1e293b] border border-white/5 text-slate-300 hover:bg-[#2dd4bf]/5 hover:border-[#2dd4bf]/30"
//                       }`}
//                   >
//                     {type}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="flex flex-col">
//             <h3 className="text-sm font-medium text-slate-300 mb-3">Your feedback</h3>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Tell us what we can improve..."
//               className="w-full h-32 bg-[#1e293b]/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#2dd4bf]/50 focus:bg-[#1e293b] transition-colors resize-none mb-4"
//             />

//             <p className="text-xs text-slate-500 mb-3">You can add a screenshot or logs (optional)</p>

//             {/* Hidden file input */}
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="application/pdf,image/*"
//               className="hidden"
//               onChange={handleFileChange}
//             />

//             {/* Attach button or attached file pill */}
//             {attachedFile ? (
//               <div className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 text-sm text-[#2dd4bf] max-w-full">
//                 <Paperclip className="w-4 h-4 shrink-0" />
//                 <span className="truncate max-w-[160px]">{attachedFile.name}</span>
//                 <button
//                   onClick={handleRemoveFile}
//                   className="ml-1 hover:text-white transition-colors shrink-0"
//                   aria-label="Remove attachment"
//                 >
//                   <X className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e293b] border border-white/5 text-sm text-slate-300 hover:bg-[#2dd4bf]/5 hover:text-[#2dd4bf] hover:border-[#2dd4bf]/30 transition-colors"
//               >
//                 <Paperclip className="w-4 h-4" />
//                 Attach File
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="p-6 md:p-8 border-t border-white/5 flex items-center justify-end gap-4 bg-[#0b1121]/50">
//           <button
//             onClick={() => { setMessage(""); setRating(0); setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
//             className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2dd4bf] text-[#0f172a] text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:bg-[#20b2aa] transition-colors"
//           >
//             <Send className="w-4 h-4" />
//             Send Feedback
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useRef } from "react";
import { MessageSquare, Star, Paperclip, Send, X } from "lucide-react";
import { toast } from "sonner";

export function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedbackType, setFeedbackType] = useState("Suggestion");
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachedFile(file);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!message.trim()) {
      toast.error("Please provide your feedback");
      return;
    }

    toast.success("Feedback sent! Thank you for your input.");
    setMessage("");
    setRating(0);
    setFeedbackType("Suggestion");
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-[#0f172a] border border-border/50 rounded-2xl shadow-xl overflow-hidden relative">
        {/* Glow behind the icon */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#2dd4bf]/20 blur-3xl pointer-events-none rounded-full" />

        <div className="p-10 flex flex-col items-center border-b border-white/5">
          <div className="w-16 h-16 rounded-full border border-[#2dd4bf]/30 bg-[#0b1121] flex items-center justify-center mb-6 relative z-10 shadow-[0_0_25px_rgba(45,212,191,0.15)]">
            <MessageSquare className="w-7 h-7 text-[#2dd4bf]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">We value your feedback</h2>
          <p className="text-slate-400">Help us build a better CodeBase Explainer</p>
        </div>

        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-4">How would you rate CodeBase Explainer?</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${star <= (hoveredStar || rating)
                          ? "fill-[#2dd4bf] text-[#2dd4bf]"
                          : "text-[#2dd4bf] fill-transparent stroke-1"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-4">What type of feedback is this?</h3>
              <div className="flex flex-wrap gap-3">
                {["Suggestion", "Bug Report", "Other"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFeedbackType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${feedbackType === type
                        ? "bg-[#2dd4bf]/10 border border-[#2dd4bf] text-[#2dd4bf]"
                        : "bg-[#1e293b] border border-white/5 text-slate-300 hover:bg-[#2dd4bf]/5 hover:border-[#2dd4bf]/30"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Your feedback</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what we can improve..."
              className="w-full h-32 bg-[#1e293b]/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#2dd4bf]/50 focus:bg-[#1e293b] transition-colors resize-none mb-4"
            />

            <p className="text-xs text-slate-500 mb-3">You can add a screenshot or logs (optional)</p>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Attach button or attached file pill */}
            {attachedFile ? (
              <div className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 text-sm text-[#2dd4bf] max-w-full">
                <Paperclip className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[160px]">{attachedFile.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className="ml-1 hover:text-white transition-colors shrink-0"
                  aria-label="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e293b] border border-white/5 text-sm text-slate-300 hover:bg-[#2dd4bf]/5 hover:text-[#2dd4bf] hover:border-[#2dd4bf]/30 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
                Attach File
              </button>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-white/5 flex items-center justify-end gap-4 bg-[#0b1121]/50">
          <button
            onClick={() => { setMessage(""); setRating(0); setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2dd4bf] text-[#0f172a] text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:bg-[#20b2aa] transition-colors"
          >
            <Send className="w-4 h-4" />
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
}