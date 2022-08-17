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
import {
  createSearchParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import Spinner from "../components/Spinner";

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
  const { getDefaultURL } = useContext(Api);
  const { isLoading, error, sendRequest } = useHttp();
  const [searchParams, setSearchParams] = useSearchParams();
  const nodeRef = useRef<HTMLDivElement>(null); //Used by CSSTransitions

  const backButtonClickHandler = () => {
    setShouldShowFilters(false);
    prevButtonClick();
  };
  const nextButtonClickHandler = () => {
    setShouldShowFilters(false);
    nextButtonClick();
  };
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
    let currentSearchParams: Record<string, string> = {
      ...state.currentSearchParams,
    };

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

    sendRequest({ url: `${defaultURL}&${searchString}` }, transformData);
  }, [
    sendRequest,
    transformData,
    getDefaultURL,
    searchParams,
    setSearchParams,
    state.currentSearchParams,
    isFirstRun,
    setCurrentOffset,
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
