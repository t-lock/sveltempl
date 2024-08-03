const targets = ["BoxOne", "BoxTwo", "BoxThree", "TrelloClone"];

targets.forEach((name) => import(`./lib/${name}.svelte`));
