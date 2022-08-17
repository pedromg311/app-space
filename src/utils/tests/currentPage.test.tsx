import React, { useReducer } from "react";
import { act, renderHook, RenderHookResult } from "@testing-library/react";
import { ListState, ReducerActions } from "../../types/CharacterList.d";
import { buttonAndPageReducer } from "../_currentPage.utils";
import * as DUMMY_DATA from "../../assets/DUMMY_DATA.json";
import { initialState } from "../../store/character-data";

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

  test("if NEXT_CLICK sets the offset correctly", () => {
    const { result } = renderedHook();
    const dispatch = result.current[1];

    act(() => dispatch({ type: "NEXT_CLICK" }));
    act(() => dispatch({ type: "NEXT_CLICK" }));

    expect(result.current[0].currentOffset).toEqual(24);
  });
  test("if PREV_CLICK sets the offset correctly", () => {
    const { result } = renderedHook();
    const dispatch = result.current[1];

    act(() => dispatch({ type: "NEXT_CLICK" }));
    act(() => dispatch({ type: "NEXT_CLICK" }));

    act(() => dispatch({ type: "PREV_CLICK" }));

    expect(result.current[0].currentOffset).toEqual(12);

    act(() => dispatch({ type: "PREV_CLICK" }));
    act(() => dispatch({ type: "PREV_CLICK" }));
    act(() => dispatch({ type: "PREV_CLICK" }));

    expect(result.current[0].currentOffset).toEqual(0);
  });

  test("if PREV_CLICK sets the offset to 0 if negative", () => {
    const { result } = renderedHook();
    const dispatch = result.current[1];

    act(() => dispatch({ type: "NEXT_CLICK" }));
    act(() => dispatch({ type: "PREV_CLICK" }));
    act(() => dispatch({ type: "PREV_CLICK" }));
    act(() => dispatch({ type: "PREV_CLICK" }));

    expect(result.current[0].currentOffset).toEqual(0);
  });

  test("if SET_SEARCH_PARAMS sets the params correctly", () => {
    const { result } = renderedHook();
    const dispatch = result.current[1];

    act(() =>
      dispatch({
        type: "SET_SEARCH_PARAMS",
        payload: { newSearchParams: { name: "Spider" } },
      })
    );

    expect(result.current[0].currentSearchParams).toEqual({
      ...initialState.currentSearchParams,
      name: "Spider",
    });
  });

  test("if SET_SEARCH_PARAMS resets filters when it receives an empty value", () => {
    const { result } = renderedHook();
    const dispatch = result.current[1];

    act(() =>
      dispatch({
        type: "SET_SEARCH_PARAMS",
        payload: { newSearchParams: { name: "Spider" } },
      })
    );

    expect(result.current[0].currentSearchParams).toEqual({
      ...initialState.currentSearchParams,
      name: "Spider",
    });

    act(() =>
      dispatch({
        type: "SET_SEARCH_PARAMS",
        payload: { newSearchParams: {} },
      })
    );

    expect(result.current[0].currentSearchParams).toEqual(
      initialState.currentSearchParams
    );
  });
});

export {};
