import { create } from "zustand";

export type JsonSchema = {
  type: "object";
  properties: Record<string, any>;
  required?: string[];
};

type SchemaStore = {
  schema: JsonSchema;
  setSchema: (schema: JsonSchema) => void;
  resetSchema: () => void;
};

const defaultSchema: JsonSchema = {
  type: "object",
  properties: {},
  required: [],
};

export const useSchemaStore = create<SchemaStore>((set) => ({
  schema: defaultSchema,
  setSchema: (schema) => set({ schema }),
  resetSchema: () => set({ schema: defaultSchema }),
}));
