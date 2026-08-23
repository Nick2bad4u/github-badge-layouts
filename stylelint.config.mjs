import sharedConfig from "stylelint-config-nick2bad4u";

/** @type {import("stylelint").Config} */
const stylelintConfig = {
    ...sharedConfig,
    rules: {
        ...sharedConfig.rules,
        // This repository serves a framework-free static site, not Docusaurus.
        "docusaurus/no-color-scheme-on-docusaurus-html-root": null,
        "docusaurus/no-unscoped-content-element-overrides": null,
        // Prettier runs as a dedicated gate with the repository's shared config.
        "prettier/prettier": null,
    },
};

export default stylelintConfig;
