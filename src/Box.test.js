import React from "react";
import PropTypes from "prop-types";
import Box from "./Box";
import shallow from "./felaShallow";

it("renders without crashing", () => {
  const container = shallow(<Box>hello</Box>);
  expect(container.snapshot().component).toMatchSnapshot();
  expect(container.snapshot().styles).toMatchSnapshot();
});
