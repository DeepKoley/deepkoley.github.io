import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

export default function (eleventyConfig) {
  // Add Syntax Highlighting Plugin
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.on('eleventy.before', async () => {
    const tailwindInputPath = path.resolve('./src/css/styles.css');
    const tailwindOutputPath = './dist/css/styles.css';
    const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');
    const outputDir = path.dirname(tailwindOutputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await postcss([tailwindcss()]).process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  // Passthrough copy for JS and other assets
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' });
  eleventyConfig.addPassthroughCopy({
    'node_modules/feather-icons/dist/feather.min.js': 'js/feather.min.js',
  });
  eleventyConfig.addPassthroughCopy({
    'node_modules/typed.js/dist/typed.umd.js': 'js/typed.umd.js',
  });
  eleventyConfig.addPassthroughCopy({
    'node_modules/simplelightbox/dist/simple-lightbox.min.js': 'js/simple-lightbox.min.js',
  });
  eleventyConfig.addPassthroughCopy({
    'node_modules/simplelightbox/dist/simple-lightbox.min.css': 'css/simple-lightbox.min.css',
  });
  eleventyConfig.addPassthroughCopy({ 'cv.pdf': 'cv.pdf' });
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  // Date filters
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  // Limit array filter
  eleventyConfig.addFilter('limit', (arr, limit) => {
    return Array.isArray(arr) ? arr.slice(0, limit) : [];
  });

  // Explicit collections filtered by glob
  eleventyConfig.addCollection('posts', (collectionApi) => {
    return collectionApi.getFilteredByGlob('./src/blog/*.md');
  });

  eleventyConfig.addCollection('projects', (collectionApi) => {
    return collectionApi.getFilteredByGlob('./src/projects/*.md');
  });

  // Watch for CSS/JS changes
  eleventyConfig.addWatchTarget('./src/css/');
  eleventyConfig.addWatchTarget('./src/js/');
  eleventyConfig.addWatchTarget('./src/assets/');

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
    templateFormats: ['njk', 'md', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
}
