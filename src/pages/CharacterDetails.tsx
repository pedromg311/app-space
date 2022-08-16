import React, { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useHttp from "../hooks/use-http";
import Character from "../model/Character";
import { Characters } from "../store/character-data";
import { APIResponse } from "../types/Character.d";

import classes from "../styles/pages/CharacterDetails.module.css";
import CharacterDetailsList from "../components/CharacterDetailsList";

/**
 * Technically this component could be way linear
 * and just do an API call for the id of the character
 * (just like it does when a user lands on this page without passing
 * through /characters first), but this way we can save on network traffic
 *
 */
const CharacterDetails = () => {
  const { getCharacterById, state } = useContext(Characters);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(
    null
  );
  const { id: characterId } = useParams();
  const { isLoading, error, sendRequest } = useHttp();

  useEffect(() => {
    if (characterId) {
      if (!state.charactersList) {
        //FIXME: Replace with correct api call and no find needed
        sendRequest(
          { url: "/DUMMY_DATA.json" },
          async (responseContent: APIResponse) => {
            const characterResponse = responseContent.data.results.find(
              (character) => character.id === parseInt(characterId, 10)
            );

            if (characterResponse) {
              setCurrentCharacter(new Character(characterResponse));
            }
          }
        );
      } else {
        const characterDetails = getCharacterById(parseInt(characterId, 10));

        if (characterDetails) {
          setCurrentCharacter(characterDetails);
        }
      }
    }
  }, [characterId, getCharacterById, sendRequest, state.charactersList]);

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (currentCharacter) {
    return (
      <Fragment>
        <main className={classes["Character-details__main"]}>
          <h1 className={classes["Character-details__title"]}>
            {currentCharacter.name}
          </h1>
          <img
            className={classes["Character-details__image"]}
            alt={`An image of ${currentCharacter.name}`}
            src={`${currentCharacter.thumbnail.path}.${currentCharacter?.thumbnail.extension}`}
          />
          {currentCharacter.description && (
            <p className={classes["Character-details__description"]}>
              {currentCharacter.description}
            </p>
          )}

          {currentCharacter.comics.items.length > 0 && (
            <CharacterDetailsList
              characterList={currentCharacter.comics}
              title="Comics"
            />
          )}
          {currentCharacter.events.items.length > 0 && (
            <CharacterDetailsList
              characterList={currentCharacter.events}
              title="Events"
            />
          )}
          {currentCharacter.series.items.length > 0 && (
            <CharacterDetailsList
              characterList={currentCharacter.series}
              title="Series"
            />
          )}
          {currentCharacter.stories.items.length > 0 && (
            <CharacterDetailsList
              characterList={currentCharacter.stories}
              title="Stories"
            />
          )}
        </main>
        {currentCharacter.urls.length > 0 && (
          <footer className={classes["Character-details__footer"]}>
            <h3>Links</h3>
            <ul className={classes["Character-details__urls"]}>
              {currentCharacter.urls.map((url, index) => (
                <li
                  className={classes["Character-details__url"]}
                  key={url.url + index}
                >
                  <a
                    className={classes["Character-details__url-link"]}
                    href={url.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {url.type}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </Fragment>
    );
  }

  return <p>{error}</p>;
};

export default CharacterDetails;
