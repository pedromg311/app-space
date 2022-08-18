import React, { Fragment, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { CharactersProvider } from "./store/character-data";

import classes from "./styles/App.module.css";
import Spinner from "./components/Spinner";
import { MAIN_PATH } from "./configs/_app-wide";

/**
 * Lazy loading the first page might be a bit redundant since most people would land there
 * but technically a user can start on a character details page and not need the main one
 * */
const CharactersPage = React.lazy(() => import("./pages/CharactersPage"));
const CharacterDetails = React.lazy(() => import("./pages/CharacterDetails"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));

function App() {
  return (
    <Fragment>
      <header className={classes["App-header"]}>
        <div className={classes["App-header__wrapper"]}>
          {/* Empty alt for decorative proposes only */}
          <img
            className={classes["App-header__logo"]}
            alt=""
            src="/Marvel_Banner.jpg"
          />
          <h1 className={classes["App-header__heading"]}>Marvel Finder</h1>
        </div>
      </header>
      <CharactersProvider>
        <Suspense
          fallback={
            <div className={classes["App-loading__container"]}>
              <Spinner />
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={<Navigate to={MAIN_PATH} replace></Navigate>}
            />
            <Route path={MAIN_PATH} element={<CharactersPage />} />
            <Route path={`${MAIN_PATH}/:id`} element={<CharacterDetails />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </CharactersProvider>
    </Fragment>
  );
}

export default App;
