export type ListInitialState = {
  shouldShowPrevButton: boolean;
  shouldShowNextButton: boolean;
  currentPage: number;
};

export type ReducerActions =
  | { type: "NEXT_CLICK" }
  | { type: "PREV_CLICK" }
  | {
      type: "SET_ARROWS";
      payload: { currentOffset: number; totalResults: number };
    };
