"use client";

import { useSchemaStore } from "@/stores/schema-store";
import { formatSchemaForExport } from "@/lib/schema/format";
import { generateSampleJson } from "@/lib/schema/sample";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function JsonPreview() {
  const schema = useSchemaStore((s) => s.schema);
  const reset = useSchemaStore((s) => s.resetSchema);

  const [sampleJson, setSampleJson] = useState(() =>
    generateSampleJson(schema)
  );

  const formatted = formatSchemaForExport(schema);
  const formattedStr = JSON.stringify(formatted, null, 2);
  const sampleStr = JSON.stringify(sampleJson, null, 2);

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Schema JSON */}
      <div className="border p-4 rounded-xl bg-zinc-950 overflow-auto shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Generated Schema</h2>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleCopy(formattedStr)}
            >
              <Copy size={16} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleDownload(formattedStr, "schema.json")}
            >
              <Download size={16} />
            </Button>
          </div>
        </div>
        <pre className="text-xs text-zinc-300 whitespace-pre-wrap">
          {formattedStr}
        </pre>
      </div>

      {/* Sample JSON */}
      <div className="border p-4 rounded-xl bg-zinc-950 overflow-auto shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Sample JSON</h2>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleCopy(sampleStr)}
            >
              <Copy size={16} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleDownload(sampleStr, "sample.json")}
            >
              <Download size={16} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setSampleJson(generateSampleJson(schema))}
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>
        <pre className="text-xs text-zinc-300 whitespace-pre-wrap">
          {sampleStr}
        </pre>
      </div>
    </div>
  );
}
