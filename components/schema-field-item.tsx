"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SchemaFieldList } from "./schema-field-list";
import type { SchemaFormData, FieldType } from "@/types/schema";
import { isNestedField } from "@/types/schema";

interface SchemaFieldItemProps {
  index: number;
  nestingPath: string;
  level: number;
  onRemove: () => void;
}

export function SchemaFieldItem({
  index,
  nestingPath,
  level,
  onRemove,
}: SchemaFieldItemProps) {
  const { register, watch, setValue, getValues } =
    useFormContext<SchemaFormData>();
  const [isExpanded, setIsExpanded] = useState(true);

  const fieldPath = `${nestingPath}.${index}` as const;
  const field = watch(fieldPath as any);

  const handleTypeChange = (newType: FieldType) => {
    const currentField = getValues(fieldPath as any);
    const baseField = {
      id: currentField.id,
      key: currentField.key,
      required: currentField.required,
      description: currentField.description,
    };

    let updatedField;
    switch (newType) {
      case "string":
        updatedField = {
          ...baseField,
          type: "string" as const,
          defaultValue: "Sample text",
        };
        break;
      case "number":
        updatedField = {
          ...baseField,
          type: "number" as const,
          defaultValue: 0,
        };
        break;
      case "nested":
        updatedField = {
          ...baseField,
          type: "nested" as const,
          properties: [],
        };
        break;
    }

    setValue(fieldPath as any, updatedField);
  };

  const isNested = isNestedField(field);
  const indentClass = level > 0 ? `ml-${Math.min(level * 4, 16)}` : "";

  return (
    <Card className={`${indentClass} border-l-4 border-l-blue-200`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Field Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isNested && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              <span className="text-sm font-medium">
                Field {index + 1} {level > 0 && `(Level ${level + 1})`}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Field Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Field Key</Label>
              <Input
                placeholder="fieldName"
                {...register(`${fieldPath}.key` as any, { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={field?.type}
                onValueChange={(value: FieldType) => handleTypeChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="nested">Nested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id={`required-${fieldPath}`}
                {...register(`${fieldPath}.required` as any)}
              />
              <Label htmlFor={`required-${fieldPath}`}>Required</Label>
            </div>
          </div>

          {/* Type-specific fields */}
          {field?.type === "string" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Value</Label>
                <Input
                  placeholder="Default string value"
                  {...register(`${fieldPath}.defaultValue` as any)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Field description"
                  {...register(`${fieldPath}.description` as any)}
                />
              </div>
            </div>
          )}

          {field?.type === "number" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Default Value</Label>
                <Input
                  type="number"
                  placeholder="0"
                  {...register(`${fieldPath}.defaultValue` as any, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum</Label>
                <Input
                  type="number"
                  placeholder="Min value"
                  {...register(`${fieldPath}.minimum` as any, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum</Label>
                <Input
                  type="number"
                  placeholder="Max value"
                  {...register(`${fieldPath}.maximum` as any, {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>
          )}

          {/* Nested fields */}
          {isNested && isExpanded && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-4">Nested Properties</h4>
              <SchemaFieldList
                nestingPath={`${fieldPath}.properties`}
                level={level + 1}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
