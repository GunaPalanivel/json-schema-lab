export type FieldKind =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "enum"
  | "array"
  | "nested";

export interface SchemaNode {
  id: string;
  key: string;
  kind: FieldKind;
  enumOptions?: string[];
  children?: SchemaNode[];
}
