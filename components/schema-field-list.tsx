"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SchemaFieldItem } from "./schema-field-item"
import { createDefaultField } from "@/lib/field-factory"
import type { SchemaFormData, FieldType } from "@/types/schema"

interface SchemaFieldListProps {
  nestingPath?: string
  level?: number
}

export function SchemaFieldList({ nestingPath = "fields", level = 0 }: SchemaFieldListProps) {
  const { control } = useFormContext<SchemaFormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: nestingPath as any,
  })

  const handleAddField = (type: FieldType) => {
    const newField = createDefaultField(type)
    append(newField as any)
  }

  const handleRemoveField = (index: number) => {
    remove(index)
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <SchemaFieldItem
          key={field.id}
          index={index}
          nestingPath={nestingPath}
          level={level}
          onRemove={() => handleRemoveField(index)}
        />
      ))}

      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddField("string")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add String
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddField("number")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Number
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddField("nested")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Nested
        </Button>
      </div>
    </div>
  )
}
