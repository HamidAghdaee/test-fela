import { createTheme, THEME_CHANNEL } from 'fela-bindings';
import PropTypes from 'prop-types';

export const mergeOptions = (options, renderer, theme) => {
  const { childContextTypes, contextTypes, context, ...otherOptions } = options;

  return {
    childContextTypes: {
      ...childContextTypes,
      [THEME_CHANNEL]: PropTypes.object,
      renderer: PropTypes.object
    },
    contextTypes: {
      ...contextTypes,
      [THEME_CHANNEL]: PropTypes.object,
      renderer: PropTypes.object
    },
    context: {
      ...context,
      renderer,
      [THEME_CHANNEL]: theme ? createTheme(theme) : null
    },
    ...otherOptions
  };
};
