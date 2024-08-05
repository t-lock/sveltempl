// ! why on earth does this work?
[].forEach((name) => import(`./lib/${name}.svelte`));
