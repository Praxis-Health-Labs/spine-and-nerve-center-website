// .eleventy.js
module.exports = function(eleventyConfig) {

  // This is the magic line that tells Eleventy's dev server to watch
  // the entire src folder for changes and reload the browser.
  eleventyConfig.addWatchTarget("./src/");

  // This tells Eleventy where to find your files and where to build them.
  // It's good practice to have this defined.
  return {
    dir: {
      input: "src",      // Source folder
      output: "_site",   // Build folder
      includes: "_includes" // Optional: where to look for layouts/partials
    }
  };
};