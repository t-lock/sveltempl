var ModeBox = (function () {
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

  const css = {
    code: "div.svelte-1qt8str{color:#242424;padding:20px;border-radius:6px}",
    map: `{"version":3,"file":"ModeBox.svelte","sources":["ModeBox.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let text = \\"\\";\\nlet { server, mode } = $$props;\\nconst colors = {\\n  ssr: \\"#75ADC7\\",\\n  hydrated: \\"#85C49B\\",\\n  csr: \\"#FFF099\\"\\n};\\n<\/script>\\n\\n<div\\n  style=\\"background-color: {server\\n    ? colors.ssr\\n    : mode === 'csr'\\n      ? colors.csr\\n      : colors.hydrated}\\"\\n>\\n  {text}\\n</div>\\n\\n<style>\\n  div {\\n    color: #242424;\\n    padding: 20px;\\n    border-radius: 6px;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAoBE,kBAAI,CACF,KAAK,CAAE,OAAO,CACd,OAAO,CAAE,IAAI,CACb,aAAa,CAAE,GACjB"}`
  };
  const ModeBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
    let { text = "" } = $$props;
    let { server, mode } = $$props;
    const colors = {
      ssr: "#75ADC7",
      hydrated: "#85C49B",
      csr: "#FFF099"
    };
    if ($$props.text === void 0 && $$bindings.text && text !== void 0) $$bindings.text(text);
    $$result.css.add(css);
    return `<div style="${"background-color: " + escape(
    server ? colors.ssr : mode === "csr" ? colors.csr : colors.hydrated,
    true
  )}" class="svelte-1qt8str">${escape(text)} </div>`;
  });

  return ModeBox;

})();
