import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SortOptions } from "../types/SortBy.d";

import classes from "../styles/components/SortBy.module.css";

const sortingOptions: SortOptions = {
  currentlyActiveIndex: -1,
  options: [
    {
      name: "Name",
      encodedName: "nameStartsWith",
      isAsc: undefined,
    },
    {
      name: "Modified",
      encodedName: "modified",
      isAsc: undefined,
    },
  ],
};

/**
 * The only sorting options on the API
 * "name" && "modified". If there were more
 * options they would just need to be added here
 * and would follow the same logic.
 *
 * Since the webapp uses pagination, sorting on individual
 * pages is not very user friendly, so i just keep the API options
 */
const SortBy: React.FC<{ sortClickHandler: (sortBy: string) => void }> = (
  props
) => {
  const { sortClickHandler } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOptions, setSortOptions] = useState(sortingOptions);
  const currentOrderBy = searchParams.get("orderBy");

  useEffect(() => {
    let currentIndex = sortOptions.options.findIndex((option) =>
      currentOrderBy?.includes(option.encodedName)
    );

    if (currentIndex === -1) {
      currentIndex = 0;
    }

    if (!currentOrderBy) {
      setSearchParams({ orderBy: sortingOptions.options[0].encodedName });
    }

    setSortOptions((state) => ({
      ...state,
      currentlyActiveIndex: currentIndex,
    }));
  }, [sortOptions.options, searchParams, setSearchParams, currentOrderBy]);

  const handleButtonClick = (index: number) => {
    const { encodedName } = sortOptions.options[index];
    const isSameSorting = currentOrderBy?.includes(encodedName);

    const orderBy = isSameSorting
      ? `${currentOrderBy?.includes("-") ? "" : "-"}${encodedName}`
      : encodedName;

    setSearchParams({ orderBy }); //Enables link sharing
    sortClickHandler(`orderBy=${orderBy}`);
  };

  console.log(sortOptions.currentlyActiveIndex);
  return (
    <div className={classes["SortBy"]}>
      <p className={classes["SortBy__title"]}>Sort by:</p>
      <ul className={classes["SortBy__options"]}>
        {sortOptions.options.map((option, index) => {
          return (
            <li className={classes["SortBy__options-item"]} key={option.name}>
              <button
                className={`${classes["SortBy__options-button"]} ${
                  sortOptions.currentlyActiveIndex == index
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
