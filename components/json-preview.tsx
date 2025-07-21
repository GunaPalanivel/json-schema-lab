"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SchemaRoot } from "@/types/schema"

interface JsonPreviewProps {
  schema: SchemaRoot
  sampleData: Record<string, any>
}

export function JsonPreview({ schema, sampleData }: JsonPreviewProps) {
  const [activePreview, setActivePreview] = useState("schema")
  const { toast } = useToast()

  const handleCopy = async (data: any, type: string) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activePreview} onValueChange={setActivePreview}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schema">JSON Schema</TabsTrigger>
          <TabsTrigger value="sample">Sample Data</TabsTrigger>
        </TabsList>

        <TabsContent value="schema">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>JSON Schema Output</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopy(schema, "Schema")}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(schema, `${schema.title.toLowerCase()}.schema.json`)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                <code>{JSON.stringify(schema, null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sample">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sample Data</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopy(sampleData, "Sample data")}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(sampleData, `${schema.title.toLowerCase()}-sample.json`)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                <code>{JSON.stringify(sampleData, null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
