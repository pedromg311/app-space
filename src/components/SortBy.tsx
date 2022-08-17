import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { SortOptions } from "../types/SortBy.d";

import classes from "../styles/components/SortBy.module.css";

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
  const [currentlyActiveIndex, setCurrentlyActiveIndex] = useState(-1);
  const currentOrderBy = searchParams.get("orderBy");
  let location = useLocation();

  useEffect(() => {
    let currentIndex = sortingOptions.findIndex((option) =>
      currentOrderBy?.includes(option.encodedName)
    );

    if (currentIndex === -1) {
      currentIndex = 0;
    }

    setCurrentlyActiveIndex(currentIndex);
  }, [currentOrderBy, location]);

  const handleButtonClick = (index: number) => {
    const { encodedName } = sortingOptions[index];
    const isSameSorting = currentOrderBy?.includes(encodedName);

    const orderBy = isSameSorting
      ? `${currentOrderBy?.includes("-") ? "" : "-"}${encodedName}`
      : encodedName;

    sortClickHandler({ orderBy });
  };

  return (
    <div className={classes["SortBy"]}>
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
