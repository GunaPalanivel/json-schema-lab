export function buildSample(prop: SchemaProperty): unknown {
  switch (prop.type) {
    case "string":
      return prop.enum?.[0] ?? `Sample ${prop.name}`;
    case "number":
    case "integer":
      return prop.name.includes("id") ? 1001 : 42;
    case "boolean":
      return true;
    case "null":
      return null;
    case "array":
      return prop.items ? [buildSample(prop.items)] : [];
    case "object": {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(prop.properties || {})) {
        if (val.required || Math.random() > 0.25) {
          result[key] = buildSample(val);
        }
      }
      return result;
    }
    default:
      return null;
  }
}

export function generateSampleJson(
  schema: JsonSchema
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(schema.properties).map(([k, v]) => [k, buildSample(v)])
  );
}
