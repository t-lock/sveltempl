import type { ComponentType } from "svelte";
import "./app.css";

const targets = [
  {
    fileName: "BoxOne",
    id: "hash-from-go-vite-aware-1",
  },
  {
    fileName: "BoxTwo",
    id: "hash-from-go-vite-aware-2",
  },
  {
    fileName: "BoxThree",
    id: "hash-from-go-vite-aware-3",
  },
];

targets.forEach(({ fileName, id }) => {
  const target = document.getElementById(id);
  if (target) {
    import(`./lib/${fileName}.svelte`).then((module) => {
      const Component: ComponentType = module.default;

      const props = JSON.parse(target.dataset.props ?? "{}");

      target.innerHTML = "";

      new Component({
        target,
        props,
      });
    });
  }
});
