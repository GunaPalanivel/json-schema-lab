"use client";

import { useState } from "react";
import { SchemaBuilder, JsonSchema } from "@/components/schema-builder";
import { JsonPreview } from "@/components/json-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEFAULT_SCHEMA: JsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  title: "My Schema",
  description: "A sample JSON schema",
  properties: {},
  required: [],
};

export default function Home() {
  const [schema, setSchema] = useState<JsonSchema>(DEFAULT_SCHEMA);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            JSON Schema Builder
          </h1>
          <p className="text-slate-600 text-lg">
            Build and visualize JSON schemas with ease
          </p>
        </div>

        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="builder">Schema Builder</TabsTrigger>
            <TabsTrigger value="preview">JSON Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="builder">
            <SchemaBuilder schema={schema} onSchemaChange={setSchema} />
          </TabsContent>

          <TabsContent value="preview">
            <JsonPreview schema={schema} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
