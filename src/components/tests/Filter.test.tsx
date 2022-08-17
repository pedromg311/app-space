import React from "react";
import { act, fireEvent, render } from "@testing-library/react";

import Filter from "../Filters";

const filterSubmitHandler = jest.fn();

const setup = () => {
  const utils = render(
    <Filter onFiltersSubmit={filterSubmitHandler} onCancel={() => {}} />
  );
  const nameInput = utils.getByLabelText("Name starts with", { exact: false });
  const comicsInput = utils.getByLabelText("Comics", { exact: false });
  const seriesInput = utils.getByLabelText("Series", { exact: false });
  const storiesInput = utils.getByLabelText("Stories", { exact: false });
  const eventsInput = utils.getByLabelText("Events", { exact: false });

  const formButton = utils.getByRole("button", {
    name: "Toggle filters visibility",
  });

  return {
    nameInput,
    comicsInput,
    seriesInput,
    storiesInput,
    eventsInput,
    formButton,
    ...utils,
  };
};

describe("[Component] Character List", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders Filter component correctly", async () => {
    const { nameInput, comicsInput, seriesInput, storiesInput, eventsInput } =
      setup();

    expect(nameInput).toBeInTheDocument();
    expect(comicsInput).toBeInTheDocument();
    expect(seriesInput).toBeInTheDocument();
    expect(storiesInput).toBeInTheDocument();
    expect(eventsInput).toBeInTheDocument();
  });

  test("if comics is set correctly", async () => {
    const { comicsInput, formButton } = setup();

    fireEvent.change(comicsInput, { target: { value: "15,51" } });
    act(() => formButton.click());

    expect(filterSubmitHandler).toHaveBeenCalledWith({ comics: "15%2C51" });
  });

  test("if series is set correctly", async () => {
    const { seriesInput, formButton } = setup();

    fireEvent.change(seriesInput, { target: { value: "15,51" } });
    act(() => formButton.click());

    expect(filterSubmitHandler).toHaveBeenCalledWith({ series: "15%2C51" });
  });

  test("if stories is set correctly", async () => {
    const { storiesInput, formButton } = setup();

    fireEvent.change(storiesInput, { target: { value: "15,51" } });
    act(() => formButton.click());

    expect(filterSubmitHandler).toHaveBeenCalledWith({ stories: "15%2C51" });
  });

  test("if events is set correctly", async () => {
    const { eventsInput, formButton } = setup();

    fireEvent.change(eventsInput, { target: { value: "15,51" } });
    act(() => formButton.click());

    expect(filterSubmitHandler).toHaveBeenCalledWith({ events: "15%2C51" });
  });

  test("if startsWith is set correctly", async () => {
    const { nameInput, formButton } = setup();

    fireEvent.change(nameInput, { target: { value: "Spider-man" } });
    act(() => formButton.click());

    expect(filterSubmitHandler).toHaveBeenCalledWith({
      nameStartsWith: "Spider-man",
    });
  });

  test("if filter query is added correctly when using more than one", async () => {
    const { eventsInput, nameInput, formButton, storiesInput } = setup();

    fireEvent.change(eventsInput, { target: { value: "15,51" } });
    fireEvent.change(nameInput, { target: { value: "Iron Man" } });
    fireEvent.change(storiesInput, { target: { value: "20" } });

    act(() => formButton.click());

    expect(filterSubmitHandler).toHaveBeenCalledWith({
      events: "15%2C51",
      nameStartsWith: "Iron%20Man",
      stories: "20",
    });
  });
});

export {};
