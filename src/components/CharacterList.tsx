import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
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
          <li className="test-class" key={character.id}>
            <NavLink to={`${character.id}`}>
              {character.name} {character.modified}
            </NavLink>
          </li>
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
