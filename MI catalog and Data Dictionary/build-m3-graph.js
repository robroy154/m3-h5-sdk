#!/usr/bin/env node
/**
 * build-m3-graph.js
 *
 * Processes M3Table_Fields.json (XML content) into a lean adjacency graph
 * for dependency path queries.
 *
 * Usage:
 *   node build-m3-graph.js
 *
 * Input:  M3Table_Fields.json  (same directory as this script)
 * Output: m3_graph.json        (same directory as this script)
 *
 * Output structure:
 *   tables  — tableName -> { description, category, fields: { colName: { isKey, dataType, length, desc } } }
 *   index   — columnName -> [ tableName, ... ]
 */

const fs   = require("fs");
const path = require("path");

const INPUT  = path.join(__dirname, "M3Table_Fields.json");
const OUTPUT = path.join(__dirname, "m3_graph.json");

// ---------------------------------------------------------------------------
// 1. Read
// ---------------------------------------------------------------------------
console.log(`Reading ${INPUT} ...`);
const raw = fs.readFileSync(INPUT, "utf8");
console.log(`  Read ${(raw.length / 1024 / 1024).toFixed(1)} MB`);

// ---------------------------------------------------------------------------
// 2. Helper
// ---------------------------------------------------------------------------
function tag(block, name) {
  const re = new RegExp(`<mdp:${name}>([^<]*)<\\/mdp:${name}>`);
  const m  = block.match(re);
  return m ? m[1].trim() : "";
}

// ---------------------------------------------------------------------------
// 3. Load table metadata first so we can filter during field parsing
// ---------------------------------------------------------------------------
const tableMeta = {};   // tableName -> { description, category }
const TABLES_FILE = path.join(__dirname, "M3Tables.json");

if (fs.existsSync(TABLES_FILE)) {
  console.log("Loading table metadata from M3Tables.json ...");
  const tRaw    = fs.readFileSync(TABLES_FILE, "utf8");
  const tBlocks = tRaw.split("<mdp:list>").slice(1);
  for (const b of tBlocks) {
    const name = tag(b, "tableName");
    const desc = tag(b, "description");
    const cat  = tag(b, "category");
    if (name) tableMeta[name] = { description: desc, category: cat };
  }
  console.log(`  Loaded ${Object.keys(tableMeta).length.toLocaleString()} table definitions`);
} else {
  console.warn("  WARNING: M3Tables.json not found — table descriptions and category filtering unavailable.");
}

// ---------------------------------------------------------------------------
// 4. Parse field records
// ---------------------------------------------------------------------------
console.log("Parsing field records ...");

const blocks = raw.split("<mdp:list>").slice(1);
console.log(`  Found ${blocks.length.toLocaleString()} field records`);

// ---------------------------------------------------------------------------
// 5. Build graph
// ---------------------------------------------------------------------------
const tables = {};
const index  = {};

// Universal audit columns present on every table.
// Including them creates meaningless edges between every table in the schema.
const SKIP_COLS = new Set([
  "A0CONO","A0DIVI","A0CHID","A0CHNO","A0LMDT","A0LMTS",
  "A0RGDT","A0RGTM","A0ACGR","A0DTID"
]);

// Excluded table categories.
// SF = Join Dynamic (virtual runtime join constructs, not physical tables).
// These have a JD suffix and would create garbage edges across the graph.
const SKIP_CATEGORIES = new Set(["SF"]);

let skippedFields  = 0;
let skippedTables  = 0;

for (const block of blocks) {
  const colName   = tag(block, "columnName");
  const tableName = tag(block, "tableName");

  if (!colName || !tableName) { skippedFields++; continue; }

  // Skip excluded table categories (belt) and JD suffix (suspenders)
  const meta = tableMeta[tableName];
  if (meta && SKIP_CATEGORIES.has(meta.category)) { skippedTables++; continue; }
  if (tableName.endsWith("JD"))                   { skippedTables++; continue; }

  // Skip universal audit columns
  if (SKIP_COLS.has(colName)) { skippedFields++; continue; }

  const isKey     = tag(block, "keyCount")  === "Y";
  const mandatory = tag(block, "mandatory") === "Y";
  const dataType  = tag(block, "dataType");
  const length    = tag(block, "length");
  const desc      = tag(block, "description");

  if (!tables[tableName]) {
    tables[tableName] = {
      description: meta?.description || "",
      category:    meta?.category    || "",
      fields:      {}
    };
  }
  tables[tableName].fields[colName] = { isKey, mandatory, dataType, length, desc };

  if (!index[colName]) index[colName] = [];
  if (!index[colName].includes(tableName)) index[colName].push(tableName);
}

console.log(`  Skipped (audit cols) : ${skippedFields.toLocaleString()}`);
console.log(`  Skipped (JD/SF tbls) : ${skippedTables.toLocaleString()}`);
console.log(`  Tables kept          : ${Object.keys(tables).length.toLocaleString()}`);
console.log(`  Columns indexed      : ${Object.keys(index).length.toLocaleString()}`);

// ---------------------------------------------------------------------------
// 6. Write
// ---------------------------------------------------------------------------
console.log(`Writing ${OUTPUT} ...`);
fs.writeFileSync(OUTPUT, JSON.stringify({ tables, index }), "utf8");
const outSize = fs.statSync(OUTPUT).size;
console.log(`  Written ${(outSize / 1024 / 1024).toFixed(1)} MB`);
console.log("\nAll done. Load m3_graph.json into the M3 Dependency Explorer.");
