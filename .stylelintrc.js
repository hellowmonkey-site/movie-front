module.exports = {
  "plugins": [
    'stylelint-declaration-block-no-ignored-properties',
    "stylelint-scss"
  ],
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  rules: {
    "declaration-block-no-duplicate-properties": null,
    "no-invalid-double-slash-comments": null,
    "font-family-name-quotes": null,
    "font-family-no-missing-generic-family-keyword": null,
    "unit-case": null,
    "unit-no-unknown": null,
    "alpha-value-notation": null,
    "selector-class-pattern": null,
    "value-keyword-case": null,
    "scss/at-import-partial-extension": null,
  },
};