import React from "react";
import { act, render, screen } from "@testing-library/react";
import * as DUMMY_DATA from "../../../public/DUMMY_DATA.json";
import CharactersPage from "../CharactersPage";
import { BrowserRouter } from "react-router-dom";
import { CharactersProvider } from "../../store/character-data";

describe("[Page] Characters Page", () => {
  beforeAll(() => {
    global.fetch = jest.fn() as jest.Mock;
    (global.fetch as jest.Mock).mockReturnValue({
      ok: true,
      json: () => Promise.resolve(DUMMY_DATA),
    });
  });
  beforeEach(() =>
    act(() => {
      render(
        <BrowserRouter>
          <CharactersProvider>
            <CharactersPage />
          </CharactersProvider>
        </BrowserRouter>
      );
    })
  );
  afterAll(() => jest.resetAllMocks());
  test("renders Character Page component correctly", async () => {
    const listElements = await screen.findAllByRole("listitem");
    const header = screen.getByText("Marvel Finder");
    const footer = screen.getByText("Done by Pedro Gomes 2022-08-14");

    expect(listElements).toHaveLength(11);
    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  test("renders next button when there is more content to see", () => {
    const nextButton = screen.getByRole("button");

    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveTextContent("Next");
  });

  test("renders previous button when there is more content to see", async () => {
    /**
     * Mock second fetch after button click. First fetch is already mocked by
     * the beforeAll function.
     */
    (global.fetch as jest.Mock).mockReturnValue({
      ok: true,
      json: () =>
        Promise.resolve({
          ...DUMMY_DATA,
          data: { ...DUMMY_DATA.data, offset: 20 },
        }),
    });

    const nextButton = screen.getByRole("button");
    act(() => nextButton.click());

    const buttons = await screen.findAllByRole("button");
    const prevButton = buttons[0];
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toHaveTextContent("Prev");
  });
});

export {};
