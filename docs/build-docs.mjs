// Dependency-free Markdown -> styled HTML generator for Demi docs.
// Usage: node build-docs.mjs <input.md> <output.html> "<Eyebrow>"
import { readFileSync, writeFileSync } from "node:fs";

const [, , inPath, outPath, eyebrowArg] = process.argv;
const eyebrow = eyebrowArg || "Demerzel (Demi)";
const md = readFileSync(inPath, "utf8");
const lines = md.replace(/\r\n/g, "\n").split("\n");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

function inline(text) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((p) => {
      if (p.length >= 2 && p.startsWith("`") && p.endsWith("`")) {
        return "<code>" + esc(p.slice(1, -1)) + "</code>";
      }
      let s = esc(p);
      s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      return s;
    })
    .join("");
}

const HEX = /#[0-9A-Fa-f]{6}\b/;

function renderCode(lang, body) {
  if (lang === "mermaid") {
    return '<div class="mermaid">' + esc(body) + "</div>";
  }
  const rows = body.split("\n");
  const nonEmpty = rows.filter((r) => r.trim().length);
  const hexRows = nonEmpty.filter((r) => HEX.test(r));
  if (hexRows.length >= 3 && hexRows.length / nonEmpty.length >= 0.6) {
    const cards = hexRows
      .map((r) => {
        const hex = (r.match(HEX) || [])[0];
        const name = r.trim().split(/\s+/)[0];
        const after = r.slice(r.indexOf(hex) + hex.length).trim();
        const note = after ? '<span class="hex"> ' + esc(after) + "</span>" : "";
        return (
          '<div class="swatch"><div class="chip" style="background:' +
          hex +
          '"></div><div class="meta"><span class="name">' +
          esc(name) +
          '</span><span class="hex">' +
          hex +
          "</span>" +
          note +
          "</div></div>"
        );
      })
      .join("");
    return '<div class="swatch-grid">' + cards + "</div>";
  }
  return "<pre><code>" + esc(body) + "</code></pre>";
}

function buildList(block) {
  // block: array of {indent, ordered, text}
  let html = "";
  const stack = []; // {ordered}
  let prevIndent = -1;
  for (const it of block) {
    if (it.indent > prevIndent) {
      const tag = it.ordered ? "ol" : "ul";
      html += "<" + tag + ">";
      stack.push(tag);
    } else if (it.indent < prevIndent) {
      while (stack.length && it.indent < prevIndent) {
        html += "</" + stack.pop() + ">";
        prevIndent--;
      }
    }
    html += "<li>" + inline(it.text) + "</li>";
    prevIndent = it.indent;
  }
  while (stack.length) html += "</" + stack.pop() + ">";
  return html;
}

let out = [];
const toc = [];
let hero = { title: eyebrow, subtitle: "" };
let i = 0;
let heroDone = false;

while (i < lines.length) {
  let line = lines[i];

  // code fence
  const fence = line.match(/^```(\w*)\s*$/);
  if (fence) {
    const lang = fence[1];
    const buf = [];
    i++;
    while (i < lines.length && !/^```\s*$/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    i++; // closing fence
    out.push(renderCode(lang, buf.join("\n")));
    continue;
  }

  // headings
  const h = line.match(/^(#{1,6})\s+(.*)$/);
  if (h) {
    const level = h[1].length;
    const raw = h[2].trim();
    if (level === 1 && !heroDone) {
      hero.title = raw;
      // look ahead for a blockquote subtitle
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length && lines[j].startsWith(">")) {
        const qb = [];
        while (j < lines.length && lines[j].startsWith(">")) {
          qb.push(lines[j].replace(/^>\s?/, ""));
          j++;
        }
        hero.subtitle = qb.join(" ").trim();
        i = j;
      } else {
        i++;
      }
      heroDone = true;
      continue;
    }
    if (level === 2) {
      const numM = raw.match(/^(\d+)\.\s+(.*)$/);
      const id = slug(raw);
      let inner, label;
      if (numM) {
        label = numM[2];
        inner = '<span class="num">' + numM[1] + "</span>" + inline(numM[2]);
      } else {
        label = raw;
        inner = inline(raw);
      }
      toc.push({ id, label, sub: false });
      out.push('<h2 id="' + id + '">' + inner + "</h2>");
      i++;
      continue;
    }
    if (level === 3) {
      const id = slug(raw);
      toc.push({ id, label: raw, sub: true });
      out.push('<h3 id="' + id + '">' + inline(raw) + "</h3>");
      i++;
      continue;
    }
    out.push("<h" + level + ">" + inline(raw) + "</h" + level + ">");
    i++;
    continue;
  }

  // hr
  if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
    out.push("<hr>");
    i++;
    continue;
  }

  // blockquote
  if (line.startsWith(">")) {
    const qb = [];
    while (i < lines.length && lines[i].startsWith(">")) {
      qb.push(lines[i].replace(/^>\s?/, ""));
      i++;
    }
    out.push("<blockquote><p>" + inline(qb.join(" ")) + "</p></blockquote>");
    continue;
  }

  // list
  const listM = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
  if (listM) {
    const block = [];
    while (i < lines.length) {
      const m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (!m) {
        if (lines[i].trim() === "") {
          // peek: blank then another list item continues the list
          let k = i + 1;
          if (k < lines.length && /^(\s*)([-*]|\d+\.)\s+/.test(lines[k])) {
            i++;
            continue;
          }
        }
        break;
      }
      const indent = Math.floor(m[1].replace(/\t/g, "  ").length / 2);
      const ordered = /\d+\./.test(m[2]);
      block.push({ indent, ordered, text: m[3] });
      i++;
    }
    out.push(buildList(block));
    continue;
  }

  // table
  if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {
    const header = line.split("|").map((c) => c.trim()).filter((c, idx, a) => !(c === "" && (idx === 0 || idx === a.length - 1)));
    i += 2;
    const body = [];
    while (i < lines.length && lines[i].includes("|")) {
      body.push(lines[i].split("|").map((c) => c.trim()).filter((c, idx, a) => !(c === "" && (idx === 0 || idx === a.length - 1))));
      i++;
    }
    let t = "<table><thead><tr>" + header.map((c) => "<th>" + inline(c) + "</th>").join("") + "</tr></thead><tbody>";
    for (const r of body) t += "<tr>" + r.map((c) => "<td>" + inline(c) + "</td>").join("") + "</tr>";
    t += "</tbody></table>";
    out.push(t);
    continue;
  }

  // paragraph
  if (line.trim() === "") {
    i++;
    continue;
  }
  const para = [];
  while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,6}\s|```|>|\s*([-*]|\d+\.)\s|-{3,}|\*{3,})/.test(lines[i])) {
    para.push(lines[i].trim());
    i++;
  }
  out.push("<p>" + inline(para.join(" ")) + "</p>");
}

const tocHtml = toc
  .map(
    (t) =>
      '<a href="#' + t.id + '" class="' + (t.sub ? "sub" : "") + '">' + esc(t.label) + "</a>"
  )
  .join("\n");

const title = hero.title.replace(/<[^>]+>/g, "");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./assets/demi-docs.css">
</head>
<body>
<div class="layout">
  <nav class="sidebar">
    <div class="brand"><div class="brand-mark"></div><div class="brand-name">Demi</div></div>
    <div class="brand-sub">${esc(eyebrow)}</div>
    <div class="toc">
${tocHtml}
    </div>
  </nav>
  <main class="content">
    <div class="content-inner">
      <header class="hero">
        <div class="eyebrow">${esc(eyebrow)}</div>
        <h1>${esc(hero.title)}</h1>
        ${hero.subtitle ? "<p>" + inline(hero.subtitle) + "</p>" : ""}
        <div class="hero-tags"><span>Demerzel (Demi)</span><span>Local-first</span><span>Ollama-powered</span><span>Chat / Cowork / Code</span></div>
      </header>
${out.join("\n")}
      <footer class="doc-footer">Demerzel (Demi) &middot; generated from ${esc(inPath.split(/[\\/]/).pop())}</footer>
    </div>
  </main>
</div>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: true, theme: dark ? 'dark' : 'neutral', themeVariables: { primaryColor: '#EEF2FF', primaryBorderColor: '#4154D6', lineColor: '#6B7685', fontFamily: 'Inter, sans-serif' } });
  }
  // scroll-spy
  const links = Array.from(document.querySelectorAll('.toc a'));
  const map = new Map();
  links.forEach(a => map.set(a.getAttribute('href').slice(1), a));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = map.get(e.target.id);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '0px 0px -75% 0px', threshold: 0 });
  document.querySelectorAll('h2[id], h3[id]').forEach(h => obs.observe(h));
</script>
</body>
</html>
`;

writeFileSync(outPath, html, "utf8");
console.log("Wrote " + outPath + " (" + html.length + " bytes, " + toc.length + " TOC entries)");
