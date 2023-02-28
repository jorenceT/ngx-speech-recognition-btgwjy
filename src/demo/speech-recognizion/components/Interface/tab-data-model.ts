export interface TabData {
  index: number;
  active: boolean;
  type?: inputType;
  name?: string;
}

export enum inputType {
  text = 'text',
  number = 'numebr',
  button = 'button',
  dropdown = 'dropdown'
}

export enum controlType {
  input = 1,
  button = 2,
  global = 3,
  dropdown = 4
}
