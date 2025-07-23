export interface FormField {
  name: string;
  fieldName: string;
  type: string;
  label: string;
}

export interface FormData {
  id: string;
  name: string;
  subFields: FormField[];
}

export interface FormValue {
  name: string;
  email: string;
}
