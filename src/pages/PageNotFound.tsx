import React from "react";

import classes from "../styles/pages/PageNotFound.module.css";

const PageNotFound = () => {
  return (
    <section className={classes["Not-found"]}>
      <h1>Page not found :(</h1>
      <small>We are a really small website</small>
    </section>
  );
};

export default PageNotFound;
