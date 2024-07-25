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
  const domTarget = document.getElementById(id);
  if (domTarget) {
    import(`./lib/${fileName}.svelte`).then((module) => {
      const Component = module.default;
      domTarget.innerHTML = "";
      new Component({ target: domTarget });
    });
  }
});
