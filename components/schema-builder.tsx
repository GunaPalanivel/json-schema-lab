"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SchemaFieldList } from "./schema-field-list";
import { JsonPreview } from "./json-preview";
import { useSchemaGenerator } from "@/hooks/use-schema-generator";
import type { SchemaFormData } from "@/types/schema";

const defaultFormData: SchemaFormData = {
  title: "Product",
  description: "A product from Acme's catalog",
  fields: [],
};

export function SchemaBuilder() {
  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder");

  const methods = useForm<SchemaFormData>({
    defaultValues: defaultFormData,
    mode: "onChange",
  });

  const { watch, register } = methods;
  const watchedData = watch();

  const { schema, sampleData } = useSchemaGenerator(
    watchedData.title,
    watchedData.description,
    watchedData.fields
  );

  return (
    <FormProvider {...methods}>
      <div className="w-full space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "builder" | "preview")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="builder">Schema Builder</TabsTrigger>
            <TabsTrigger value="preview">JSON Preview</TabsTrigger>
          </TabsList>

          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-6 pt-4">
            {/* Schema Info */}
            <Card>
              <CardHeader>
                <CardTitle>Schema Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter schema title"
                    {...register("title", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter schema description"
                    className="min-h-[80px]"
                    {...register("description")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Schema Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Schema Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <SchemaFieldList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* JSON Preview Tab */}
          <TabsContent value="preview" className="pt-4">
            <JsonPreview schema={schema} sampleData={sampleData} />
          </TabsContent>
        </Tabs>
      </div>
    </FormProvider>
  );
}
