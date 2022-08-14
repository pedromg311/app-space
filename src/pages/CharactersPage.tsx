import React, { Fragment, useEffect, useState } from "react";
import CharacterList from "../components/CharacterList";
import useHttp from "../hooks/use-http";
import Character from "../model/Character";
import { APICharacterData, APIResponse } from "../types/Character.d";

const CharactersPage = () => {
  const [charactersList, setCharactersList] = useState<Character[]>([]);
  const [numberOfResults, setNumberOfResults] = useState<{
    total: number;
    offset: number;
  }>({
    total: 0,
    offset: 0,
  });
  const { isLoading, error, sendRequest } = useHttp();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("DUMMY_DATA.json");
      const responseContent: APIResponse = await response.json();

      const character = responseContent.data.results.map(
        (characterData: APICharacterData) => new Character(characterData)
      );

      setNumberOfResults({ ...responseContent.data });
      setCharactersList(character);

      //FIXME: remove pls
      console.log(character);
    };

    fetchData();
  }, []);

  const backButtonClickHandler = () => {};

  const nextButtonClickHandler = () => {};

  return (
    <Fragment>
      <header className="App-header">
        <h1>Marvel Finder</h1>
      </header>
      <main>
        <CharacterList
          charactersList={charactersList}
          backButtonClickHandler={backButtonClickHandler}
          nextButtonClickHandler={nextButtonClickHandler}
          numberOfResults={numberOfResults}
        />
      </main>
      <footer>
        <p>Done by Pedro Gomes 2022-08-14</p>
      </footer>
    </Fragment>
  );
};

export default CharactersPage;
