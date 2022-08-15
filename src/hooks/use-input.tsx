import React, { useReducer } from "react";
import {
  InitialState,
  InputActions,
  ValidateFunction,
} from "../types/Inputs.d";

const initialInputState: InitialState = {
  value: "",
  isTouched: false,
  title: "",
};

const inputStateReducerFunction = (
  state: InitialState,
  action: InputActions
) => {
  if (action.type === "INPUT") {
    return { value: action.value, isTouched: state.isTouched };
  }

  if (action.type === "BLUR") {
    return { value: state.value, isTouched: true };
  }

  if (action.type === "RESET") {
    return initialInputState;
  }

  return initialInputState;
};

const useInput = (title?: string, validateValue?: ValidateFunction) => {
  const [inputState, dispatch] = useReducer(
    inputStateReducerFunction,
    initialInputState
  );

  let valueIsValid = true;

  if (validateValue) {
    valueIsValid = validateValue(inputState.value);
  }

  const hasError = !valueIsValid && inputState.isTouched;

  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "INPUT", value: event.currentTarget.value });

  const inputBlurHandler = () => dispatch({ type: "BLUR" });
  const reset = () => dispatch({ type: "RESET" });

  return {
    title: title,
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
