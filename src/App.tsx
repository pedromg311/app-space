import React, { Fragment, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import CharactersPage from "./pages/CharactersPage";
import CharacterDetails from "./pages/CharacterDetails";
import "./App.css";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/characters" replace></Navigate>}
        />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/:id" element={<CharacterDetails />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Fragment>
  );
}

export default App;
