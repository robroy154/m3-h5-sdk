#!/usr/bin/env node
/**
 * Regenerates `src/mi-messages.ts` from Infor's M3 sources.
 *
 *   node validation/tools/extract-mi-messages.mjs <dir-of-MVX-java> <out.ts>
 *
 * The sources are Infor's confidential material and are not in this repo; point
 * this at a local checkout. Only the generated file is committed.
 *
 * Scope: codes reachable from the transactions this script calls, not every code
 * in the programs. MMS240MI has 83 methods; we call Add and Del. For the engines
 * that MHS850MI hands off to wholesale (MHIHEDPI, MHIPACPI, MHILINPI, MHS870,
 * PPS300BE) there is no dispatch table to scope by, so those are taken whole.
 * PPS300/PPS300EX are excluded: that is the interactive program this script
 * replaces, and MHS870 never calls it.
 *
 * Two extraction rules that matter:
 * - The comment sometimes names a different ID than the code raised (12 do).
 *   The code RAISED is what a caller receives, so that is the key used.
 * - A code can carry several wordings; the most frequent wins, the rest are kept
 *   as `alternates` so any of them is still recognised.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = process.argv[2];
const OUT = process.argv[3];
if (!DIR || !OUT) {
  console.error('usage: extract-mi-messages.mjs <dir-of-MVX-java> <out.ts>');
  process.exit(1);
}

/** Transactions POReceiptShortcutV7 calls. See mi-gateway.ts. */
const USED = {
  MMS240MI: ['Add', 'Del'],
  CMS474MI: ['AddEqInfo', 'DltEqInfo'],
  MMS235MI: ['LstItmLot'],
  PPS001MI: ['GetBasicData2'],
  MHS850MI: ['AddWhsHead', 'AddWhsPack', 'AddWhsLine', 'PrcWhsTran', 'GetWhsHead', 'LstWhsLine'],
};
const ENGINES = ['MHIHEDPI', 'MHIPACPI', 'MHILINPI', 'MHS870', 'PPS300BE'];
const SKIP = ['PPS300', 'PPS300EX'];

const RAISE =
  /(?:setError\s*\(\s*(?:"[^"]*"\s*,\s*)?"([A-Z][A-Z0-9_]{2,8})"|MSGID\s*\.\s*move(?:LeftPad)?\s*\(\s*"([A-Z][A-Z0-9_]{2,8})")/;
const DECL = /MSGID\s*[=\-:]?\s*([A-Z][A-Z0-9_]{2,8})\s*[-–]?\s*(.*)$/;
const TRAIL = /\/\/\s*(.+?)\s*$/;
const CUT = /\b(can|is|are|must|the|in|for|to|and|with|not|be|of|on|a|an|or|re)$|\($/i;

const clean = (s) =>
  s.replace(/\*\/\s*$/, '').replace(/[‐-―]/g, '-')
   .replace(/\s{2,}/g, ' ').replace(/[.\s]+$/, '').trim();

/** name -> [start, end], keyed off Infor's 3-space member indentation. */
function methods(lines) {
  const decl = /^ {3}(?:public|private|protected)\s+(?:static\s+|final\s+)*[\w.<>[\]]+\s+(\w+)\s*\(/;
  const starts = [];
  lines.forEach((line, i) => { const m = line.match(decl); if (m) starts.push([m[1], i]); });
  const out = new Map();
  starts.forEach(([name, start], k) => {
    const end = k + 1 < starts.length ? starts[k + 1][1] - 1 : lines.length - 1;
    if (!out.has(name)) out.set(name, [start, end]);
  });
  return out;
}

/** transaction -> method it dispatches to */
function dispatch(lines) {
  const map = new Map();
  lines.forEach((line, i) => {
    const t = line.match(/isTransaction\("([^"]+)"\)/);
    if (!t) return;
    for (let j = i; j < Math.min(i + 4, lines.length); j++) {
      const c = lines[j].match(/^\s*(\w+)\s*\(\s*\)\s*;/);
      if (c && c[1] !== 'break') { map.set(t[1], c[1]); return; }
    }
  });
  return map;
}

/** Line ranges our transactions can reach, following calls within the file. */
function reachableRanges(prog, lines) {
  const ms = methods(lines);
  if (ENGINES.includes(prog)) return [...ms.values()];
  const disp = dispatch(lines);
  const seen = new Set();
  const queue = (USED[prog] || []).map((t) => disp.get(t)).filter(Boolean);
  while (queue.length) {
    const name = queue.pop();
    if (!name || seen.has(name) || !ms.has(name)) continue;
    seen.add(name);
    const [a, b] = ms.get(name);
    for (let i = a; i <= b; i++)
      for (const c of lines[i].matchAll(/(?:^|[^\w.])(\w+)\s*\(/g))
        if (ms.has(c[1])) queue.push(c[1]);
  }
  return [...seen].map((n) => ms.get(n)).filter(Boolean);
}

/**
 * Line spans guarded by a qualifier that is not ours.
 *
 * The engines run every warehouse-interface flow; we stage QLFR '20' (receipt).
 * A block whose condition is made up ENTIRELY of `QLFR.EQ("…")` terms, none of
 * which is ours, cannot run for our lines. The all-terms rule is deliberate: a
 * condition mixing QLFR with anything else, or using NE, is left in scope.
 */
function foreignQualifierSpans(lines) {
  const spans = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*(?:\}\s*else\s+)?if\s*\(/.test(lines[i]) || !lines[i].includes('QLFR')) continue;

    let cond = '', depth = 0, j = i;
    for (; j < lines.length && j < i + 12; j++) {
      const text = lines[j].replace(/\/\/.*$/, '');
      cond += text;
      for (const ch of text) { if (ch === '(') depth++; else if (ch === ')') depth--; }
      if (depth <= 0 && cond.includes('(')) break;
    }
    const inner = cond.slice(cond.indexOf('(') + 1, cond.lastIndexOf(')'));
    const terms = inner.split(/\|\||&&/).map((t) => t.trim()).filter(Boolean);
    const quals = terms.filter((t) => /getQLFR\(\)\s*\.EQ\("([^"]*)"\)\s*$/.test(t));
    if (!terms.length || quals.length !== terms.length) continue;
    if (quals.some((t) => t.match(/\.EQ\("([^"]*)"\)/)[1].trim() === '20')) continue;

    // Body runs from the opening brace to its match.
    let k = lines[j] && lines[j].includes('{') ? j : j + 1;
    if (!lines[k] || !lines[k].includes('{')) continue;
    let braces = 0, started = false;
    for (let m = k; m < lines.length; m++) {
      for (const ch of lines[m].replace(/\/\/.*$/, '')) {
        if (ch === '{') { braces++; started = true; } else if (ch === '}') braces--;
      }
      if (started && braces <= 0) { spans.push([k, m]); break; }
    }
  }
  return spans;
}

const acc = new Map();
const bump = (code, text, source) => {
  if (!text || text.length < 6) return;
  if (!acc.has(code)) acc.set(code, { texts: new Map(), sources: new Set() });
  const e = acc.get(code);
  e.texts.set(text, (e.texts.get(text) || 0) + 1);
  e.sources.add(source);
};

let scanned = 0;
const inScopeCodes = new Set();

/*
 * Two passes, because they answer different questions.
 *
 * Text is harvested from every line: a code means the same thing wherever it is
 * raised, and the wording often lives on a site we do not reach (WIND401's text
 * is on MMS235MI/LstItmLot; MMS240MI/Add raises it with no comment at all).
 *
 * The emitted SET, though, is scoped — only codes with a raising site our
 * transactions can reach. That is the condensation.
 */
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.java'))) {
  const prog = file.replace(/_MVX\.java$/, '').replace(/\.java$/, '');
  if (SKIP.includes(prog)) continue;
  const lines = readFileSync(join(DIR, file), 'utf8').split('\n');
  const ranges = reachableRanges(prog, lines);
  const foreign = foreignQualifierSpans(lines);
  const inScope = (i) =>
    ranges.some(([a, b]) => i >= a && i <= b) && !foreign.some(([a, b]) => i >= a && i <= b);
  scanned++;

  let pending = null;
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*)/.test(line)) {
      const d = line.match(DECL);
      if (d) { const t = clean(d[2]); if (t) pending = { code: d[1], text: t, line: i }; }
      return;
    }
    const r = line.match(RAISE);
    if (!r) return;
    let code = r[1] || r[2];
    if (code === 'XNU000') code = 'XNU0000';
    if (inScope(i)) inScopeCodes.add(code);

    if (pending && i - pending.line <= 4) { bump(code, pending.text, prog); pending = null; return; }
    const t = line.match(TRAIL);
    if (t && !/MSGID/.test(t[1])) bump(code, clean(t[1]), prog);
  });
}

const codes = [...acc.keys()].filter((c) => inScopeCodes.has(c)).sort();
const entries = [];
let truncated = 0;
const q = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
for (const c of codes) {
  const e = acc.get(c);
  const best = [...e.texts.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)[0];
  const isCut = CUT.test(best[0]);
  if (isCut) truncated++;
  const parts = [`t: ${q(best[0])}`];
  if (isCut) parts.push('cut: 1');
  const alts = [...e.texts.keys()].filter((t) => t !== best[0]);
  if (alts.length) parts.push(`alt: [${alts.map(q).join(', ')}]`);
  entries.push(`  ${c}: { ${parts.join(', ')} },`);
}

writeFileSync(OUT, `/**
 * M3 message text, keyed by message ID. GENERATED — do not edit by hand.
 *
 * Regenerate with validation/tools/extract-mi-messages.mjs, which reads Infor's
 * sources and keeps only codes reachable from the transactions this script
 * calls. M3 usually sends its own text; this fills the gap when it sends a bare
 * code, which is the normal case for MSID on an unprocessed line.
 *
 * \`t\` is the text, \`&1\` placeholders as Infor writes them. \`cut\` marks text
 * Infor's own comment truncates. \`alt\` holds other wordings the same code
 * carries, so a response matching any of them is still recognised.
 */

export interface MiMessage {
  t: string;
  cut?: number;
  alt?: string[];
}

/** ${codes.length} codes. */
export const MI_MESSAGES: Record<string, MiMessage> = {
${entries.join('\n')}
};

export function lookupMiMessage(code: string | null | undefined): MiMessage | null {
  if (!code) return null;
  const key = String(code).trim().toUpperCase();
  return Object.prototype.hasOwnProperty.call(MI_MESSAGES, key) ? MI_MESSAGES[key] : null;
}

/**
 * The operator-facing sentence for a code, or '' when unknown.
 *
 * Unfilled \`&1\` placeholders are stripped: M3 substitutes them itself, so one
 * surviving here means the text came from this table, and "Location does not
 * exist" reads better than "Location &1 does not exist".
 */
export function describeMiMessage(
  code: string | null | undefined,
  substitutions?: string[]
): string {
  const entry = lookupMiMessage(code);
  if (!entry) return '';

  let text = entry.t;
  if (substitutions) {
    for (let i = 0; i < substitutions.length; i++) {
      const value = substitutions[i];
      if (value === undefined || value === null || value === '') continue;
      text = text.split('&' + (i + 1)).join(String(value));
    }
  }
  text = text.replace(/&\\d/g, '').replace(/\\s{2,}/g, ' ').trim();
  if (!text) return '';
  return entry.cut ? text + '…' : text;
}

/**
 * Whether \`message\` already says what the catalogue would say, so the dialog
 * does not print both. Compared on letters and digits only, because M3 fills in
 * \`&1\` and may punctuate differently.
 */
export function messageMatchesCatalogue(
  code: string | null | undefined,
  message: string | null | undefined
): boolean {
  const entry = lookupMiMessage(code);
  if (!entry || !message) return false;

  const normalise = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const actual = normalise(message);
  if (!actual) return false;

  const candidates = [entry.t].concat(entry.alt || []);
  for (let i = 0; i < candidates.length; i++) {
    const parts = candidates[i].split(/&\\d/).map(normalise).filter((p) => p.length > 3);
    if (parts.length && parts.every((p) => actual.indexOf(p) !== -1)) return true;
  }
  return false;
}

export function miMessageCount(): number {
  return Object.keys(MI_MESSAGES).length;
}
`);
console.error(
  `${codes.length} codes from ${scanned} programs ` +
  `(${inScopeCodes.size} reachable, ${inScopeCodes.size - codes.length} with no text in source, ` +
  `${truncated} truncated in source)`
);
