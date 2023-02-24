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
}
