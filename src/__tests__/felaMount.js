import React from "react";
import PropTypes from "prop-types";
import { createRenderer } from "fela";
import felaMount from "../felaMount";
import { createComponent } from "react-fela";
import applyTheme from "../applyTheme";
import theme from "../variables";

const Box = ({ name, className }) => {
  return <div className={className}> {name} </div>;
};

Box.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string
};

export const boxRules = ({ size = 10, theme }) => {
  return {
    width: size + "px",
    height: size + "px",
    color: theme.color.grass,
    backgroundColor: theme.foo,
    fontSize: theme.fontSize
  };
};

export const innerBoxRules = ({ size = 10, theme }) => {
  return {
    backgroundColor: theme.color.grass,
    width: size + "px",
    height: size + "px"
  };
};

const themeBoxRules = theme => {
  return {
    foo: theme.color.black
  };
};

const extraThemeBoxRules = theme => {
  return {
    fontSize: theme.fontSizes[0]
  };
};

const UnstyledBox = createComponent(boxRules, Box, ["name"]);
const StyledBox = applyTheme(UnstyledBox, themeBoxRules, extraThemeBoxRules);
const InnerStyledBox = applyTheme(UnstyledBox, themeBoxRules);
const InnerBox = createComponent(innerBoxRules);
const NoBox = createComponent(boxRules);

describe("felaMount", () => {
  it("Mount snapshot", () => {
    const { wrapper, snapshot } = felaMount(
      <StyledBox>
        <InnerStyledBox>
          <InnerBox>hello</InnerBox>
          <InnerBox>hello</InnerBox>
        </InnerStyledBox>
      </StyledBox>,
      createRenderer,
      theme
    );

    expect(snapshot(wrapper)).toMatchSnapshot("Mounted");

    //take a snapshot without styles
    expect(snapshot(wrapper, false)).toMatchSnapshot(
      "mounted snapshot without styles"
    );
  });
});
