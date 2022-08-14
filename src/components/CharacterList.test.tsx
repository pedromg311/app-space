import React from "react";
import { act, render, screen } from "@testing-library/react";
import Character from "../model/Character";
import CharacterList from "./CharacterList";
import * as DUMMY_DATA from "../../public/DUMMY_DATA.json";

const mockedData = DUMMY_DATA.data.results;
const CharacterListMock = mockedData.map(
  (characterData) => new Character({ ...characterData, modified: new Date() })
);

const renderList = (numberOfResults = { total: 10, offset: 0 }) => {
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
    renderList();

    const listElements = await screen.findAllByRole("listitem");
    expect(listElements).toHaveLength(21);
  });

  test("renders next button when there is more content to see", () => {
    renderList({ total: 500, offset: 0 });

    const nextButton = screen.getByRole("button");
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveTextContent("Next");
  });

  test("renders previous button when there is more content to see", async () => {
    renderList({ total: 50, offset: 4 });

    const nextButton = screen.getByRole("button");
    act(() => nextButton.click());

    const prevButton = screen.getAllByRole("button")[0];
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toHaveTextContent("Prev");
  });

  test("doesn't render buttons when there isn't more content to see", () => {
    renderList({ total: 10, offset: 0 });

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  test("if when next button is clicked, current page increments", async () => {
    renderList({ total: 500, offset: 0 });

    const nextButton = screen.getByRole("button");
    act(() => nextButton.click());

    const currentPage = await screen.findByText("Current page: 2");
    expect(currentPage).toBeInTheDocument();
  });

  test("if when prev button is clicked, current page increments", async () => {
    renderList({ total: 50, offset: 4 });

    const nextButton = screen.getByRole("button");
    act(() => {
      nextButton.click();
      nextButton.click();
    });

    const prevButton = screen.getAllByRole("button")[0];
    act(() => prevButton.click());

    const currentPage = await screen.findByText("Current page: 2");
    expect(currentPage).toBeInTheDocument();
  });

  test("if when prev button is clicked, current page remains at zero", async () => {
    renderList({ total: 50, offset: 4 });

    const nextButton = screen.getByRole("button");
    act(() => nextButton.click());

    const prevButton = screen.getAllByRole("button")[0];
    act(() => prevButton.click());
    act(() => prevButton.click());

    const currentPage = await screen.findByText("Current page: 1");
    expect(currentPage).toBeInTheDocument();
  });
});

export {};
