import React, { Fragment, useEffect, useReducer } from "react";
import Character from "../model/Character";
import { ListInitialState, ReducerActions } from "../types/CharacterList.d";

const numberOfResultsPerPage = 15;
const initialState: ListInitialState = {
  shouldShowPrevButton: false,
  shouldShowNextButton: true,
  currentPage: 1,
};

const buttonAndPageReducer = (
  state: ListInitialState,
  action: ReducerActions
) => {
  switch (action.type) {
  case "NEXT_CLICK":
    return { ...state, currentPage: state.currentPage + 1 };
  case "PREV_CLICK":
    if (state.currentPage > 1) {
      return { ...state, currentPage: state.currentPage - 1 };
    } else {
      return { ...state };
    }
  case "SET_ARROWS":
    const { currentOffset, totalResults } = action.payload;

    const numberOfStillAvailableItems =
        totalResults - currentOffset + numberOfResultsPerPage;

    const shouldShowPrevButton = state.currentPage !== 1;
    const shouldShowNextButton =
        totalResults > numberOfResultsPerPage &&
        numberOfStillAvailableItems > 0;

    return { ...state, shouldShowPrevButton, shouldShowNextButton };
  }
};

const CharacterList: React.FC<{
  backButtonClickHandler: () => void;
  nextButtonClickHandler: () => void;
  charactersList: Character[];
  numberOfResults: { total: number; offset: number };
}> = (props) => {
  /**
   * Not strictly necessary to user a reducer here, but i want current page
   * to affect the state of the previous button, instead of doing currentOffset > 0
   */
  const [state, dispatch] = useReducer(buttonAndPageReducer, initialState);
  const { offset: currentOffset, total: totalResults } = props.numberOfResults;

  //For link sharing to have the correct arrows
  useEffect(() => {
    dispatch({ type: "SET_ARROWS", payload: { currentOffset, totalResults } });
  }, [currentOffset, totalResults]);

  const nextButtonClickHandler = () => {
    dispatch({ type: "NEXT_CLICK" });
    dispatch({ type: "SET_ARROWS", payload: { currentOffset, totalResults } });

    props.nextButtonClickHandler();
  };

  const prevButtonClickHandler = () => {
    dispatch({ type: "PREV_CLICK" });
    dispatch({ type: "SET_ARROWS", payload: { currentOffset, totalResults } });

    props.backButtonClickHandler();
  };

  return (
    <Fragment>
      <ul>
        {props.charactersList.map((character) => (
          <li key={character.id}>{character.name}</li>
        ))}
      </ul>
      <div>
        {state.shouldShowPrevButton && (
          <button type="button" onClick={prevButtonClickHandler}>
            Prev
          </button>
        )}
        <p>Current page: {state.currentPage}</p>
        {state.shouldShowNextButton && (
          <button type="button" onClick={nextButtonClickHandler}>
            Next
          </button>
        )}
      </div>
      <p>Number of results: {totalResults}</p>
    </Fragment>
  );
};

export default CharacterList;
