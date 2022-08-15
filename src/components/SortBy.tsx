import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SortOptions } from "../types/SortBy.d";

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
  let [searchParams, setSearchParams] = useSearchParams();
  const [sortOptions, setSortOptions] = useState(sortingOptions);

  useEffect(() => {
    const currentOrderBy = searchParams.get("orderBy");

    let currentIndex = sortOptions.options.findIndex((option) =>
      currentOrderBy?.includes(option.encodedName)
    );

    if (currentIndex === -1) {
      currentIndex = 0;
    }

    if (!currentOrderBy) {
      setSearchParams({ orderBy: sortingOptions.options[0].encodedName });
    }

    setSortOptions((state) => ({ ...state, currentIndex }));
  }, [sortOptions.options, searchParams, setSearchParams]);

  const handleButtonClick = (index: number) => {
    const currentOrderBy = searchParams.get("orderBy");

    const { encodedName } = sortOptions.options[index];
    const isSameSorting = currentOrderBy?.includes(encodedName);

    const orderBy = isSameSorting
      ? `${currentOrderBy?.includes("-") ? "" : "-"}${encodedName}`
      : encodedName;

    setSearchParams({ orderBy }); //Enables link sharing
    sortClickHandler(`orderBy=${orderBy}`);
  };

  return (
    <div>
      <ul>
        {sortingOptions.options.map((option, index) => {
          //FIXME: fix classname
          return (
            <li
              className={
                sortingOptions.currentlyActiveIndex === index ? "active" : ""
              }
              key={option.name}
            >
              <button onClick={handleButtonClick.bind(null, index)}>
                {option.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SortBy;
