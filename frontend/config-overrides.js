const { addBabelPlugins, override } = require("customize-cra");
module.exports = override(
  ...addBabelPlugins(
    "babel-plugin-styled-components"
    /* Add plug-in names here (separate each value by a comma) */
  )
);