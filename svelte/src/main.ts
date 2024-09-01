const modules = import.meta.glob("./lib/**/*.svelte");
Object.keys(modules).forEach((path) => modules[path]());
