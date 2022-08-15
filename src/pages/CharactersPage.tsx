import React, { Fragment, useCallback, useEffect, useReducer } from "react";
import CharacterList from "../components/CharacterList";
import useHttp from "../hooks/use-http";
import { APIResponse } from "../types/Character.d";
import { ListState } from "../types/CharacterList.d";
import { buttonAndPageReducer } from "../utils/_currentPage.utils";

const initialState: ListState = {
  shouldShowPrevButton: false,
  shouldShowNextButton: true,
  currentPage: 1,
  numberOfResults: 0,
  currentOffset: 0,
  charactersList: null,
};

const CharactersPage = () => {
  /**
   * Not strictly necessary to user a reducer here, but i want current page
   * to affect the state of the previous button, instead of doing currentOffset > 0
   */
  const [state, dispatch] = useReducer(buttonAndPageReducer, initialState);
  const { isLoading, error, sendRequest } = useHttp();

  const transformData = async (responseContent: APIResponse) => {
    dispatch({
      type: "SET_CHARACTER_LIST",
      payload: { responseContent },
    });
  };

  const backButtonClickHandler = () => {
    sendRequest({ url: "DUMMY_DATA.json" }, transformData);

    dispatch({ type: "PREV_CLICK" });
  };

  const nextButtonClickHandler = () => {
    sendRequest({ url: "DUMMY_DATA.json" }, transformData);

    dispatch({ type: "NEXT_CLICK" });
  };

  useEffect(() => {
    sendRequest({ url: "DUMMY_DATA.json" }, transformData);
  }, [sendRequest]);

  return (
    <Fragment>
      <header className="App-header">
        <h1>Marvel Finder</h1>
      </header>
      <main>
        {!isLoading && state.charactersList && (
          <CharacterList
            charactersList={state.charactersList}
            backButtonClickHandler={backButtonClickHandler}
            nextButtonClickHandler={nextButtonClickHandler}
            shouldShowPrevButton={state.shouldShowPrevButton}
            shouldShowNextButton={state.shouldShowNextButton}
            numberOfResults={state.numberOfResults}
            currentPage={state.currentPage}
          />
        )}
      </main>
      <footer>
        <p>Done by Pedro Gomes 2022-08-14</p>
      </footer>
    </Fragment>
  );
};

export default CharactersPage;
