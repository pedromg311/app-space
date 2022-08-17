import Character from "../model/Character";
import { initialState } from "../store/character-data";
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
    currentSearchParams: {
      ...state.currentSearchParams,
      offset: currentOffset.toString(),
    },
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
    currentSearchParams: {
      ...state.currentSearchParams,
      offset: currentOffset.toString(),
    },
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

const setSearchParams = (
  state: ListState,
  payload: { newSearchParams: Record<string, string> }
) => {
  const { newSearchParams } = payload;

  let currentSearchParams: Record<string, string> = {};

  if (Object.keys(newSearchParams).length === 0) {
    currentSearchParams = initialState.currentSearchParams;
  } else {
    currentSearchParams = { ...state.currentSearchParams, ...newSearchParams };

    if (!newSearchParams.offset) {
      currentSearchParams.offset = state.currentSearchParams.offset;
    }
  }

  return {
    ...state,
    currentSearchParams: { ...currentSearchParams },
  };
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
  case "SET_SEARCH_PARAMS":
    return setSearchParams(state, action.payload);
  }
};
