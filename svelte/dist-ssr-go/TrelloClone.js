var TrelloClone = (function () {
  'use strict';

  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function ensure_array_like(array_like_or_iterator) {
    return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  const ATTR_REGEX = /[&"]/g;
  const CONTENT_REGEX = /[&<]/g;
  function escape(value, is_attr = false) {
    const str = String(value);
    const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
    pattern.lastIndex = 0;
    let escaped = "";
    let last = 0;
    while (pattern.test(str)) {
      const i = pattern.lastIndex - 1;
      const ch = str[i];
      escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
      last = i + 1;
    }
    return escaped + str.substring(last);
  }
  function each(items, fn) {
    items = ensure_array_like(items);
    let str = "";
    for (let i = 0; i < items.length; i += 1) {
      str += fn(items[i], i);
    }
    return str;
  }
  let on_destroy;
  function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
      const parent_component = current_component;
      const $$ = {
        on_destroy,
        context: new Map(context || (parent_component ? parent_component.$$.context : [])),
        // these will be immediately discarded
        on_mount: [],
        before_update: [],
        after_update: [],
        callbacks: blank_object()
      };
      set_current_component({ $$ });
      const html = fn(result, props, bindings, slots);
      set_current_component(parent_component);
      return html;
    }
    return {
      render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
        on_destroy = [];
        const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
        const html = $$render(result, props, {}, $$slots, context);
        run_all(on_destroy);
        return {
          html,
          css: {
            code: Array.from(result.css).map((css) => css.code).join("\n"),
            map: null
            // TODO
          },
          head: result.title + result.head
        };
      },
      $$render
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var FEATURE_FLAG_NAMES = Object.freeze({
    // This flag exists as a workaround for issue 454 (basically a browser bug) - seems like these rect values take time to update when in grid layout. Setting it to true can cause strange behaviour in the REPL for non-grid zones, see issue 470
    USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT"
  });
  _defineProperty({}, FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT, false);
  var _ID_TO_INSTRUCTION;
  var INSTRUCTION_IDs = {
    DND_ZONE_ACTIVE: "dnd-zone-active",
    DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
  };
  _ID_TO_INSTRUCTION = {}, _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs.DND_ZONE_ACTIVE, "Tab to one the items and press space-bar or enter to start dragging it"), _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED, "This is a disabled drag and drop list");
  const css = {
    code: ".board.svelte-1jibnv3{height:90vh;width:100%;padding:0.5em;margin-bottom:40px}.column.svelte-1jibnv3{height:100%;width:250px;padding:0.5em;margin:1em;float:left;border:1px solid #6b6b6b;overflow-y:hidden}.column-content.svelte-1jibnv3{height:100%;overflow-y:scroll}.column-title.svelte-1jibnv3{margin-bottom:1em;display:flex;justify-content:center;align-items:center}.card.svelte-1jibnv3{min-height:40px;margin:0.4em 0;display:flex;justify-content:center;align-items:center;color:#333333;border-radius:6px}",
    map: `{"version":3,"file":"TrelloClone.svelte","sources":["TrelloClone.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { dndzone } from \\"svelte-dnd-action\\";\\nimport { flip } from \\"svelte/animate\\";\\nconst colors = [\\"#75ADC7\\", \\"#85C49B\\", \\"#E0B386\\", \\"#D48D98\\", \\"#FFF099\\"];\\nlet board = [\\n  {\\n    id: 1,\\n    name: \\"TODO\\",\\n    items: [\\n      { id: 41, name: \\"item41\\", color: colors[0] },\\n      { id: 42, name: \\"item42\\", color: colors[1] },\\n      { id: 43, name: \\"item43\\", color: colors[2] },\\n      { id: 44, name: \\"item44\\", color: colors[3] },\\n      { id: 45, name: \\"item45\\", color: colors[4] },\\n      { id: 46, name: \\"item46\\", color: colors[0] },\\n      { id: 47, name: \\"item47\\", color: colors[1] },\\n      { id: 48, name: \\"item48\\", color: colors[2] },\\n      { id: 49, name: \\"item49\\", color: colors[3] }\\n    ]\\n  },\\n  {\\n    id: 2,\\n    name: \\"DOING\\",\\n    items: []\\n  },\\n  {\\n    id: 3,\\n    name: \\"DONE\\",\\n    items: []\\n  }\\n];\\nlet columnItems = board;\\nconst flipDurationMs = 200;\\nfunction handleDndConsiderColumns(e) {\\n  columnItems = e.detail.items;\\n}\\nfunction handleDndFinalizeColumns(e) {\\n  columnItems = e.detail.items;\\n}\\nfunction handleDndConsiderCards(cid, e) {\\n  const colIdx = columnItems.findIndex((c) => c.id === cid);\\n  columnItems[colIdx].items = e.detail.items;\\n  columnItems = [...columnItems];\\n}\\nfunction handleDndFinalizeCards(cid, e) {\\n  const colIdx = columnItems.findIndex((c) => c.id === cid);\\n  columnItems[colIdx].items = e.detail.items;\\n  columnItems = [...columnItems];\\n}\\n<\/script>\\n\\n<!-- svelte-ignore a11y-click-events-have-key-events -->\\n<!-- svelte-ignore a11y-no-static-element-interactions -->\\n<section\\n  class=\\"board\\"\\n  use:dndzone={{ items: columnItems, flipDurationMs, type: \\"columns\\" }}\\n  on:consider={handleDndConsiderColumns}\\n  on:finalize={handleDndFinalizeColumns}\\n>\\n  {#each columnItems as column (column.id)}\\n    <div class=\\"column\\" animate:flip={{ duration: flipDurationMs }}>\\n      <div class=\\"column-title\\">{column.name}</div>\\n      <div\\n        class=\\"column-content\\"\\n        use:dndzone={{ items: column.items, flipDurationMs }}\\n        on:consider={(e) => handleDndConsiderCards(column.id, e)}\\n        on:finalize={(e) => handleDndFinalizeCards(column.id, e)}\\n      >\\n        {#each column.items as item (item.id)}\\n          <div\\n            class=\\"card\\"\\n            animate:flip={{ duration: flipDurationMs }}\\n            style=\\"background-color: {item.color}\\"\\n          >\\n            {item.name}\\n          </div>\\n        {/each}\\n      </div>\\n    </div>\\n  {/each}\\n</section>\\n\\n<style>\\n  .board {\\n    height: 90vh;\\n    width: 100%;\\n    padding: 0.5em;\\n    margin-bottom: 40px;\\n  }\\n  .column {\\n    height: 100%;\\n    width: 250px;\\n    padding: 0.5em;\\n    margin: 1em;\\n    float: left;\\n    border: 1px solid #6b6b6b;\\n    /*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/\\n    overflow-y: hidden;\\n  }\\n  .column-content {\\n    height: 100%;\\n    /* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */\\n    overflow-y: scroll;\\n  }\\n  .column-title {\\n    margin-bottom: 1em;\\n    display: flex;\\n    justify-content: center;\\n    align-items: center;\\n  }\\n  .card {\\n    min-height: 40px;\\n    /* width: 100%; */\\n    margin: 0.4em 0;\\n    display: flex;\\n    justify-content: center;\\n    align-items: center;\\n    color: #333333;\\n    border-radius: 6px;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAkFE,qBAAO,CACL,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,KAAK,CACd,aAAa,CAAE,IACjB,CACA,sBAAQ,CACN,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,KAAK,CACZ,OAAO,CAAE,KAAK,CACd,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,CAEzB,UAAU,CAAE,MACd,CACA,8BAAgB,CACd,MAAM,CAAE,IAAI,CAEZ,UAAU,CAAE,MACd,CACA,4BAAc,CACZ,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MACf,CACA,oBAAM,CACJ,UAAU,CAAE,IAAI,CAEhB,MAAM,CAAE,KAAK,CAAC,CAAC,CACf,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,OAAO,CACd,aAAa,CAAE,GACjB"}`
  };
  const TrelloClone = create_ssr_component(($$result, $$props, $$bindings, slots) => {
    const colors = ["#75ADC7", "#85C49B", "#E0B386", "#D48D98", "#FFF099"];
    let board = [
      {
        id: 1,
        name: "TODO",
        items: [
          { id: 41, name: "item41", color: colors[0] },
          { id: 42, name: "item42", color: colors[1] },
          { id: 43, name: "item43", color: colors[2] },
          { id: 44, name: "item44", color: colors[3] },
          { id: 45, name: "item45", color: colors[4] },
          { id: 46, name: "item46", color: colors[0] },
          { id: 47, name: "item47", color: colors[1] },
          { id: 48, name: "item48", color: colors[2] },
          { id: 49, name: "item49", color: colors[3] }
        ]
      },
      { id: 2, name: "DOING", items: [] },
      { id: 3, name: "DONE", items: [] }
    ];
    let columnItems = board;
    $$result.css.add(css);
    return `  <section class="board svelte-1jibnv3">${each(columnItems, (column) => {
    return `<div class="column svelte-1jibnv3"><div class="column-title svelte-1jibnv3">${escape(column.name)}</div> <div class="column-content svelte-1jibnv3">${each(column.items, (item) => {
      return `<div class="card svelte-1jibnv3" style="${"background-color: " + escape(item.color, true)}">${escape(item.name)} </div>`;
    })}</div> </div>`;
  })} </section>`;
  });

  return TrelloClone;

})();
