import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface SchemaProperty {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  enum?: string[];
  properties?: { [key: string]: SchemaProperty };
  items?: SchemaProperty;
}

export interface JsonSchema {
  $schema: string;
  type: string;
  title: string;
  description: string;
  properties: { [key: string]: SchemaProperty };
  required: string[];
}

interface SchemaBuilderProps {
  schema: JsonSchema;
  onSchemaChange: (schema: JsonSchema) => void;
}

const PROPERTY_TYPES = [
  "string",
  "number",
  "integer",
  "boolean",
  "object",
  "array",
  "null",
];

export function SchemaBuilder({ schema, onSchemaChange }: SchemaBuilderProps) {
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(
    new Set()
  );

  const updateSchema = useCallback(
    (updates: Partial<JsonSchema>) => {
      onSchemaChange({ ...schema, ...updates });
    },
    [schema, onSchemaChange]
  );

  const togglePropertyExpansion = (propertyId: string) => {
    setExpandedProperties((prev) => {
      const next = new Set(prev);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });
  };

  const addProperty = () => {
    const newId = `prop_${Date.now()}`;
    const newProperty: SchemaProperty = {
      id: newId,
      name: "newProperty",
      type: "string",
      required: false,
      description: "",
    };

    updateSchema({
      properties: {
        ...schema.properties,
        [newProperty.name]: newProperty,
      },
    });
    setExpandedProperties((prev) => new Set([...prev, newId]));
  };

  const removeProperty = (propertyName: string) => {
    const { [propertyName]: removed, ...remainingProperties } =
      schema.properties;
    updateSchema({
      properties: remainingProperties,
      required: schema.required.filter((req) => req !== propertyName),
    });
  };

  const updateProperty = (
    oldName: string,
    updates: Partial<SchemaProperty>
  ) => {
    const property = schema.properties[oldName];
    if (!property) return;

    const updatedProperty = { ...property, ...updates };
    const newProperties = { ...schema.properties };

    // Handle name change
    if (updates.name && updates.name !== oldName) {
      delete newProperties[oldName];
      newProperties[updates.name] = updatedProperty;
    } else {
      newProperties[oldName] = updatedProperty;
    }

    // Update required array if name changed
    let newRequired = [...schema.required];
    if (updates.name && updates.name !== oldName) {
      newRequired = newRequired.map((req) =>
        req === oldName ? updates.name! : req
      );
    }

    // Handle required status change
    if (updates.hasOwnProperty("required")) {
      const propertyName = updates.name || oldName;
      if (updates.required && !newRequired.includes(propertyName)) {
        newRequired.push(propertyName);
      } else if (!updates.required) {
        newRequired = newRequired.filter((req) => req !== propertyName);
      }
    }

    updateSchema({
      properties: newProperties,
      required: newRequired,
    });
  };

  const addNestedProperty = (parentName: string) => {
    const parent = schema.properties[parentName];
    if (!parent || parent.type !== "object") return;

    const newProperty: SchemaProperty = {
      id: `nested_${Date.now()}`,
      name: "nestedProperty",
      type: "string",
      required: false,
      description: "",
    };

    updateProperty(parentName, {
      properties: {
        ...parent.properties,
        [newProperty.name]: newProperty,
      },
    });
  };

  const renderProperty = (
    propertyName: string,
    property: SchemaProperty,
    level = 0
  ) => {
    const isExpanded = expandedProperties.has(property.id);
    const canHaveChildren =
      property.type === "object" || property.type === "array";

    return (
      <div
        key={property.id}
        className={`border rounded-lg p-4 ${
          level > 0 ? "ml-6 border-l-4 border-l-blue-200" : ""
        }`}
      >
        <Collapsible
          open={isExpanded}
          onOpenChange={() => togglePropertyExpansion(property.id)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {canHaveChildren && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
              <Label className="font-medium">Property</Label>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeProperty(propertyName)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor={`name-${property.id}`}>Name</Label>
              <Input
                id={`name-${property.id}`}
                value={property.name}
                onChange={(e) =>
                  updateProperty(propertyName, { name: e.target.value })
                }
                placeholder="Property name"
              />
            </div>

            <div>
              <Label htmlFor={`type-${property.id}`}>Type</Label>
              <Select
                value={property.type}
                onValueChange={(value) =>
                  updateProperty(propertyName, { type: value })
                }
              >
                <SelectTrigger id={`type-${property.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`description-${property.id}`}>Description</Label>
              <Input
                id={`description-${property.id}`}
                value={property.description || ""}
                onChange={(e) =>
                  updateProperty(propertyName, { description: e.target.value })
                }
                placeholder="Property description"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`required-${property.id}`}
                checked={property.required}
                onChange={(e) =>
                  updateProperty(propertyName, { required: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor={`required-${property.id}`}>Required</Label>
            </div>
          </div>

          <CollapsibleContent>
            {property.type === "object" && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Nested Properties</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addNestedProperty(propertyName)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Nested Property
                  </Button>
                </div>
                {property.properties &&
                  Object.entries(property.properties).map(
                    ([nestedName, nestedProp]) =>
                      renderProperty(nestedName, nestedProp, level + 1)
                  )}
              </div>
            )}

            {property.type === "array" && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Array Items Schema</h4>
                {property.items ? (
                  renderProperty("items", property.items, level + 1)
                ) : (
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateProperty(propertyName, {
                        items: {
                          id: `items_${Date.now()}`,
                          name: "items",
                          type: "string",
                          required: false,
                        },
                      })
                    }
                  >
                    Define Array Items Schema
                  </Button>
                )}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schema Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Schema Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Schema Title</Label>
            <Input
              id="title"
              value={schema.title}
              onChange={(e) => updateSchema({ title: e.target.value })}
              placeholder="Schema title"
            />
          </div>
          <div>
            <Label htmlFor="description">Schema Description</Label>
            <Input
              id="description"
              value={schema.description}
              onChange={(e) => updateSchema({ description: e.target.value })}
              placeholder="Schema description"
            />
          </div>
        </div>

        {/* Properties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Properties</h3>
            <Button onClick={addProperty}>
              <Plus className="h-4 w-4 mr-1" />
              Add Property
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(schema.properties).map(([name, property]) =>
              renderProperty(name, property)
            )}
          </div>

          {Object.keys(schema.properties).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No properties defined. Click "Add Property" to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
