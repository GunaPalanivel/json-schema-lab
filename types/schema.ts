// Type-safe schema definitions with discriminated unions
export type FieldType = "string" | "number" | "nested";

export interface BaseField {
  id: string;
  key: string;
  required: boolean;
  description?: string;
}

export interface StringField extends BaseField {
  type: "string";
  defaultValue: string;
  minLength?: number;
  maxLength?: number;
}

export interface NumberField extends BaseField {
  type: "number";
  defaultValue: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
}

export interface NestedField extends BaseField {
  type: "nested";
  properties: SchemaField[];
}

// Discriminated union for type safety
export type SchemaField = StringField | NumberField | NestedField;

export interface SchemaRoot {
  $schema: string;
  $id: string;
  title: string;
  description: string;
  type: "object";
  properties: Record<string, any>;
  required: string[];
}

// Form data structure for React Hook Form
export interface SchemaFormData {
  title: string;
  description: string;
  fields: SchemaField[];
}

// Type guards for runtime type checking
export const isStringField = (field: SchemaField): field is StringField =>
  field.type === "string";

export const isNumberField = (field: SchemaField): field is NumberField =>
  field.type === "number";

export const isNestedField = (field: SchemaField): field is NestedField =>
  field.type === "nested";
