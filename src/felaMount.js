import { mount as enzymeMount } from "enzyme";
import { renderToString } from "fela-tools";
import toJson from "enzyme-to-json";
import cssbeautify from "cssbeautify";
import { mergeOptions } from "./utils";

const mount = (node, createRenderer, theme, options = {}) => {
  const renderer = createRenderer();
  const wrapper = enzymeMount(node, mergeOptions(options, renderer, theme));

  const snapshot = (wrapper, includeStyles = true) => {
    const options = {
      indent: "  ",
      openbrace: "end-of-line",
      autosemicolon: false
    };

    const result = {
      component: toJson(wrapper)
    };

    if (includeStyles) {
      result.styles = `\n${cssbeautify(renderToString(renderer), options)}\n`;
    }

    return result;
  };

  return {
    wrapper,
    snapshot
  };
};

export default mount;
