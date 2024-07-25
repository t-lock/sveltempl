var BoxOne = function() {
  "use strict";
  function noop() {
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
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      for (const callback of callbacks) {
        callback(void 0);
      }
      return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
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
            code: Array.from(result.css).map((css2) => css2.code).join("\n"),
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
  const subscriber_queue = [];
  function writable(value, start = noop) {
    let stop;
    const subscribers = /* @__PURE__ */ new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update(fn) {
      set(fn(value));
    }
    function subscribe2(run2, invalidate = noop) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set, update) || noop;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update, subscribe: subscribe2 };
  }
  const count = writable(42);
  const css = {
    code: "h2.svelte-7b6pzi{color:orchid}",
    map: '{"version":3,"file":"BoxOne.svelte","sources":["BoxOne.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { count } from \\"./count\\";\\nfunction handleClick() {\\n  $count++;\\n}\\nexport let server = false;\\n<\/script>\\n\\n<h2>\\n  Box One\\n  <span class:server class:hydrated={!server}>\\n    [{server ? \\"server\\" : \\"hydrated\\"}]\\n  </span>\\n</h2>\\n<p>I render global state from a store</p>\\n<p>The global count is {$count}</p>\\n<button on:click={handleClick}>Increase global</button>\\n\\n<style>\\n  h2 {\\n    color: orchid;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAkBE,gBAAG,CACD,KAAK,CAAE,MACT"}'
  };
  const BoxOne2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
    let $count, $$unsubscribe_count;
    $$unsubscribe_count = subscribe(count, (value) => $count = value);
    let { server = false } = $$props;
    if ($$props.server === void 0 && $$bindings.server && server !== void 0) $$bindings.server(server);
    $$result.css.add(css);
    $$unsubscribe_count();
    return `<h2 class="svelte-7b6pzi">Box One
  <span${add_classes(((server ? "server" : "") + " " + (!server ? "hydrated" : "")).trim())}>[${escape(server ? "server" : "hydrated")}]</span></h2> <p>I render global state from a store</p> <p>The global count is ${escape($count)}</p> <button>Increase global</button>`;
  });
  return BoxOne2;
}();
