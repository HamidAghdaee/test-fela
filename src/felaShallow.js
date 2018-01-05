import React from "react";
import PropTypes from "prop-types";
import { shallow as enzymeShallow } from "enzyme";
import { createRenderer } from "fela";
import { renderToString } from "fela-tools";
import toJson from "enzyme-to-json";

const shallow = (node, options = {}) => {
  const renderer = createRenderer();
  const component = enzymeShallow(node, {
    childContextTypes: {
      renderer: PropTypes.object,
      foo: PropTypes.string
    },
    context: {
      renderer,
      foo: "bar"
      // theme,
    },
    ...options
  });

  component.snapshot = function snapshot() {
    return {
      component: toJson(this),
      // you should prettify this string
      styles: renderToString(renderer)
    };
  };

  return component;
};

export default shallow;
