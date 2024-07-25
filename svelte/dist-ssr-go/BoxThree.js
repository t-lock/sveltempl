var BoxThree = function() {
  "use strict";
  function noop() {
  }
  function is_promise(value) {
    return !!value && (typeof value === "object" || typeof value === "function") && typeof /** @type {any} */
    value.then === "function";
  }
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
  function add_classes(classes) {
    return classes ? ` class="${classes}"` : "";
  }
  async function getTlock() {
    const tlock = (await fetch("https://api.github.com/users/t-lock", {
      headers: { "X-GitHub-Api-Version": "2022-11-28" }
    })).json();
    return tlock;
  }
  const BoxThree2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
    let { server = false } = $$props;
    if ($$props.server === void 0 && $$bindings.server && server !== void 0) $$bindings.server(server);
    return `<h2>Box Three
  <span${add_classes(((server ? "server" : "") + " " + (!server ? "hydrated" : "")).trim())}>[${escape(server ? "server" : "hydrated")}]</span></h2> <p>The following is dynamic content</p> ${`<p>Component Not Mounted</p>`} ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ` <p>fetching...</p> `;
      }
      return function(tlock) {
        return ` <div><pre>      ${escape(JSON.stringify(tlock, null, 2))}
    </pre></div> `;
      }(__value);
    }(getTlock())}`;
  });
  return BoxThree2;
}();
