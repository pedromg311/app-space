export type InitialState = {
  value: string;
  isTouched: boolean;
  title?: string;
};

export type InputActions =
  | { type: "INPUT"; value: string }
  | { type: "BLUR" }
  | { type: "RESET" };

export type ValidateFunction = (value: string) => boolean;
