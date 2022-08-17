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
import { Characters } from "../store/character-data";

import { CSSTransition } from "react-transition-group";

import classes from "../styles/pages/CharactersPage.module.css";
import { APIResponse } from "../types/Character.d";
import useHttp from "../hooks/use-http";
import { createSearchParams, useSearchParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getDefaultURL } from "../configs/_app-wide";

const CharactersPage = () => {
  const {
    state,
    prevButtonClick,
    nextButtonClick,
    setSearchParamsState,
    setCharactersList,
    setCurrentOffset,
    isFirstRun,
  } = useContext(Characters);
  const [shouldShowFilters, setShouldShowFilters] = useState(false);

  /**
   * Enables the user to get back to the previous page without having
   * to refetch the main list (unnecessary network call)
   */
  const [shouldReFetch, setShouldReFetch] = useState(false);
  const { isLoading, error, sendRequest } = useHttp();
  const [searchParams, setSearchParams] = useSearchParams();
  const nodeRef = useRef<HTMLDivElement>(null); //Used by CSSTransitions

  const backButtonClickHandler = () => {
    setShouldShowFilters(false);
    setShouldReFetch(true);
    prevButtonClick();
  };
  const nextButtonClickHandler = () => {
    setShouldShowFilters(false);
    setShouldReFetch(true);
    nextButtonClick();
  };
  const handleSortSubmit = (sortBy: Record<string, string>) => {
    setShouldReFetch(true);
    setSearchParamsState(sortBy);
  };
  const handleFiltersSubmit = (filters: Record<string, string>) => {
    setShouldShowFilters(false);
    setShouldReFetch(true);
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

  useEffect(() => {
    if (shouldReFetch || isFirstRun?.current) {
      let currentSearchParams: Record<string, string> = {
        ...state.currentSearchParams,
      };

      /**
       * Get the current search params in case this was a shared link
       * e.g. List already filtered on page 4
       */
      if (isFirstRun?.current) {
        searchParams.forEach((value, key) => {
          currentSearchParams[key] = value;

          if (key === "offset" && value !== "0") {
            setCurrentOffset(+currentSearchParams[key]);
          }
        });
      } else {
        setSearchParams(currentSearchParams);
      }

      const defaultURL = getDefaultURL();
      const searchString = createSearchParams(currentSearchParams).toString();

      setShouldReFetch(false);
      sendRequest({ url: `${defaultURL}&${searchString}` }, transformData);
    }
  }, [
    sendRequest,
    transformData,
    searchParams,
    setSearchParams,
    state.currentSearchParams,
    isFirstRun,
    shouldReFetch,
    setCurrentOffset,
  ]);

  /**
   * Added a skip to content for keyboard users
   */
  return (
    <Fragment>
      <a className={classes["App-main__skip-to-content"]} href="#main">
        Skip to content
      </a>
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
            {isLoading && <Spinner />}
          </Fragment>
        )}
        {error && (
          <p className="App-load__error">
            Something went wrong whilst fetching the List. Please try again
            later
          </p>
        )}
      </main>
      {!isLoading && !error && (
        <footer className={classes["App-footer"]}>
          <small>Done by Pedro Gomes</small>
        </footer>
      )}
    </Fragment>
  );
};

export default CharactersPage;
