import React from "react";
import { render, screen } from "@testing-library/react";
import Character from "../../model/Character";
import CharacterList from "../CharacterList";
import * as DUMMY_DATA from "../../../public/DUMMY_DATA.json";
import { BrowserRouter } from "react-router-dom";

const mockedData = DUMMY_DATA.data.results;
const CharacterListMock = mockedData.map(
  (characterData) => new Character({ ...characterData })
);

const renderList = (currentPage = 1) => {
  render(
    <BrowserRouter>
      <CharacterList
        charactersList={CharacterListMock}
        backButtonClickHandler={() => {}}
        nextButtonClickHandler={() => {}}
        shouldShowPrevButton={false}
        shouldShowNextButton={false}
        currentPage={currentPage}
      />
    </BrowserRouter>
  );
};

describe("[Component] Character List", () => {
  test("renders Character List component correctly", async () => {
    renderList();

    const listElements = await screen.findAllByRole("listitem");
    expect(listElements).toHaveLength(11);
  });
});

export {};
