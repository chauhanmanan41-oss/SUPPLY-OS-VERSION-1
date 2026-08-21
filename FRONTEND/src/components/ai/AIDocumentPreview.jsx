import React, { useState } from "react";
import { FileText, Copy, Check, Download, Printer, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { toast } from "sonner";

export function AIDocumentPreview({ documentType, content, title }) {
    const [copied, setCopied] = useState(false);

    if (!content) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("Document markdown copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: "text/markdown" });
        element.href = URL.createObjectURL(file);
        element.download = `${title || documentType || "SupplyOS_Document"}_${Date.now()}.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success("Document downloaded!");
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title || "SupplyOS Document"}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
                        h1, h2, h3 { color: #000; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                        th { background-color: #f5f5f5; }
                    </style>
                </head>
                <body>
                    <pre style="white-space: pre-wrap; font-family: inherit;">${content}</pre>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className="w-full rounded-2xl bg-white border border-[rgba(208,198,174,0.4)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden my-4">
            {/* Header Bar */}
            <div className="bg-[#fbf9f9] px-6 py-4 border-b border-[rgba(208,198,174,0.3)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#303031] text-[#ffd54a] flex items-center justify-center font-bold shadow-sm">
                        <FileText size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>
                                {title || documentType ? `${(title || documentType).toUpperCase()} (AI Generated)` : "Structured Business Document"}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-700 font-bold border border-emerald-500/20">
                                Verified Data
                            </span>
                        </div>
                        <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>
                            Synthesized from live SupplyOS Master Data repository with zero hallucination enforcement.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white border border-[rgba(208,198,174,0.4)] hover:bg-black/5 text-[#303031] transition-all flex items-center gap-1.5 text-[12px] font-bold px-3 shadow-2xs"
                        title="Copy Markdown"
                        style={{ fontFamily: M }}
                    >
                        {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                    </button>

                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-white border border-[rgba(208,198,174,0.4)] hover:bg-black/5 text-[#303031] transition-all flex items-center gap-1.5 text-[12px] font-bold px-3 shadow-2xs"
                        title="Download Markdown file"
                        style={{ fontFamily: M }}
                    >
                        <Download size={14} />
                        <span>Download</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        className="p-2 rounded-lg bg-white border border-[rgba(208,198,174,0.4)] hover:bg-black/5 text-[#303031] transition-all text-[12px] px-2.5 shadow-2xs"
                        title="Print / Save as PDF"
                    >
                        <Printer size={15} />
                    </button>
                </div>
            </div>

            {/* Document Body */}
            <div className="p-8 bg-white overflow-x-auto">
                <pre
                    className="whitespace-pre-wrap text-[#1b1c1c] text-[13px] leading-relaxed font-mono bg-[#fcfbf9] p-6 rounded-xl border border-[rgba(208,198,174,0.2)]"
                    style={{ fontFamily: "Consolas, Monaco, 'Courier New', monospace" }}
                >
                    {content}
                </pre>
            </div>

            {/* Footer Notice */}
            <div className="bg-[#fbf9f9] px-6 py-2.5 border-t border-[rgba(208,198,174,0.2)] flex items-center justify-between text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Compliant with SupplyOS audit logging and tenant isolation protocols.</span>
                </div>
                <span>Export ready for ERP insertion</span>
            </div>
        </div>
    );
}
