import React, { useCallback, useReducer } from "react";
import useHttp from "../hooks/use-http";
import Character from "../model/Character";
import { APIResponse } from "../types/Character.d";
import { ListState } from "../types/CharacterList.d";
import { buttonAndPageReducer } from "../utils/_currentPage.utils";

const initialState: ListState = {
  shouldShowPrevButton: false,
  shouldShowNextButton: true,
  currentPage: 1,
  numberOfResults: 0,
  currentOffset: 0,
  numberOfResultsPerPage: 11,
  charactersList: null,
};

export const Characters = React.createContext<{
  state: ListState;
  setCharactersList: (responseContent: APIResponse) => void;
  prevButtonClick: () => void;
  nextButtonClick: () => void;
  getCharacterById: (id: number) => Character | null | undefined;
    }>({
      state: initialState,
      setCharactersList: () => {},
      prevButtonClick: () => {},
      nextButtonClick: () => {},
      getCharacterById: () => null,
    });

export const CharactersProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  /**
   * Not strictly necessary to user a reducer here, but i want current page
   * to affect the state of the previous button, instead of doing currentOffset > 0
   */
  const [state, dispatch] = useReducer(buttonAndPageReducer, initialState);
  const { isLoading, error, sendRequest } = useHttp();

  const setCharactersList = useCallback((responseContent: APIResponse) => {
    dispatch({
      type: "SET_CHARACTER_LIST",
      payload: { responseContent },
    });
  }, []);

  const prevButtonClick = () => dispatch({ type: "PREV_CLICK" });

  const nextButtonClick = () => dispatch({ type: "NEXT_CLICK" });

  const getCharacterById = (id: number) => {
    if (state.charactersList) {
      return state.charactersList.find((character) => character.id === id);
    }

    return null;
  };

  return (
    <Characters.Provider
      value={{
        state,
        setCharactersList,
        prevButtonClick,
        nextButtonClick,
        getCharacterById,
      }}
    >
      {props.children}
    </Characters.Provider>
  );
};
