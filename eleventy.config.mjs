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
    'node_modules/@phosphor-icons/web/src': 'css/phosphor',
  });
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': 'robots.txt' });
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

  // Group gallery photos by Year and Month for timeline navigation & month-wise grouping
  eleventyConfig.addFilter('galleryByYear', (photos) => {
    if (!Array.isArray(photos)) return [];
    const monthMap = {
      jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', may: 'May', jun: 'Jun',
      jul: 'Jul', aug: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec',
      january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr', june: 'Jun',
      july: 'Jul', august: 'Aug', september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec',
    };
    const fullMonthMap = {
      Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
      Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December',
    };

    const seenMonths = new Set();
    const enriched = photos.map((photo) => {
      let year = '2026';
      let month = 'Jan';
      if (photo.date) {
        const parts = String(photo.date).trim().split(/[\s,/-]+/);
        for (const part of parts) {
          if (/^\d{4}$/.test(part)) {
            year = part;
          } else {
            const lower = part.toLowerCase();
            if (monthMap[lower]) {
              month = monthMap[lower];
            }
          }
        }
      }
      const slug = `${year}-${month.toLowerCase()}`;
      const isFirstInMonth = !seenMonths.has(slug);
      if (isFirstInMonth) {
        seenMonths.add(slug);
      }
      return {
        ...photo,
        _year: year,
        _month: month,
        _fullMonth: fullMonthMap[month] || month,
        _monthSlug: slug,
        _isMonthFirst: isFirstInMonth,
      };
    });

    const yearsObj = {};
    enriched.forEach((p) => {
      if (!yearsObj[p._year]) {
        yearsObj[p._year] = { year: p._year, months: {}, photos: [] };
      }
      yearsObj[p._year].photos.push(p);
      if (!yearsObj[p._year].months[p._month]) {
        yearsObj[p._year].months[p._month] = [];
      }
      yearsObj[p._year].months[p._month].push(p);
    });

    const monthOrder = ['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan'];
    const sortedYears = Object.keys(yearsObj).sort((a, b) => Number(b) - Number(a));

    return sortedYears.map((yr) => {
      const yrData = yearsObj[yr];
      const activeMonths = Object.keys(yrData.months).sort(
        (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
      );
      return {
        year: yr,
        totalCount: yrData.photos.length,
        months: activeMonths.map((m) => ({
          month: m,
          fullMonth: fullMonthMap[m] || m,
          slug: `${yr}-${m.toLowerCase()}`,
          firstPhotoId: yrData.months[m][0]?.id || '',
          count: yrData.months[m].length,
          photos: yrData.months[m],
        })),
        photos: yrData.photos,
      };
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
