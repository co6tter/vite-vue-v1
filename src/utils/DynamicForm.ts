import type { FormField, FormData } from "@/types/form";
import { nanoid } from "nanoid";

export class DynamicForm {
  constructor(
    private _fields: FormData[] = [],
    private _fieldMin = 1,
    private _fieldMax = 1,
  ) {}

  get fields() {
    return this._fields;
  }

  get fieldMin() {
    return this._fieldMin;
  }

  get fieldMax() {
    return this._fieldMax;
  }

  get fieldLength() {
    return this._fields.length;
  }

  addField(template: FormData): void {
    if (this.fieldLength >= this.fieldMax) {
      return;
    }

    const baseName = template.name;
    const subFields = template.subFields.map((sf: FormField) => {
      return {
        ...sf,
        name: `${baseName}_${sf.fieldName}_${nanoid(4)}`,
      };
    });

    const newField: FormData = {
      id: `${baseName}_${nanoid(4)}`,
      name: baseName,
      subFields,
    };
    this._fields.push(newField);
  }

  removeField(index: number): void {
    if (this.fieldLength <= this.fieldMin) {
      return;
    }
    this._fields.splice(index, 1);
  }

  removeAllFields(): void {
    this._fields.splice(0, this._fields.length);
  }
}
