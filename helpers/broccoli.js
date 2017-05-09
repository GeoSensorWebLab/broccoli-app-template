"use strict";
var concat     = require('broccoli-concat');
var funnel     = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var assets      = [];
var libraryTree = mergeTrees([]);
var scripts     = [];
var styles      = [];

var BroccoliHelper = {
  // Merge all the asset trees in the same order they were loaded.
  getAssetsTree() {
    return new mergeTrees(assets);
  },

  // Merge all the library trees, and concatenate the script assets in the same
  // order they were loaded.
  // Returns a tree with a single file, `libraries.js`
  getScriptsTree() {
    return new concat(libraryTree, {
      headerFiles: scripts,
      outputFile: 'libraries.js'
    });
  },

  // Merge all the library trees, and concatenate the style assets in the same
  // order they were loaded.
  // Returns a tree with a single file, `libraries.css`
  getStylesTree() {
    return new concat(libraryTree, {
      headerFiles: styles,
      outputFile: 'libraries.css'
    });
  },

  // Import a library into the build.
  // `path` should correspond to the local path to the directory of files you
  // want to import.
  // `scripts` is a list of JS files inside `path` you want to import, in order.
  // `styles` is a list of CSS files inside `path` you want to import, in order.
  // `assets` is a list of directories inside `path` that you want to have
  // copied into the output directory.
  // `exclude` is a list of files to specifically exclude. Useful for when two
  // libraries include the same-named files.
  loadLibrary(path, options) {
    var lib = new funnel(path, {
      include: [
        "**/*.css",
        "**/*.js",
        "**/*.map"
      ],
      exclude: options.exclude || []
    });
    libraryTree = new mergeTrees([libraryTree, lib]);
    scripts     = scripts.concat(options.scripts);
    styles      = styles.concat(options.styles);

    var assetTrees = options.assets.map(function(asset) {
      return new funnel(path + '/' + asset, {
        destDir: asset
      });
    });

    assets = assets.concat(assetTrees);
  }
};

module.exports = BroccoliHelper;
