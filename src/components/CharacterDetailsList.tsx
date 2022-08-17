import React, { Fragment } from "react";

import classes from "../styles/components/CharacterDetailsList.module.css";
import { TransformedCharacterType } from "../types/Character.d";

const CharacterDetailsList: React.FC<{
  characterList: TransformedCharacterType;
  title: string;
}> = (props) => {
  return (
    <section className={classes["Character__section"]}>
      <h3 className={classes["Character__section-title"]}>{props.title}</h3>
      <ul>
        {props.characterList.items.map((listItem, index) => (
          <Fragment key={listItem + index}>
            <li className={classes["Character__list-item"]}>{listItem}</li>
            <hr className={classes["Character__list-separator"]} />
          </Fragment>
        ))}
      </ul>
    </section>
  );
};

export default CharacterDetailsList;
