"use client"

import { useMemo } from "react"
import type { SchemaField, SchemaRoot } from "@/types/schema"
import { isStringField, isNumberField, isNestedField } from "@/types/schema"

// Memoized hook for efficient JSON schema generation
export const useSchemaGenerator = (title: string, description: string, fields: SchemaField[]) => {
  const schema = useMemo(() => {
    return generateJsonSchema(title, description, fields)
  }, [title, description, fields])

  const sampleData = useMemo(() => {
    return generateSampleData(fields)
  }, [fields])

  return { schema, sampleData }
}

// Pure function for schema generation - O(n) complexity
const generateJsonSchema = (title: string, description: string, fields: SchemaField[]): SchemaRoot => {
  const properties: Record<string, any> = {}
  const required: string[] = []

  const processFields = (fieldList: SchemaField[]): Record<string, any> => {
    const props: Record<string, any> = {}

    for (const field of fieldList) {
      if (field.required) {
        required.push(field.key)
      }

      if (isStringField(field)) {
        props[field.key] = {
          type: "string",
          description: field.description || `${field.key} field`,
          ...(field.minLength && { minLength: field.minLength }),
          ...(field.maxLength && { maxLength: field.maxLength }),
        }
      } else if (isNumberField(field)) {
        props[field.key] = {
          type: "number",
          description: field.description || `${field.key} field`,
          ...(field.minimum !== undefined && { minimum: field.minimum }),
          ...(field.maximum !== undefined && { maximum: field.maximum }),
          ...(field.exclusiveMinimum && { exclusiveMinimum: field.minimum }),
          ...(field.exclusiveMaximum && { exclusiveMaximum: field.maximum }),
        }
      } else if (isNestedField(field)) {
        props[field.key] = {
          type: "object",
          description: field.description || `${field.key} nested object`,
          properties: processFields(field.properties),
          required: field.properties.filter((f) => f.required).map((f) => f.key),
        }
      }
    }

    return props
  }

  Object.assign(properties, processFields(fields))

  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `https://example.com/${title.toLowerCase().replace(/\s+/g, "-")}.schema.json`,
    title,
    description,
    type: "object",
    properties,
    required: required.filter((value, index, self) => self.indexOf(value) === index),
  }
}

// Generate sample data based on field definitions
const generateSampleData = (fields: SchemaField[]): Record<string, any> => {
  const data: Record<string, any> = {}

  const processFields = (fieldList: SchemaField[]): Record<string, any> => {
    const result: Record<string, any> = {}

    for (const field of fieldList) {
      if (isStringField(field)) {
        result[field.key] = field.defaultValue || `Sample ${field.key}`
      } else if (isNumberField(field)) {
        result[field.key] = field.defaultValue || 0
      } else if (isNestedField(field)) {
        result[field.key] = processFields(field.properties)
      }
    }

    return result
  }

  return processFields(fields)
}
