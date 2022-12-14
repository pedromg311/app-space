import React from "react";
import useInput from "../hooks/use-input";
import { formatValue, isValidIdsList } from "../utils/_filters.utils";

import classes from "../styles/components/Filter.module.css";

const Inputs: React.FC<{
  onFiltersSubmit: (filters: Record<string, string>) => void;
  onCancel: () => void;
}> = (props) => {
  const {
    value: enteredName,
    reset: resetNameInput,
    valueChangeHandler: nameChangeHandler,
  } = useInput();
  const comicsInputValues = useInput("Comics", isValidIdsList);
  const seriesInputValues = useInput("Series", isValidIdsList);
  const storiesInputValues = useInput("Stories", isValidIdsList);
  const eventsInputValues = useInput("Events", isValidIdsList);

  const listInputs = [
    comicsInputValues,
    seriesInputValues,
    storiesInputValues,
    eventsInputValues,
  ];

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      comicsInputValues.isValid &&
      seriesInputValues.isValid &&
      storiesInputValues.isValid &&
      eventsInputValues.isValid
    ) {
      const filters: Record<string, string> = {};

      if (enteredName) {
        filters.nameStartsWith = formatValue(enteredName);
      }
      if (comicsInputValues.value) {
        filters.comics = formatValue(comicsInputValues.value);
      }
      if (seriesInputValues.value) {
        filters.series = formatValue(seriesInputValues.value);
      }
      if (storiesInputValues.value) {
        filters.stories = formatValue(storiesInputValues.value);
      }
      if (eventsInputValues.value) {
        filters.events = formatValue(eventsInputValues.value);
      }

      /**
       * Filters are allowed to be empty, so that the user can
       * reset the filters list.
       */
      props.onFiltersSubmit(filters);

      resetNameInput();
      comicsInputValues.reset();
      seriesInputValues.reset();
      storiesInputValues.reset();
      eventsInputValues.reset();
    }
  };

  return (
    <div className={classes["Filter"]}>
      <p className={classes["Filter__hint"]}>Leave empty to reset list</p>
      <form
        className={classes["Filter__form"]}
        onSubmit={submitHandler}
        aria-label="Filter Characters List"
      >
        <div className={classes["Filter__item"]}>
          <label className={classes["Filter__item-label"]} htmlFor="name">
            Name starts with:
          </label>
          <input
            className={classes["Filter__item-input"]}
            type="text"
            id="name"
            value={enteredName}
            onChange={nameChangeHandler}
          />
        </div>
        {listInputs.map((list, index) => {
          return (
            <div className={classes["Filter__item"]} key={`listFilter${index}`}>
              <label
                className={classes["Filter__item-label"]}
                htmlFor={list.title}
              >
                {list.title}:
              </label>
              <input
                aria-label="Insert ids, separated by ,"
                className={classes["Filter__item-input"]}
                type="text"
                id={list.title}
                value={list.value}
                onChange={list.valueChangeHandler}
                onBlur={list.inputBlurHandler}
                placeholder="id, id, ..."
              />
              {list.hasError && <p> Please enter a list of ids </p>}
            </div>
          );
        })}

        <div className={classes["Filter__controls"]}>
          <button
            aria-label="Toggle filters visibility"
            className={`App__button--primary ${classes["Filter__controls-button"]}`}
            type="submit"
          >
            Filter
          </button>
        </div>
      </form>
    </div>
  );
};

export default Inputs;
