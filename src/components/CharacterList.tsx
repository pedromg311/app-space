import React, { Fragment, useEffect, useState } from "react";
import useHttp from "../hooks/use-http";
import Character from "../model/Character";
import { APICharacterData, APIResponse } from "../types/Character.d";

const numberOfResultsPerPage = 15;

const CharacterList: React.FC<{
  backButtonClickHandler: () => void;
  nextButtonClickHandler: () => void;
  charactersList: Character[];
  numberOfResults: { total: number; offset: number };
}> = (props) => {
  const [shouldShowPrevButton, setShouldShowPrevButton] = useState(false);
  const [shouldShowNextButton, setShouldShowNextButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { offset: currentOffset, total: totalResults } = props.numberOfResults;

  useEffect(() => {
    const numberOfStillAvailableItems =
      totalResults - currentOffset + numberOfResultsPerPage;
    const shouldShowNextButton =
      totalResults > numberOfResultsPerPage && numberOfStillAvailableItems > 0;

    setShouldShowPrevButton(currentOffset > 0);
    setShouldShowNextButton(shouldShowNextButton);
  }, [currentOffset, totalResults]);

  const nextButtonClickHandler = () => {
    setCurrentPage((state) => state + 1);
    props.nextButtonClickHandler();
  };

  const prevButtonClickHandler = () => {
    setCurrentPage((state) => (state - 1 <= 0 ? 0 : state - 1));
    props.backButtonClickHandler();
  };

  return (
    <Fragment>
      <ul>
        {props.charactersList.map((character) => (
          <li key={character.id}>{character.name}</li>
        ))}
      </ul>
      <div>
        {shouldShowPrevButton && (
          <button type="button" onClick={prevButtonClickHandler}>
            Prev
          </button>
        )}
        <p>{currentPage}</p>
        {shouldShowNextButton && (
          <button type="button" onClick={nextButtonClickHandler}>
            Next
          </button>
        )}
      </div>
      <p>Number of results: {totalResults}</p>
    </Fragment>
  );
};

export default CharacterList;
