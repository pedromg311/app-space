import Character from "../model/Character";
import { APIResponse } from "./Character.d";

export type ListState = {
  shouldShowPrevButton: boolean;
  shouldShowNextButton: boolean;
  currentPage: number;
  currentOffset: number;
  currentSearchParams: Record<string, string>;
  charactersList: Character[] | null;
  numberOfResults: number;
};

export type ReducerActions =
  | { type: "NEXT_CLICK" }
  | { type: "PREV_CLICK" }
  | {
      type: "SET_CHARACTER_LIST";
      payload: { responseContent: APIResponse };
    }
  | {
      type: "SET_SEARCH_PARAMS";
      payload: { newSearchParams: Record<string, string> };
    }
  | {
      type: "SET_NEW_OFFSET";
      payload: { newOffset: number };
    };
