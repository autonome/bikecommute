require.config({
  baseUrl: './',
  paths: {
    famous: 'bower_components/famous',
    //pouchdb: 'bower_components/pouchdb/dist/pouchdb'  // make sure to add your components!
  },
/*
  shim: {
    pouchdb: {
      exports: "PouchDB"
    }
  },
  */
  deps: ['js/app'],
  waitSeconds: 0,
  normalizeDirDefines: 'all'
});
//require(['js/libs/l10n']);
