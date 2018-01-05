import React from "react";
import { createComponent } from "react-fela";

const boxRules = ({ size = 10 }) => ({
  width: size + "px",
  height: size + "px",
  backgroundColor: "red"
});

const Box = createComponent(boxRules);
export default Box;
