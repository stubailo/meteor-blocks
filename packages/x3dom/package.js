Package.describe({
  summary: "Provides X3DOM library modified for use with Meteor."
});

Package.on_use(function (api) {
  api.use("jquery");

  api.add_files([
    "x3dom-full.debug.js",
    "x3dom-patch.js",
    "x3dom.css",
    "x3dom.swf"
  ], "client");

  api.export("x3dom", "client");
});