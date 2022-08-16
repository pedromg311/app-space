import React, { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import CharactersPage from "./pages/CharactersPage";
import CharacterDetails from "./pages/CharacterDetails";
import PageNotFound from "./pages/PageNotFound";
import { CharactersProvider } from "./store/character-data";
import { ApiProvider } from "./store/api-data";

import classes from "./styles/App.module.css";

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
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/characters" replace></Navigate>}
            />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/characters/:id" element={<CharacterDetails />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </CharactersProvider>
      </ApiProvider>
    </Fragment>
  );
}

export default App;
