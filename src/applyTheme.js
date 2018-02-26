import { static as Immutable } from "seamless-immutable";
import { withTheme, ThemeProvider } from "react-fela";
import React from "react";
import PropTypes from "prop-types";

const applyTheme = (ComponentToWrap, ...themes) => {
  class ThemedComponent extends React.Component {
    render() {
      return (
        <ThemeProvider theme={mergeThemes(this.props.theme || {}, ...themes)}>
          <ComponentToWrap {...this.props} />
        </ThemeProvider>
      );
    }
  }

  ThemedComponent._isFelaComponent = true;
  ThemedComponent.displayName = `Themed${ComponentToWrap.displayName}`;
  ThemedComponent.propTypes = {
    theme: PropTypes.object
  };
  return withTheme(ThemedComponent);
};

const mergeThemes = (baseTheme, ...themes) =>
  themes
    ? themes.reduce((acc, theme) => {
        if (typeof theme === "function") {
          return Immutable.merge(acc, Immutable(theme(baseTheme)), {
            deep: true
          });
        } else if (typeof theme === "object") {
          return Immutable.merge(acc, Immutable(theme), { deep: true });
        }
        throw new Error("theme must be either a function or an object");
      }, Immutable(baseTheme))
    : Immutable(baseTheme);

export default applyTheme;
