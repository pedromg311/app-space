import React, { Fragment, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import CharactersPage from "./pages/CharactersPage";
import PageNotFound from "./pages/PageNotFound";
import { CharactersProvider } from "./store/character-data";
import { ApiProvider } from "./store/api-data";

import classes from "./styles/App.module.css";
import Spinner from "./components/Spinner";
import { MAIN_PATH } from "./configs/_app-wide";

const CharacterDetails = React.lazy(() => import("./pages/CharacterDetails"));
function App() {
  return (
    <Fragment>
      <header className={classes["App-header"]}>
        {/* Empty alt for decorative proposes only */}
        <img
          className={classes["App-header__logo"]}
          alt=""
          src="/Marvel_Banner.jpg"
        />
        <h1 className={classes["App-header__heading"]}>Marvel Finder</h1>
      </header>
      <ApiProvider>
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
      </ApiProvider>
    </Fragment>
  );
}

export default App;
