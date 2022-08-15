import Character from "../model/Character";
import { APIResponse } from "./Character.d";

export type ListState = {
  shouldShowPrevButton: boolean;
  shouldShowNextButton: boolean;
  currentPage: number;
  numberOfResults: number;
  currentOffset: number;
  charactersList: Character[] | null;
};

export type ReducerActions =
  | { type: "NEXT_CLICK" }
  | { type: "PREV_CLICK" }
  | {
      type: "SET_CHARACTER_LIST";
      payload: { responseContent: APIResponse };
    };
