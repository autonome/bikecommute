{
  // All build options are described here:
  // https://github.com/jrburke/r.js/blob/master/build/example.build.js

  appDir: '..',

  // Uses this file as the starting config for this build. The properties in
  // this build config will override ones in this file.
  mainConfigFile: '../js/config.js',

  // Allows the build to dynamically load things on devices that
  // remove function source strings
  normalizeDirDefines: 'all',

  // Output directory. Deploy this directory to the device.
  dir: 'output',

  // Build layers to optimize, specifying the module IDs.
  modules: [
    {
      name: 'js/config'
    }
  ],

  // Any files combined in the "modules" bundle, remove them from the output
  // folder, to keep the built size down.
  removeCombined: true,

  // Rewrite the waitSeconds config so that we never time out waiting for
  // modules to load in production. Important particularly on
  // tarako devices.
  onBuildWrite: function(id, url, contents) {
    if (id === 'config') {
      return contents.replace(/waitSeconds:\s*\d+/, 'waitSeconds: 0');
    } else {
      return contents;
    }
  },

  // Do not bother with copying the build area.
  fileExclusionRegExp: /^build$/,

  // Use 'uglify2' for the JS optimization. Can be set to 'none' to avoid
  // minification, also greatly speeds up builds for dev/debug cycle.
  optimize: 'none',

  // Just strip comments, no code compression or mangling, to give you a hope
  // of debugging the build output.
  // Only active if optimize: 'uglify2'
  uglify2: {
    // Comment out the output section to get rid of line
    // returns and tabs spacing.
    output: {
      beautify: true
    }
  }
}
