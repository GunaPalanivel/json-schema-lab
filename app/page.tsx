import { SchemaBuilder } from "@/components/schema-builder";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            JSON Schema Lab
          </h1>
          <p className="mt-3 text-muted-foreground text-base">
            Craft and Visualize Complex JSON Schemas Instantly — No Code, All
            Control.
          </p>
        </header>
        <SchemaBuilder />
      </div>
    </main>
  );
}
