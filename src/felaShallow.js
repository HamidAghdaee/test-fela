import { shallow as enzymeShallow } from "enzyme";
import { renderToString } from "fela-tools";
import cssbeautify from "cssbeautify";
import toJson from "enzyme-to-json";
import { mergeOptions } from "./utils";
import { ThemeProvider } from "react-fela";

const isThemeProvider = reactElement =>
  reactElement && reactElement.type && reactElement.type === ThemeProvider;

const isFelaComponent = reactElement =>
  reactElement && reactElement.type && reactElement.type._isFelaComponent;

const isNonDOMComponent = reactElement =>
  reactElement && reactElement.type && typeof reactElement.type !== "string";

const shallow = (node, createRenderer, rootTheme = {}, options = {}) => {
  const rootRenderer = createRenderer();

  const wrapper = enzymeShallow(
    node,
    mergeOptions(options, rootRenderer, rootTheme)
  );

  const dive = (
    wrapper,
    renderer,
    theme = rootTheme,
    divedIntoFelaComponent = false
  ) => {
    const reactElement = wrapper.get(0);
    //if the element in question is a ThemeProvider, use its theme and pass it down
    //the tree in context
    if (isThemeProvider(reactElement)) {
      theme = reactElement.props.theme;
    }

    //if we are dealing with a fela node, or a ThemeProvider then dive until we get to a non-fela node (for rendering)
    //Also keep enzyme diving, the first Non dom child of a Fela Component, which is the case
    //if one uses createComponent(styleRule, SomeReactComponent)
    if (
      isThemeProvider(reactElement) ||
      isFelaComponent(reactElement) ||
      (isNonDOMComponent(reactElement) && divedIntoFelaComponent)
    ) {
      const mergedOptions = mergeOptions(options, renderer, theme);
      const enzymeDived = wrapper.dive(mergedOptions);

      if (isThemeProvider(reactElement) || isFelaComponent(reactElement)) {
        return dive(
          enzymeDived,
          renderer,
          theme,
          reactElement.type._isFelaComponent || divedIntoFelaComponent
        );
      }
      return enzymeDived;
    }
    return wrapper;
  };

  const componentSnapshot = (wrapper, includeStyles) => {
    const options = {
      indent: "  ",
      openbrace: "end-of-line",
      autosemicolon: false
    };

    let renderer = rootRenderer;
    let wrapperToSnapshot = wrapper;

    const reactElement = wrapper.get(0);

    //if the element being snapshot is a fela component or a ThemeProvider
    //we need to dive into it and keep shallow rendering
    if (
      includeStyles &&
      (isThemeProvider(reactElement) || isFelaComponent(reactElement))
    ) {
      //use a new renderer to capture the styles just by rendering this enzyme wrapper
      renderer = createRenderer();
      wrapperToSnapshot = dive(wrapper, renderer);
    }

    const result = {
      component: toJson(wrapperToSnapshot)
    };

    if (includeStyles) {
      result.styles = `\n${cssbeautify(renderToString(renderer), options)}\n`;
    }

    return result;
  };

  //if the enzyme wrapper is around a single node, returns an object with keys: component, style
  //otherwise returns an array where each element in the array is an object with keys: component, style
  //where the snapshot for that element is stored.
  //if the includeStyles prop is false, then styles are ommitted from the captured snapshot. This will make it act like a normal
  //enzyme shallow snapshot capture (i.e. we will not dive into fela components and render them)
  const snapshot = (enzymeWrapper, includeStyles = true) => {
    if (enzymeWrapper.length === 1) {
      return componentSnapshot(enzymeWrapper, includeStyles);
    }
    return enzymeWrapper.map(wrapper => {
      return componentSnapshot(wrapper, includeStyles);
    });
  };

  return {
    wrapper,
    snapshot
  };
};

export default shallow;
