// clean_html.js
// This script reads index.html, fixes empty headings, deduplicates class names,
// and writes the cleaned content back to index.html.
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const filePath = path.resolve('c:/Users/tomas/OneDrive/Escritorio/acscitu/index.html');
let html = fs.readFileSync(filePath, 'utf8');
const $ = cheerio.load(html, { xmlMode: false });

// Helper to deduplicate class names
function dedupClasses(classStr) {
  if (!classStr) return '';
  const classes = classStr.split(/\s+/).filter(Boolean);
  const unique = [...new Set(classes)];
  return unique.join(' ');
}

// Fix empty heading tags (h1-h6) by inserting placeholder text "Título"
$('h1, h2, h3, h4, h5, h6').each((i, el) => {
  const $el = $(el);
  if (!$el.text().trim()) {
    $el.text('Título');
  }
  // Deduplicate class attribute
  const cls = $el.attr('class');
  if (cls) {
    $el.attr('class', dedupClasses(cls));
  }
});

// Ensure all <button> elements have a type attribute and accessible text
$('button').each((i, el) => {
  const $el = $(el);
  // Add missing type attribute
  if (!$el.attr('type')) {
    $el.attr('type', 'button');
  }
  // If button has no textual content (only icons or whitespace), add aria-label
  const text = $el.text().trim();
  if (!text) {
    const aria = $el.attr('aria-label') || 'button';
    $el.attr('aria-label', aria);
  }
});

// Remove all inline style attributes (move to CSS later)
$('[style]').each((i, el) => {
  const $el = $(el);
  $el.removeAttr('style');
});

// Deduplicate classes on all elements and remove duplicate class entries
$('[class]').each((i, el) => {
  const $el = $(el);
  const cls = $el.attr('class');
  const newCls = dedupClasses(cls);
  if (newCls !== cls) {
    $el.attr('class', newCls);
  }
});

// Write back the cleaned HTML
fs.writeFileSync(filePath, $.html(), 'utf8');
console.log('HTML lint issues fixed and file updated.');
