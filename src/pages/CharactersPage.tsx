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
import useHttp from "../hooks/use-http";
import { Api } from "../store/api-data";
import { Characters } from "../store/character-data";
import { APIResponse } from "../types/Character.d";

import { CSSTransition } from "react-transition-group";

import classes from "../styles/pages/ChangePages.module.css";

const CharactersPage = () => {
  const { apiKey } = useContext(Api);
  const { state, setCharactersList, prevButtonClick, nextButtonClick } =
    useContext(Characters);
  const { isLoading, error, sendRequest } = useHttp();
  const [shouldShowFilters, setShouldShowFilters] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null); //Used by CSSTransitions

  const transformData = useCallback(
    (responseContent: APIResponse) => {
      setCharactersList(responseContent);
    },
    [setCharactersList]
  );

  const backButtonClickHandler = () => {
    sendRequest({ url: "DUMMY_DATA.json" }, transformData);

    //prevButtonClick();
  };

  const nextButtonClickHandler = () => {
    const nextOffset = state.numberOfResultsPerPage + state.currentOffset;
    const urlArgs = `?offset=${nextOffset}&apikey=${apiKey}`;

    sendRequest({ url: "DUMMY_DATA_PAGE_2.json" }, transformData);

    //nextButtonClick();
  };

  const handleFiltersSubmit = (filters: string) => {
    console.log(filters);
    setShouldShowFilters(false);

    //sendRequest({ url: "DUMMY_DATA_PAGE_2.json" }, transformData);
  };

  const handleSortSubmit = useCallback((sortBy: string) => {
    console.log("oh no", sortBy);

    //sendRequest({ url: "DUMMY_DATA_PAGE_2.json" }, transformData);
  }, []);

  const handleOnClickToggle = () => {
    setShouldShowFilters((state) => !state);
  };

  const handleOnClickCancel = () => {
    setShouldShowFilters(false);
  };

  useEffect(() => {
    sendRequest({ url: "DUMMY_DATA.json" }, transformData);
  }, [sendRequest, transformData]);

  return (
    <Fragment>
      <header className={classes["App-header"]}>
        {/* Empty alt for decorative proposes only */}
        <img
          className={classes["App-header__logo"]}
          alt=""
          src="./Marvel_Banner.jpg"
        />
        <h1 className={classes["App-header__heading"]}>Marvel Finder</h1>
      </header>
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
