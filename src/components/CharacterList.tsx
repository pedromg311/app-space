import React, { Fragment } from "react";
import Character from "../model/Character";

const CharacterList: React.FC<{
  backButtonClickHandler: () => void;
  nextButtonClickHandler: () => void;
  charactersList: Character[];
  numberOfResults: number;
  currentPage: number;
  shouldShowPrevButton: boolean;
  shouldShowNextButton: boolean;
}> = (props) => {
  return (
    <Fragment>
      <ul>
        {props.charactersList.map((character) => (
          <li key={character.id}>{character.name}</li>
        ))}
      </ul>
      <div>
        {props.shouldShowPrevButton && (
          <button type="button" onClick={props.backButtonClickHandler}>
            Prev
          </button>
        )}
        <p>Current page: {props.currentPage}</p>
        {props.shouldShowNextButton && (
          <button type="button" onClick={props.nextButtonClickHandler}>
            Next
          </button>
        )}
      </div>
      <p>Number of results: {props.numberOfResults}</p>
    </Fragment>
  );
};

export default CharacterList;
