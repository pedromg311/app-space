import Character from "../model/Character";
import { initialState } from "../store/character-data";
import { APICharacterData, APIResponse } from "../types/Character.d";
import { ListState, ReducerActions } from "../types/CharacterList.d";

const numberOfResultsPerPage = 12;

const shouldEnableNextArrow = (
  numberOfResults: number,
  currentOffset: number,
  count: number
): boolean => {
  const numberOfStillAvailableItems = numberOfResults - (currentOffset + count);

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

  const {
    total: numberOfResults,
    offset: currentOffset,
    count,
  } = payload.responseContent.data;

  const currentPage =
    Math.ceil(payload.responseContent.data.offset / numberOfResultsPerPage) + 1;

  const shouldShowNextButton = shouldEnableNextArrow(
    numberOfResults,
    currentOffset,
    count
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
  let currentOffset = state.currentOffset;
  let currentSearchParams: Record<string, string> = {};

  if (Object.keys(newSearchParams).length === 0) {
    currentSearchParams = initialState.currentSearchParams;
  } else {
    currentSearchParams = { ...newSearchParams };

    /**
     * If the execution falls on:
     *
     * 1 Assertion => A filter was passe. Erase all other filters, but keep sort and limit
     * 2 Assertion => Not a filter, so keep old filter values. A sort or pagination request
     * 3 Assertion => A request that should reset the pagination, like a filter, or a sort
     */
    if (!newSearchParams.offset && !newSearchParams.orderBy) {
      currentSearchParams.orderBy = state.currentSearchParams.orderBy;
    } else {
      currentSearchParams = {
        ...state.currentSearchParams,
        ...currentSearchParams,
      };
    }

    if (!newSearchParams.offset) {
      currentSearchParams.offset = initialState.currentSearchParams.offset;
      currentOffset = +initialState.currentSearchParams.offset;
    }

    currentSearchParams.limit = initialState.currentSearchParams.limit;
  }

  return {
    ...state,
    currentSearchParams: { ...currentSearchParams },
    currentOffset,
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
  case "SET_NEW_OFFSET":
    return { ...state, currentOffset: action.payload.newOffset };
  }
};
