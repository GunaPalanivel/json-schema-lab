import { JsonSchema, SchemaProperty } from "@/types/schema";

export function formatSchemaForExport(
  schema: JsonSchema
): Record<string, unknown> {
  const format = (prop: SchemaProperty): Record<string, unknown> => {
    const node: Record<string, unknown> = { type: prop.type };
    if (prop.description) node.description = prop.description;
    if (prop.enum?.length) node.enum = [...prop.enum];

    if (prop.type === "object" && prop.properties) {
      const required: string[] = [];
      node.properties = Object.fromEntries(
        Object.entries(prop.properties).map(([k, v]) => {
          if (v.required) required.push(k);
          return [k, format(v)];
        })
      );
      if (required.length) node.required = required;
    }

    if (prop.type === "array" && prop.items) {
      node.items = format(prop.items);
    }

    return node;
  };

  return {
    $schema: schema.$schema,
    title: schema.title,
    type: "object",
    description: schema.description,
    properties: Object.fromEntries(
      Object.entries(schema.properties).map(([k, v]) => [k, format(v)])
    ),
    ...(schema.required.length && { required: schema.required }),
  };
}
