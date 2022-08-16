import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Character from "../model/Character";

import classes from "../styles/components/CharacterList.module.css";

const CharacterList: React.FC<{
  backButtonClickHandler: () => void;
  nextButtonClickHandler: () => void;
  charactersList: Character[];
  currentPage: number;
  shouldShowPrevButton: boolean;
  shouldShowNextButton: boolean;
}> = (props) => {
  return (
    <Fragment>
      <ul className={classes["Character-List"]}>
        {props.charactersList.map((character) => (
          <li className={classes["Character-List__item"]} key={character.id}>
            <NavLink
              to={`${character.id}`}
              className={classes["Character-List__item-content"]}
            >
              <img
                className={classes["Character-List__item-image"]}
                alt=""
                src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              />
              <div className={classes["Character-List__item-info"]}>
                <p
                  className={classes["Character-List__item-name"]}
                  aria-label={`A card with an image of ${character.name}`}
                >
                  {character.name}
                </p>
                {character.comics.available !== 0 && (
                  <p>Appears in {character.comics.available} comics!</p>
                )}
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={classes["Character-List__controls"]}>
        {props.shouldShowPrevButton && (
          <button
            className={classes["Character-List__controls-button"]}
            type="button"
            onClick={props.backButtonClickHandler}
          >
            {"<<"}
          </button>
        )}
        {(props.shouldShowPrevButton || props.shouldShowNextButton) && (
          <p className={classes["Character-List__controls-info"]}>
            Current page: {props.currentPage}
          </p>
        )}
        {props.shouldShowNextButton && (
          <button
            className={classes["Character-List__controls-button"]}
            type="button"
            onClick={props.nextButtonClickHandler}
          >
            {">>"}
          </button>
        )}
      </div>
    </Fragment>
  );
};

export default CharacterList;
