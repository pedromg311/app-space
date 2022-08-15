import React from "react";
import useInput from "../hooks/use-input";
import { formatValue, isValidIdsList } from "../utils/_filters.utils";

const Inputs: React.FC<{ onFiltersSubmit: (filters: string) => void }> = (
  props
) => {
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
      const filters = [];

      if (enteredName) {
        filters.push(`nameStartsWith=${formatValue(enteredName)}`);
      }
      if (comicsInputValues.value) {
        filters.push(`comics=${formatValue(comicsInputValues.value)}`);
      }
      if (seriesInputValues.value) {
        filters.push(`series=${formatValue(seriesInputValues.value)}`);
      }
      if (storiesInputValues.value) {
        filters.push(`stories=${formatValue(storiesInputValues.value)}`);
      }
      if (eventsInputValues.value) {
        filters.push(`events=${formatValue(eventsInputValues.value)}`);
      }

      if (filters.length === 0) {
        return;
      }

      props.onFiltersSubmit(filters.join("&"));

      resetNameInput();
      comicsInputValues.reset();
      seriesInputValues.reset();
      storiesInputValues.reset();
      eventsInputValues.reset();
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="name">Name starts with</label>
        <input
          type="text"
          id="name"
          value={enteredName}
          onChange={nameChangeHandler}
        />
      </div>
      {listInputs.map((list, index) => {
        return (
          <div key={`listFilter${index}`}>
            <label htmlFor={list.title}>{list.title}</label>
            <input
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

      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default Inputs;
