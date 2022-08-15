export type SortOptions = {
  currentlyActiveIndex: number;
  options: {
    name: string;
    encodedName: string;
    isAsc?: boolean;
  }[];
};
