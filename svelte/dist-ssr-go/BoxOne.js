var BoxOne = (function () {
  'use strict';

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
  function validate_component(component, name) {
    if (!component || !component.$$render) {
      if (name === "svelte:component") name += " this={...}";
      throw new Error(
        `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`
      );
    }
    return component;
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
    function subscribe(run, invalidate = noop) {
      const subscriber = [run, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set, update) || noop;
      }
      run(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update, subscribe };
  }
  const count = writable(42);

  const PropText = create_ssr_component(($$result, $$props, $$bindings, slots) => {
    let { text = "default" } = $$props;
    if ($$props.text === void 0 && $$bindings.text && text !== void 0) $$bindings.text(text);
    return `<div style="padding-left: 40px">${escape(text)} text</div>`;
  });

  const SlotText = create_ssr_component(($$result, $$props, $$bindings, slots) => {
    return `<div style="padding-left: 20px">${slots.default ? slots.default({}) : ``} text</div>`;
  });

  const css = {
    code: "h2.svelte-50dkni,p.svelte-50dkni{color:orchid}",
    map: '{"version":3,"file":"BoxOne.svelte","sources":["BoxOne.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { count } from \\"./count\\";\\nimport PropText from \\"./PropText.svelte\\";\\nimport SlotText from \\"./SlotText.svelte\\";\\nfunction handleClick() {\\n  $count++;\\n}\\nexport let server = false;\\nlet ideas = [\\"shitty\\", \\"sucky\\", \\"swell\\", \\"super\\"];\\n<\/script>\\n\\n<h2>\\n  Box One\\n  <span class:server class:hydrated={!server}>\\n    [{server ? \\"server\\" : \\"hydrated\\"}]\\n  </span>\\n</h2>\\n<p>I render global state from a store</p>\\n<p>The global count is {$count}</p>\\n<button on:click={handleClick}>Increase global</button>\\n\\n<div class=\\"flex flex-col gap-5\\">\\n  {#each ideas as idea, i}\\n    {@const even = i % 2 === 0}\\n    {#if even}\\n      <PropText text={idea} />\\n    {:else}\\n      <SlotText>{idea}</SlotText>\\n    {/if}\\n  {/each}\\n</div>\\n\\n<style>\\n  h2, p {\\n    color: orchid;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAgCE,gBAAE,CAAE,eAAE,CACJ,KAAK,CAAE,MACT"}'
  };
  const BoxOne = create_ssr_component(($$result, $$props, $$bindings, slots) => {
    let $count, $$unsubscribe_count;
    $$unsubscribe_count = subscribe(count, (value) => $count = value);
    let { server = false } = $$props;
    let ideas = ["shitty", "sucky", "swell", "super"];
    if ($$props.server === void 0 && $$bindings.server && server !== void 0) $$bindings.server(server);
    $$result.css.add(css);
    $$unsubscribe_count();
    return `<h2 class="svelte-50dkni">Box One
  <span${add_classes(((server ? "server" : "") + " " + (!server ? "hydrated" : "")).trim())}>[${escape(server ? "server" : "hydrated")}]</span></h2> <p class="svelte-50dkni">I render global state from a store</p> <p class="svelte-50dkni">The global count is ${escape($count)}</p> <button>Increase global</button> <div class="flex flex-col gap-5">${each(ideas, (idea, i) => {
    let even = i % 2 === 0;
    return ` ${even ? `${validate_component(PropText, "PropText").$$render($$result, { text: idea }, {}, {})}` : `${validate_component(SlotText, "SlotText").$$render($$result, {}, {}, {
      default: () => {
        return `${escape(idea)}`;
      }
    })}`}`;
  })} </div>`;
  });

  return BoxOne;

})();
