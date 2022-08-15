import Character from "../model/Character";
import { APICharacterData, APIResponse } from "../types/Character.d";
import { ListState, ReducerActions } from "../types/CharacterList.d";

const shouldEnableNextArrow = (
  numberOfResults: number,
  numberOfResultsPerPage: number,
  currentOffset: number
): boolean => {
  const numberOfStillAvailableItems =
    numberOfResults - currentOffset + numberOfResultsPerPage;

  return (
    numberOfResults > numberOfResultsPerPage && numberOfStillAvailableItems > 0
  );
};

const nextClickAction = (state: ListState) => {
  const currentOffset = state.currentOffset + state.numberOfResultsPerPage;
  const currentPage = state.currentPage + 1;

  //FIXME: do i need this here?
  const shouldShowNextButton = shouldEnableNextArrow(
    state.numberOfResults,
    state.numberOfResultsPerPage,
    currentOffset
  );
  const shouldShowPrevButton = currentPage > 1;

  return {
    ...state,
    currentPage,
    currentOffset,
    shouldShowNextButton,
    shouldShowPrevButton,
  };
};

const prevClickAction = (state: ListState) => {
  const newState = { ...state };

  if (state.currentPage > 1) {
    const shouldShowPrevButton = newState.currentPage !== 1;

    newState.currentPage = state.currentPage - 1;
    //FIXME: do i need this here?
    newState.shouldShowPrevButton = shouldShowPrevButton;
    newState.shouldShowNextButton = true;
  }
  return newState;
};

const setCharactersList = (
  state: ListState,
  action: { responseContent: APIResponse }
) => {
  const charactersList = action.responseContent.data.results.map(
    (characterData: APICharacterData) => new Character(characterData)
  );

  const { total: numberOfResults, offset: currentOffset } =
    action.responseContent.data;

  const currentPage =
    Math.ceil(
      action.responseContent.data.offset / state.numberOfResultsPerPage
    ) + 1;

  const shouldShowNextButton = shouldEnableNextArrow(
    numberOfResults,
    state.numberOfResultsPerPage,
    currentOffset
  );
  const shouldShowPrevButton = currentPage > 1;

  return {
    ...state,
    charactersList,
    currentPage,
    numberOfResults,
    currentOffset,
    shouldShowPrevButton,
    shouldShowNextButton,
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
  }
};
