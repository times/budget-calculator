# The Times 2017 Budget Calculator

> Polymer component for The Times' 2017 budget calculator

## Getting started

To run this code locally:

1. Clone this GitHub repository

2. Install the dependencies

```
$ npm install && bower install
```

3. Start the development server

```
$ npm run start
```

To create a built version of the component, run:

```
$ npm run dist
```

## Contact

* [Basile Simon](https://www.github.com/basilesimon)

### Structure

The `app/budget-calculator` folder contains three files that comprise the web
component:

* `index.html` for the component's HTML structure
* `script.js` for the component logic, which should be built around Polymer's
  lifecycle hooks
* `style.scss` for the component's styles (as SASS)

### Testing

Web Component Tester (WCT) is included to support testing. Tests can be written
in `test/component.html`.

Settings can be tweaked in `wct.conf.json`.

### Dependencies

Third-party components can be included using Bower (as mandated by Polymer).

### Build process

On `npm run build`, the separate component files will be bundled together and
then [Vulcanized](https://github.com/Polymer/polymer-bundler), which inlines
dependencies.

To prevent a dependency being inlined (for example, if the dependency is hosted
on the Times components server) you can add it to the `excludes` array in
`scripts/vulcanize.js`.

Polymer itself should always be excluded from the Vulcanize process.
