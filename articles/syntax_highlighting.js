'use strict';

document.querySelectorAll('pre').forEach(highlightSyntax);

function highlightSyntax(pre) {

  // Rather than loading a full syntax highlighting library like highlight.js, which would be difficult
  // to apply to this data-URL syntax anyway, use a series of simple text replacements that are just enough
  // to handle the little snippets on this page.

  let content = pre.textContent;

  // Un-indent
  const indentation = [...content.split('\n')[0]].findIndex(char => char !== ' ');
  content = content.split('\n').map(line => line.slice(indentation)).join('\n');

  // Highlight double-quoted strings
  content = content.replace(/"[^"]+"/gi, match => `<span class="string">&quot;${match.slice(1, -1)}&quot;</span>`);

  // Highlight once-only syntax
  content = content.replace('button {',             '<span class="selector">button</span> {');
  content = content.replace('background-image',     '<span class="property">$&</span>');
  content = content.replace('url(',                 '<span class="function">$&</span>');
  content = content.replace("')",                   '<span class="function">$&</span>');
  content = content.replace("'data:image/svg+xml,", '<span class="string">$&</span>');
  content = content.replace("<svg",                 '<span class="tag">&lt;svg</span>');
  content = content.replace("</svg>",               '<span class="tag">&lt;/svg&gt;</span>');
  content = content.replace(" viewBox=",            '<span class="attribute">$&</span>');
  content = content.replace(" xmlns=",              '<span class="attribute">$&</span>');
  content = content.replace(" width=",              '<span class="attribute">$&</span>');
  content = content.replace(" height=",             '<span class="attribute">$&</span>');
  content = content.replace("<g",                   '<span class="tag">&lt;g</span>');
  content = content.replace("</g>",                 '<span class="tag">&lt;/g&gt;</span>');

  // Highlight repeating syntax
  content = content.replace(/\<path/gi,             '<span class="tag">&lt;path</span>');
  content = content.replace(/\<polygon/gi,          '<span class="tag">&lt;polygon</span>');
  content = content.replace(/\<circle/gi,           '<span class="tag">&lt;circle</span>');
  content = content.replace(/\<rect/gi,             '<span class="tag">&lt;rect</span>');
  content = content.replace(/fill\=/gi,             '<span class="attribute">$&</span>');
  content = content.replace(/points\=/gi,           '<span class="attribute">$&</span>');
  content = content.replace(/d\=/gi,                '<span class="attribute">$&</span>');
  content = content.replace(/stroke\=/gi,           '<span class="attribute">$&</span>');
  content = content.replace(/stroke-width\=/gi,     '<span class="attribute">$&</span>');
  content = content.replace(/stroke-linecap\=/gi,   '<span class="attribute">$&</span>');
  content = content.replace(/stroke-linejoin\=/gi,  '<span class="attribute">$&</span>');
  content = content.replace(/cx\=/gi,               '<span class="attribute">$&</span>');
  content = content.replace(/cy\=/gi,               '<span class="attribute">$&</span>');
  content = content.replace(/x\=/gi,                '<span class="attribute">$&</span>');
  content = content.replace(/y\=/gi,                '<span class="attribute">$&</span>');
  content = content.replace(/r\=/gi,                '<span class="attribute">$&</span>');
  content = content.replace(/rx\=/gi,               '<span class="attribute">$&</span>');
  content = content.replace(/\\/gi,                 '<span class="line-continuation">$&</span>');
  content = content.replace(/\/\>/gi,               '<span class="tag">$&</span>');

  pre.innerHTML = content;
}
