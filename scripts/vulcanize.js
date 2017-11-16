const fs = require('fs-extra');
const path = require('path');
const Vulcanize = require('vulcanize');

const cwd = process.cwd();
const distDir = cwd + '/dist/';
const bowerDir = cwd + '/bower_components/';

// Settings for the vulcanize process
const vulcan = new Vulcanize({
  inlineCss: true,
  inlineScripts: true,
  stripComments: true,
  excludes: [bowerDir + 'polymer/polymer.html'],
});

// All the components
const distFiles = fs.readdirSync(distDir);
const isDirectory = f => fs.statSync(path.join(distDir, f)).isDirectory();

const components = distFiles.filter(isDirectory);

const staticFiles = distFiles.filter(f => !isDirectory(f));

// The top-level component (entry file)
const entryFile = JSON.parse(fs.readFileSync('package.json', 'utf8')).main;

// Start by moving the component files out of /dist and into /bower_components
components.forEach(c => {
  fs.copySync(distDir + c, bowerDir + c);
  fs.removeSync(distDir + c);
});

// Rearrange the /dist directory
staticFiles.forEach(f => {
  fs.copySync(distDir + f, `${distDir}/${entryFile}/${f}`);
  fs.removeSync(distDir + f);
});

// Source dir and file for the vulcanize process
const sourceDir = bowerDir + entryFile;
const sourceFile = fs.readdirSync(sourceDir).filter(f => f.includes('html'))[0];

// Vulcanize the top level component file
if (!sourceFile)
  throw new Error(`Error: couldn't find HTML file in ${bowerDir + entryFile}`);

vulcan.process(`${sourceDir}/${sourceFile}`, function(err, inlinedHtml) {
  if (err)
    throw new Error(
      `Error: couldn't vulcanise ${sourceDir + sourceFile}. ${err}`
    );
  else
    fs.outputFileSync(`${distDir}/${entryFile}/${entryFile}.html`, inlinedHtml);

  // Once the vulcanize process is complete, clean up /bower_components
  components.forEach(c => fs.removeSync(bowerDir + c));
});
