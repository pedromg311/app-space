import React, { Fragment, useCallback, useContext, useEffect } from "react";
import CharacterList from "../components/CharacterList";
import useHttp from "../hooks/use-http";
import { Api } from "../store/api-data";
import { Characters } from "../store/character-data";
import { APIResponse } from "../types/Character.d";

const CharactersPage = () => {
  const { apiKey } = useContext(Api);
  const { state, setCharactersList, prevButtonClick, nextButtonClick } =
    useContext(Characters);
  const { isLoading, error, sendRequest } = useHttp();

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

  useEffect(() => {
    sendRequest({ url: "DUMMY_DATA.json" }, transformData);
  }, [sendRequest, transformData]);

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
