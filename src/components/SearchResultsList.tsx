import React from "react";

import "./SearchResultsList.css";
import SearchResult from "./SearchResult";

export const SearchResultsList = ({ results }: any) => {
  return (
    <div className="results-list">
      {results.map((result: any, id: number) => {
        return <SearchResult result={result} key={id} />;
      })}
    </div>
  );
};
