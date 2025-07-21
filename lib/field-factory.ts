import { nanoid } from "nanoid"
import type { FieldType, SchemaField } from "@/types/schema"

// Factory pattern for creating default fields
export const createDefaultField = (type: FieldType): SchemaField => {
  const baseField = {
    id: nanoid(),
    key: `field_${nanoid(4)}`,
    required: false,
    description: "",
  }

  switch (type) {
    case "string":
      return {
        ...baseField,
        type: "string",
        defaultValue: "Sample text",
      }

    case "number":
      return {
        ...baseField,
        type: "number",
        defaultValue: 0,
      }

    case "nested":
      return {
        ...baseField,
        type: "nested",
        properties: [],
      }

    default:
      throw new Error(`Unsupported field type: ${type}`)
  }
}

// Validation utilities
export const validateFieldKey = (key: string): boolean => {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)
}

export const sanitizeFieldKey = (key: string): string => {
  return key
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^[0-9]/, "_$&")
    .toLowerCase()
}
