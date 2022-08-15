import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useHttp from "../hooks/use-http";
import Character from "../model/Character";
import { Characters } from "../store/character-data";
import { APIResponse } from "../types/Character.d";

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
      <section>
        <h2>{currentCharacter?.name}</h2>
        <img
          alt=""
          src={`${currentCharacter?.thumbnail.path}.${currentCharacter?.thumbnail.extension}`}
        />
        <p>{currentCharacter?.description}</p>

        <h3>Comics</h3>
        <p>
          {currentCharacter?.comics.items.map((comic) => (
            <li key={comic}>{comic}</li>
          ))}
        </p>
        <h3>Events</h3>
        <p>
          {currentCharacter?.events.items.map((event) => (
            <li key={event}>{event}</li>
          ))}
        </p>
        <h3>Series</h3>
        <p>
          {currentCharacter?.series.items.map((series) => (
            <li key={series}>{series}</li>
          ))}
        </p>
        <h3>Stories</h3>
        <p>
          {currentCharacter?.stories.items.map((story) => (
            <li key={story}>{story}</li>
          ))}
        </p>
        <h3>URLS</h3>
        <p>
          {currentCharacter?.urls.map((url, index) => (
            <li key={url.url + index}>{url.url}</li>
          ))}
        </p>
      </section>
    );
  }

  return <p>{error}</p>;
};

export default CharacterDetails;
