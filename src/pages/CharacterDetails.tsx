import React, { Fragment, useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import useHttp from "../hooks/use-http";
import Character from "../model/Character";
import { Characters } from "../store/character-data";
import { APIResponse } from "../types/Character.d";

import classes from "../styles/pages/CharacterDetails.module.css";
import CharacterDetailsList from "../components/CharacterDetailsList";
import Spinner from "../components/Spinner";
import { API_KEY, DEFAULT_URL, MAIN_PATH } from "../configs/_app-wide";

/**
 * Technically this component could be way linear
 * and just do an API call for the id of the character
 * (just like it does when a user lands on this page without passing
 * through /characters first), but this way we can save on network traffic
 *
 */
const CharacterDetails: React.FC = (props) => {
  const location = useLocation();
  const { getCharacterById, state } = useContext(Characters);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(
    null
  );
  const { id: characterId } = useParams();
  const { isLoading, error, sendRequest } = useHttp();
  const [prevLocation, setPrevLocation] = useState(MAIN_PATH);

  useEffect(() => {
    if (characterId) {
      if (!state.charactersList) {
        const url = `${DEFAULT_URL}/${characterId}?${API_KEY}`;

        sendRequest({ url }, async (responseContent: APIResponse) => {
          setCurrentCharacter(new Character(responseContent.data.results[0]));
        });
      } else {
        const characterDetails = getCharacterById(parseInt(characterId, 10));

        if (characterDetails) {
          setCurrentCharacter(characterDetails);
        }
      }
    }

    if (location.state) {
      const locationState = (
        location.state as Location & { prevPath: Location }
      ).prevPath;
      setPrevLocation(locationState.pathname + locationState.search);
    }
  }, [
    characterId,
    getCharacterById,
    sendRequest,
    state.charactersList,
    setPrevLocation,
    location.state,
    location,
  ]);

  if (isLoading) {
    return <Spinner />;
  }

  if (currentCharacter) {
    return (
      <Fragment>
        {!isLoading && !error && (
          <Fragment>
            <main className={classes["Character-details__main"]}>
              <div className={classes["Character-details__header"]}>
                <NavLink
                  to={prevLocation}
                  className={classes["Character-details__header-link"]}
                >
                  {"<"}
                </NavLink>
                <h1 className={classes["Character-details__title"]}>
                  {currentCharacter.name}
                </h1>
              </div>
              <div className={classes["Character-details__content-grid"]}>
                <img
                  className={classes["Character-details__image"]}
                  alt={`An image of ${currentCharacter.name}`}
                  src={`${currentCharacter.thumbnail.path}.${currentCharacter?.thumbnail.extension}`}
                />

                {/*Sometimes an invisible character is return */}
                {currentCharacter.description.length > 1 && (
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
              </div>
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
            )}{" "}
          </Fragment>
        )}
      </Fragment>
    );
  }

  return (
    <p className="App-load__error">
      Something went wrong whilst fetching the List. Please try again later
    </p>
  );
};

export default CharacterDetails;
