/* ═══════════════════════════════════════════════════════════
   adapter.js  —  Data Normaliser for Bunny's Dashboard
   ───────────────────────────────────────────────────────────
   USAGE: Load BEFORE index.html's closing </body> script block,
   OR simply add one line to index.html's <head>:
       <script src="adapter.js"></script>
   This file must be served from the same folder as index.html.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── 1. FIELD MAP ─────────────────────────────────────────
     Left  = what index.html expects
     Right = what data.json actually contains
     Add any future mismatches here — no other file needs touching.
  ──────────────────────────────────────────────────────────── */
  var FIELD_MAP = {
    "Order Booker Code": "Order Booker Name"   // data has no Code column; use Name as identifier
  };

  /* ── 2. PATCH fetch() ─────────────────────────────────────
     Intercepts only the data.json request; all other fetch()
     calls are passed through completely untouched.
  ──────────────────────────────────────────────────────────── */
  var _nativeFetch = window.fetch.bind(window);

  window.fetch = function (input, init) {
    var url = (typeof input === "string") ? input : (input && input.url) || "";

    /* Only intercept data.json */
    if (!url.includes("data.json")) {
      return _nativeFetch(input, init);
    }

    return _nativeFetch(input, init).then(function (response) {
      /* Clone so the body stream can be read twice if needed */
      var cloned = response.clone();

      return cloned.json().then(function (rows) {
        var patched = normalise(rows);

        /* Rebuild a synthetic Response so index.html's .json() call works normally */
        var body    = JSON.stringify(patched);
        var headers = new Headers(response.headers);
        headers.set("Content-Type", "application/json");

        return new Response(body, {
          status:     response.status,
          statusText: response.statusText,
          headers:    headers
        });
      });
    });
  };

  /* ── 3. NORMALISE ─────────────────────────────────────────
     For every row:
       a) Trim whitespace from all string keys and string values
          (catches invisible chars, BOM, \r, non-breaking spaces)
       b) Apply FIELD_MAP aliases — adds the expected key using
          the value from the actual key (non-destructive; both
          keys coexist so nothing downstream breaks)
  ──────────────────────────────────────────────────────────── */
  function normalise(rows) {
    if (!Array.isArray(rows)) { return rows; }

    return rows.map(function (row) {
      /* Step a — clean all keys + string values */
      var clean = {};
      Object.keys(row).forEach(function (k) {
        var nk = k.trim();
        var v  = row[k];
        clean[nk] = (typeof v === "string") ? v.trim() : v;
      });

      /* Step b — inject aliased fields */
      Object.keys(FIELD_MAP).forEach(function (expected) {
        var actual = FIELD_MAP[expected];
        if (!(expected in clean) && actual in clean) {
          clean[expected] = clean[actual];
        }
      });

      return clean;
    });
  }

  /* ── 4. DEMO DATA PATCH ───────────────────────────────────
     index.html's mkDemo() still uses 'Order Booker Code'.
     We patch it at runtime so demo mode also works correctly
     without touching index.html.
  ──────────────────────────────────────────────────────────── */
  window.addEventListener("DOMContentLoaded", function () {
    if (typeof window.mkDemo !== "function") { return; }

    var _origMkDemo = window.mkDemo;
    window.mkDemo = function () {
      return normalise(_origMkDemo());
    };
  });

})();
