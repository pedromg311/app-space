import React, { useCallback, useReducer } from "react";
import Character from "../model/Character";
import { APIResponse } from "../types/Character.d";
import { ListState } from "../types/CharacterList.d";
import { buttonAndPageReducer } from "../utils/_currentPage.utils";

const initialState: ListState = {
  shouldShowPrevButton: false,
  shouldShowNextButton: true,
  currentPage: 1,
  currentSearchParams: { orderBy: "name", offset: "0" },
  numberOfResults: 0,
  currentOffset: 0,
  charactersList: null,
};

export const Characters = React.createContext<{
  state: ListState;
  setCharactersList: (responseContent: APIResponse) => void;
  prevButtonClick: () => void;
  nextButtonClick: () => void;
  setSearchParamsState: (searchParams: Record<string, string>) => void;
  getCharacterById: (id: number) => Character | null | undefined;
    }>({
      state: initialState,
      setCharactersList: () => {},
      prevButtonClick: () => {},
      nextButtonClick: () => {},
      setSearchParamsState: () => {},
      getCharacterById: () => null,
    });

export const CharactersProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [state, dispatch] = useReducer(buttonAndPageReducer, initialState);
  const setCharactersList = useCallback((responseContent: APIResponse) => {
    dispatch({
      type: "SET_CHARACTER_LIST",
      payload: { responseContent },
    });
  }, []);

  const prevButtonClick = () => dispatch({ type: "PREV_CLICK" });
  const nextButtonClick = () => dispatch({ type: "NEXT_CLICK" });
  const setSearchParamsState = (newSearchParams: Record<string, string>) => {
    dispatch({ type: "SET_SEARCH_PARAMS", payload: { newSearchParams } });
  };

  const getCharacterById = (id: number) => {
    if (state.charactersList) {
      return state.charactersList.find(
        (character: Character) => character.id === id
      );
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
        setSearchParamsState,
      }}
    >
      {props.children}
    </Characters.Provider>
  );
};
