import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import CharacterList from "../components/CharacterList";
import Filters from "../components/Filters";
import SortBy from "../components/SortBy";
import { Api } from "../store/api-data";
import { Characters } from "../store/character-data";

import { CSSTransition } from "react-transition-group";

import classes from "../styles/pages/CharactersPage.module.css";
import { APIResponse } from "../types/Character.d";
import useHttp from "../hooks/use-http";
import { useLocation, useSearchParams } from "react-router-dom";

const CharactersPage = () => {
  const {
    state,
    prevButtonClick,
    nextButtonClick,
    setSearchParamsState,
    setCharactersList,
  } = useContext(Characters);
  const [shouldShowFilters, setShouldShowFilters] = useState(false);
  const { getDefaultURL } = useContext(Api);
  const { isLoading, error, sendRequest } = useHttp();
  const setSearchParams = useSearchParams()[1];
  const location = useLocation();
  const nodeRef = useRef<HTMLDivElement>(null); //Used by CSSTransitions

  const backButtonClickHandler = () => prevButtonClick();
  const nextButtonClickHandler = () => nextButtonClick();
  const handleSortSubmit = useCallback(
    (sortBy: Record<string, string>) => setSearchParamsState(sortBy),
    [setSearchParamsState]
  );

  const handleFiltersSubmit = (filters: Record<string, string>) => {
    setShouldShowFilters(false);
    setSearchParamsState(filters);
  };

  const handleOnClickToggle = () => {
    setShouldShowFilters((state) => !state);
  };

  const handleOnClickCancel = () => {
    setShouldShowFilters(false);
  };

  const transformData = useCallback(
    (responseContent: APIResponse) => setCharactersList(responseContent),
    [setCharactersList]
  );

  /**
   * Every time the reducer is called for anything other than the setList
   * the list is re-fetched. On a bigger application with a proper server that
   * i could control, maybe some of these fetches could be exchanged by storing
   * more state in memory
   */
  useEffect(() => {
    let currentSearchParams: Record<string, string> = {};
    let currentLocation = location.search;

    currentLocation = currentLocation.substring(1);
    const searchParamsArray = currentLocation.split("&");

    searchParamsArray.forEach((param) => {
      const [key, value] = param.split("=");
      currentSearchParams[key] = value;
    });

    setSearchParams({ ...currentSearchParams, ...state.currentSearchParams });
    console.log("merged", currentSearchParams);

    const defaultURL = getDefaultURL();

    sendRequest({ url: "DUMMY_DATA.json" }, transformData);
    //FIXME: build url with search params
    //sendRequest({ url: defaultURL + urlArgs }, transformData);
  }, [
    sendRequest,
    setSearchParams,
    transformData,
    getDefaultURL,
    state.currentSearchParams,
    location.search,
  ]);

  return (
    <Fragment>
      <main className={classes["App-main"]}>
        {!error && (
          <Fragment>
            <CSSTransition
              in={shouldShowFilters}
              timeout={1000}
              classNames="App-main__filter-container"
              nodeRef={nodeRef}
            >
              <div
                className={classes["App-main__filter-container"]}
                ref={nodeRef}
              >
                <Filters
                  onFiltersSubmit={handleFiltersSubmit}
                  onCancel={handleOnClickCancel}
                />
                <div className={classes["App-main__filter"]}>
                  <button
                    className={`${classes["App-main__filter-button"]} App__button--primary`}
                    onClick={handleOnClickToggle.bind(null, shouldShowFilters)}
                  >
                    {shouldShowFilters ? "Close" : "Open Filters"}
                  </button>
                </div>
              </div>
            </CSSTransition>

            <div className={classes["App-main__list-heading"]}>
              <SortBy sortClickHandler={handleSortSubmit} />
              <p className={classes["App-main__list-results"]}>
                Results: {state.numberOfResults}
              </p>
            </div>
            {!isLoading && state.charactersList && (
              <CharacterList
                charactersList={state.charactersList}
                backButtonClickHandler={backButtonClickHandler}
                nextButtonClickHandler={nextButtonClickHandler}
                shouldShowPrevButton={state.shouldShowPrevButton}
                shouldShowNextButton={state.shouldShowNextButton}
                currentPage={state.currentPage}
              />
            )}
          </Fragment>
        )}
        {error && (
          <p className={classes["App-main__error"]}>
            Something went wrong whilst fetching the List. Please try again
            later
          </p>
        )}
      </main>
      <footer className={classes["App-footer"]}>
        <small>Done by Pedro Gomes</small>
      </footer>
    </Fragment>
  );
};

export default CharactersPage;
