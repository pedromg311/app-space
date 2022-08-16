import React, { useCallback, useContext, useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import useHttp from "../hooks/use-http";
import Character from "../model/Character";
import { APIResponse } from "../types/Character.d";
import { ListState } from "../types/CharacterList.d";
import { buttonAndPageReducer } from "../utils/_currentPage.utils";
import { Api } from "./api-data";

const initialState: ListState = {
  shouldShowPrevButton: false,
  shouldShowNextButton: true,
  currentPage: 1,
  currentSearchParams: { orderBy: "nameStartsWith" },
  numberOfResults: 0,
  currentOffset: 0,
  charactersList: null,
};

export const Characters = React.createContext<{
  state: ListState;
  error: string | null;
  isLoading: boolean;
  setCharactersList: (responseContent: APIResponse) => void;
  prevButtonClick: () => void;
  nextButtonClick: () => void;
  sortButtonClick: (sortBy: Record<string, string>) => void;
  getCharacterById: (id: number) => Character | null | undefined;
    }>({
      state: initialState,
      error: null,
      isLoading: false,
      setCharactersList: () => {},
      prevButtonClick: () => {},
      nextButtonClick: () => {},
      sortButtonClick: () => {},
      getCharacterById: () => null,
    });

export const CharactersProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [state, dispatch] = useReducer(buttonAndPageReducer, initialState);
  const { isLoading, error, sendRequest } = useHttp();
  const setSearchParams = useSearchParams()[1];
  const { getDefaultURL } = useContext(Api);

  const setCharactersList = useCallback((responseContent: APIResponse) => {
    dispatch({
      type: "SET_CHARACTER_LIST",
      payload: { responseContent },
    });
  }, []);

  const prevButtonClick = () => dispatch({ type: "PREV_CLICK" });
  const nextButtonClick = () => dispatch({ type: "NEXT_CLICK" });
  const sortButtonClick = (sortBy: Record<string, string>) =>
    dispatch({ type: "SET_SORT", payload: { sortBy } });

  const getCharacterById = (id: number) => {
    if (state.charactersList) {
      return state.charactersList.find(
        (character: Character) => character.id === id
      );
    }

    return null;
  };

  const transformData = useCallback(
    (responseContent: APIResponse) => {
      setCharactersList(responseContent);
    },
    [setCharactersList]
  );

  /**
   * Every time the reducer is called for anything other than the setList
   * the list is re-fetched. On a bigger application with a proper server that
   * i could control, maybe some of these fetches could be exchanged by storing
   * more state in memory
   */
  useEffect(() => {
    const defaultURL = getDefaultURL();
    const urlArgs = `&offset=${state.currentOffset}`;
    const searchParams = {
      ...state.currentSearchParams,
      offset: state.currentOffset.toString(),
    };

    setSearchParams(searchParams);

    sendRequest({ url: "DUMMY_DATA_PAGE_2.json" }, transformData);
    //sendRequest({ url: defaultURL + urlArgs }, transformData);
    console.log(defaultURL + urlArgs, state.currentOffset);
  }, [
    sendRequest,
    setSearchParams,
    transformData,
    getDefaultURL,
    state.currentOffset,
    state.currentSearchParams,
  ]);

  //FIXME: os search params tem de ser todos postos aqui
  // if (!currentOrderBy) {
  //   setSearchParams({ orderBy: sortingOptions.options[0].encodedName });
  // }

  return (
    <Characters.Provider
      value={{
        state,
        setCharactersList,
        prevButtonClick,
        nextButtonClick,
        getCharacterById,
        sortButtonClick,
        error,
        isLoading,
      }}
    >
      {props.children}
    </Characters.Provider>
  );
};
