import React from "react";
import PropTypes from "prop-types";
import { createRenderer } from "fela";
import felaShallow from "../felaShallow";
import { createComponent } from "react-fela";
import applyTheme from "../applyTheme";
import theme from "../variables"; // eslint-disable-line behance/no-deprecated
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

describe("felaShallow", () => {
  it("should return a formatted snapshot object with DOM and styles", () => {
    const Div = createComponent(() => ({ color: "black" }));
    const { wrapper, snapshot } = felaShallow(<Div />, createRenderer, theme);
    expect(snapshot(wrapper)).toMatchSnapshot();

    //take a snapshot without styles
    expect(snapshot(wrapper, false)).toMatchSnapshot(
      "simple snapshot without styles"
    );
  });

  it("snapshot two levels deep", () => {
    const component = (
      <StyledBox name={"foo"}>
        <InnerStyledBox>
          <InnerBox>hello</InnerBox>
          <InnerBox>hello</InnerBox>
        </InnerStyledBox>
      </StyledBox>
    );

    const { wrapper, snapshot } = felaShallow(component, createRenderer, theme);

    expect(snapshot(wrapper)).toMatchSnapshot("Level 1");

    const child = wrapper.find(InnerStyledBox);
    expect(snapshot(child)).toMatchSnapshot("Level 2");

    const innerChild = wrapper.find(InnerBox);
    expect(snapshot(innerChild)).toMatchSnapshot("Level 3");

    const noChild = wrapper.find(NoBox);
    expect(snapshot(noChild)).toMatchSnapshot("no child");
  });

  it("unstyledBox", () => {
    const component = <UnstyledBox name={"foo"} />;
    const { wrapper, snapshot } = felaShallow(component, createRenderer, theme);

    expect(snapshot(wrapper)).toMatchSnapshot();
  });
});
