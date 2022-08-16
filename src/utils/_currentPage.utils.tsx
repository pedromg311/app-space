import Character from "../model/Character";
import { APICharacterData, APIResponse } from "../types/Character.d";
import { ListState, ReducerActions } from "../types/CharacterList.d";

const numberOfResultsPerPage = 12;

const shouldEnableNextArrow = (
  numberOfResults: number,
  currentOffset: number
): boolean => {
  const numberOfStillAvailableItems =
    numberOfResults - currentOffset + numberOfResultsPerPage;

  return (
    numberOfResults > numberOfResultsPerPage && numberOfStillAvailableItems > 0
  );
};

const nextClickAction = (state: ListState) => {
  const currentOffset = state.currentOffset + numberOfResultsPerPage;

  return {
    ...state,
    currentOffset,
  };
};

const prevClickAction = (state: ListState) => {
  let currentOffset = state.currentOffset - numberOfResultsPerPage;

  if (currentOffset < 0) {
    currentOffset = 0;
  }

  return {
    ...state,
    currentOffset,
  };
};

const setCharactersList = (
  state: ListState,
  payload: { responseContent: APIResponse }
) => {
  const charactersList = payload.responseContent.data.results.map(
    (characterData: APICharacterData) => new Character(characterData)
  );

  const { total: numberOfResults, offset: currentOffset } =
    payload.responseContent.data;

  const currentPage =
    Math.ceil(payload.responseContent.data.offset / numberOfResultsPerPage) + 1;

  const shouldShowNextButton = shouldEnableNextArrow(
    numberOfResults,
    currentOffset
  );
  const shouldShowPrevButton = currentPage > 1;

  return {
    ...state,
    charactersList,
    currentPage,
    numberOfResults,
    shouldShowPrevButton,
    shouldShowNextButton,
  };
};

const setListSort = (
  state: ListState,
  payload: { sortBy: Record<string, string> }
) => {
  const currentSearchParams = {
    ...state.currentSearchParams,
    ...payload.sortBy,
  };

  return { ...state, currentSearchParams };
};

export const buttonAndPageReducer = (
  state: ListState,
  action: ReducerActions
) => {
  switch (action.type) {
  case "NEXT_CLICK":
    return nextClickAction(state);
  case "PREV_CLICK":
    return prevClickAction(state);
  case "SET_CHARACTER_LIST":
    return setCharactersList(state, action.payload);
  case "SET_SORT":
    return setListSort(state, action.payload);
  }
};
