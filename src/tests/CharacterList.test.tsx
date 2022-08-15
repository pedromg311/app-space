import React from "react";
import { render, screen } from "@testing-library/react";
import Character from "../model/Character";
import CharacterList from "../components/CharacterList";
import * as DUMMY_DATA from "../../public/DUMMY_DATA.json";

const mockedData = DUMMY_DATA.data.results;
const CharacterListMock = mockedData.map(
  (characterData) => new Character({ ...characterData })
);

const renderList = (numberOfResults = 500, currentPage = 1) => {
  render(
    <CharacterList
      charactersList={CharacterListMock}
      backButtonClickHandler={() => {}}
      nextButtonClickHandler={() => {}}
      numberOfResults={numberOfResults}
      shouldShowPrevButton={false}
      shouldShowNextButton={false}
      currentPage={currentPage}
    />
  );
};

describe("[Component] Character List", () => {
  test("renders Character List component correctly", async () => {
    renderList();

    const listElements = await screen.findAllByRole("listitem");
    expect(listElements).toHaveLength(21);
  });
});

export {};
