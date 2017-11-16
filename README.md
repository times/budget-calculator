# budget-calculator

> 

Scaffolded using the Times Yeoman generator.

## Use

Development:

    npm run start

Testing:

    npm run test

Production:

    npm run dist

Deployment:

    npm run deploy

## Contact

basilesimon (basile@basilesimon.fr)

## Polymer

This scaffold is for a web component built using Polymer.


### Structure

The `app/component` folder contains three files that comprise the web component:

- `index.html` for the component's HTML structure
- `script.js` for the component logic, which should be built around Polymer's lifecycle hooks
- `style.scss` for the component's styles (as SASS)

Static files can be placed in the `app/static` directory.


### Testing

Web Component Tester (WCT) is included to support testing. Tests can be written in `test/component.html`.

Settings can be tweaked in `wct.conf.json`.


### Dependencies

Third-party components can be included using Bower (as mandated by Polymer).


### Build process

On `npm run build`, the separate component files will be bundled together and then [Vulcanized](https://github.com/Polymer/polymer-bundler), which inlines dependencies.

To prevent a dependency being inlined (for example, if the dependency is hosted on the Times components server) you can add it to the `excludes` array in `scripts/vulcanize.js`.

Polymer itself should always be excluded from the Vulcanize process.
