import React, { useReducer } from "react";
import { act, renderHook, RenderHookResult } from "@testing-library/react";
import { ListState, ReducerActions } from "../../types/CharacterList.d";
import { buttonAndPageReducer } from "../_currentPage.utils";
import * as DUMMY_DATA from "../../../public/DUMMY_DATA.json";
import { APIResponse } from "../../types/Character.d";

const initialState: ListState = {
  shouldShowPrevButton: false,
  shouldShowNextButton: true,
  currentPage: 1,
  numberOfResults: 0,
  currentOffset: 0,
  currentSearchParams: { orderBy: "nameStartsWith" },
  charactersList: null,
};

const renderedHook = (
  state = initialState
): RenderHookResult<[ListState, React.Dispatch<ReducerActions>], ListState> => {
  return renderHook(() => useReducer(buttonAndPageReducer, state));
};

/**
 * There's a gotcha with updates. renderHook mutates the value of 'current' when updates
 * happen so i cannot destructure its values as the assignment will make a copy locking
 * into the value at that time. And that is why the result variable is used so inefficiently
 */
describe("[Utils] Characters Page Reducer", () => {
  test("if reducer is initialized with initial state", async () => {
    const [state] = renderedHook().result.current;

    expect(state).toEqual(initialState);
  });

  test("if NEXT_CLICK increments the counter", async () => {
    const { result } = renderedHook();
    const dispatch = result.current[1];

    act(() => dispatch({ type: "NEXT_CLICK" }));

    expect(result.current[0].currentPage).toEqual(2);
  });

  test("if PREV_CLICK decrements the counter", async () => {
    const customState = { ...initialState, currentPage: 2 };
    const { result } = renderHook(() =>
      useReducer(buttonAndPageReducer, customState)
    );

    const dispatch = result.current[1];
    act(() => dispatch({ type: "PREV_CLICK" }));

    expect(result.current[0].currentPage).toEqual(1);
  });

  test("if counter stays at 1 if PREV_CLICK is clicked again", async () => {
    const { result } = renderHook(() =>
      useReducer(buttonAndPageReducer, initialState)
    );

    const dispatch = result.current[1];
    act(() => dispatch({ type: "PREV_CLICK" }));

    expect(result.current[0].currentPage).toEqual(1);
  });

  test("if SET_CHARACTER_LIST sets the state correctly", async () => {
    const { result } = renderHook(() =>
      useReducer(buttonAndPageReducer, initialState)
    );

    const dispatch = result.current[1];
    act(() =>
      dispatch({
        type: "SET_CHARACTER_LIST",
        payload: { responseContent: { ...DUMMY_DATA } },
      })
    );

    expect(result.current[0].charactersList).not.toBeNull();
    expect(result.current[0].currentPage).toBe(1);
    expect(result.current[0].numberOfResults).toBe(21);
    expect(result.current[0].currentOffset).toBe(0);
    expect(result.current[0].currentPage).toBe(1);
    expect(result.current[0].shouldShowPrevButton).toBe(false);
    expect(result.current[0].shouldShowNextButton).toBe(true);
  });

  test("if NEXT_CLICK enables prev button if necessary", async () => {
    const { result } = renderedHook();
    const dispatch = result.current[1];

    act(() => dispatch({ type: "NEXT_CLICK" }));

    expect(result.current[0].shouldShowPrevButton).toEqual(true);
  });

  test("if PREV_CLICK enables next button", async () => {
    const customState = { ...initialState, currentPage: 2 };
    const { result } = renderHook(() =>
      useReducer(buttonAndPageReducer, customState)
    );

    const dispatch = result.current[1];
    act(() => dispatch({ type: "PREV_CLICK" }));

    expect(result.current[0].shouldShowPrevButton).toEqual(true);
  });

  test("if next button is hidden if not needed", async () => {
    const customState = { ...initialState, numberOfResults: 10 };
    const { result } = renderHook(() =>
      useReducer(buttonAndPageReducer, customState)
    );

    const dispatch = result.current[1];
    //Dummy click just to set the state even if doesn't really make sense in the context of this test
    act(() => dispatch({ type: "NEXT_CLICK" }));

    const [state] = result.current;
    expect(state.shouldShowNextButton).toBe(false);
  });

  test("if prev button is hidden if not needed", async () => {
    const customState = { ...initialState };
    const { result } = renderHook(() =>
      useReducer(buttonAndPageReducer, customState)
    );

    const dispatch = result.current[1];
    //Dummy click just to set the state even if doesn't really make sense in the context of this test
    act(() => dispatch({ type: "PREV_CLICK" }));

    const [state] = result.current;
    expect(state.shouldShowPrevButton).toBe(false);
  });
});

export {};
