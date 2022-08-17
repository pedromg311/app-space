import React from "react";
import { ReactComponent as SpinnerSVG } from "../assets/spinner.svg";

import classes from "../styles/components/Spinner.module.css";

const Spinner = () => {
  return (
    <div className={classes.Spinner__container}>
      <SpinnerSVG className={classes.Spinner__icon} />
    </div>
  );
};

export default Spinner;
