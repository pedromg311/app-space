import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SortOptions } from "../types/SortBy.d";

import classes from "../styles/components/SortBy.module.css";
import { Characters } from "../store/character-data";

const sortingOptions: SortOptions = [
  {
    name: "Name",
    encodedName: "name",
  },
  {
    name: "Modified",
    encodedName: "modified",
  },
];

/**
 * The only sorting options on the API
 * "name" && "modified". If there were more
 * options they would just need to be added here
 * and would follow the same logic.
 *
 * Since the webapp uses pagination, sorting on individual
 * pages is not very user friendly, so i just keep the API options
 */
const SortBy: React.FC<{
  sortClickHandler: (sortBy: Record<string, string>) => void;
}> = (props) => {
  const { sortClickHandler } = props;
  const [searchParams] = useSearchParams();
  const [currentlyActiveIndex, setCurrentlyActiveIndex] = useState(0);
  const currentOrderBy = searchParams.get("orderBy");
  const { state } = useContext(Characters);

  /**
   * Since the API returns values sorted by name,
   * i force name to be active when a sorting is not detected
   */
  useEffect(() => {
    let currentIndex = sortingOptions.findIndex((option) =>
      currentOrderBy?.includes(option.encodedName)
    );

    if (currentIndex === -1) {
      currentIndex = 0;
    }

    setCurrentlyActiveIndex(currentIndex);
  }, [currentOrderBy]);

  /**
   * Compares the clicked value to the one set either on the URL
   * or on the global state, to check if it should change sorting
   * or change sorting direction (if the same sort was chosen)
   */
  const handleButtonClick = (index: number) => {
    const { encodedName } = sortingOptions[index];
    let currentSearchParams = "";

    if (!currentOrderBy) {
      currentSearchParams = state.currentSearchParams.orderBy;
    } else {
      currentSearchParams = currentOrderBy;
    }

    const isSameSorting = currentSearchParams.includes(encodedName);

    const orderBy = isSameSorting
      ? `${currentSearchParams?.includes("-") ? "" : "-"}${encodedName}`
      : encodedName;

    setCurrentlyActiveIndex(index);
    sortClickHandler({ orderBy });
  };

  return (
    <div className={classes["SortBy"]} id="main">
      <p className={classes["SortBy__title"]}>Sort by:</p>
      <ul className={classes["SortBy__options"]}>
        {sortingOptions.map((option, index) => {
          return (
            <li className={classes["SortBy__options-item"]} key={option.name}>
              <button
                className={`${classes["SortBy__options-button"]} ${
                  currentlyActiveIndex == index
                    ? classes["SortBy__options-button--active"]
                    : ""
                }`}
                aria-label={`Sort by ${option.name}`}
                onClick={handleButtonClick.bind(null, index)}
              >
                {option.name}
              </button>
              <span className={classes["SortBy__options-button--direction"]}>
                {currentOrderBy?.includes("-") ? "↓" : "↑"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SortBy;
