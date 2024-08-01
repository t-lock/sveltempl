import type { ComponentType } from "svelte";
import "./app.css";

const targets = ["BoxOne", "BoxTwo", "BoxThree", "TrelloClone"];

targets.forEach((name) => {
  const target = document.getElementById(name);
  if (target) {
    import(`./lib/${name}.svelte`).then((module) => {
      const Component: ComponentType = module.default;

      let props = {};

      if (target.firstElementChild?.tagName === "SCRIPT") {
        props = JSON.parse(target.firstElementChild.textContent ?? "{}");
      }

      target.innerHTML = "";

      new Component({
        target,
        props,
      });
    });
  }
});
