import React from "react";
import { render, screen } from "@testing-library/react";
import Character from "../model/Character";
import CharacterList from "./CharacterList";
import * as DUMMY_DATA from "../../public/DUMMY_DATA.json";

const mockedData = DUMMY_DATA.data.results;
const CharacterListMock = mockedData.map(
  (characterData) => new Character({ ...characterData, modified: new Date() })
);

const renderList = (numberOfResults: { total: number; offset: number }) => {
  render(
    <CharacterList
      charactersList={CharacterListMock}
      backButtonClickHandler={() => {}}
      nextButtonClickHandler={() => {}}
      numberOfResults={numberOfResults}
    />
  );
};

describe("[Component] Character List", () => {
  test("renders Character List component correctly", async () => {
    renderList({ total: 10, offset: 0 });

    const listElements = await screen.findAllByRole("listitem");
    expect(listElements).toHaveLength(21);
  });

  test("renders next button when there is more content to see", () => {
    renderList({ total: 500, offset: 0 });

    const nextButton = screen.getByRole("button");
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveTextContent("Next");
  });

  test("renders previous button when there is more content to see", () => {
    renderList({ total: 5, offset: 4 });

    const nextButton = screen.getByRole("button");
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveTextContent("Prev");
  });

  test("doesn't render buttons when there isn't more content to see", () => {
    renderList({ total: 10, offset: 0 });

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});

export {};
