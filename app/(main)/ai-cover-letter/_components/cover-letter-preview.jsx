
"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CoverLetterPreview = ({ content, jobTitle, companyName }) => {
  const [previewContent, setPreviewContent] = useState(content);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("cover-letter-pdf");
      const opt = {
        margin: [15, 15],
        filename: `cover-letter-${(companyName || "letter")
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div data-color-mode="light" className="py-4 space-y-4">
      <div className="flex justify-end">
        <Button onClick={generatePDF} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      <MDEditor
        value={previewContent}
        onChange={setPreviewContent}
        height={700}
      />

      {/* Hidden element used only as the source for PDF export */}
      <div className="hidden">
        <div id="cover-letter-pdf">
          <MDEditor.Markdown
            source={previewContent}
            style={{ background: "white", color: "black", padding: "20px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;