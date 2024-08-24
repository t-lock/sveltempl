# Introducing *sveltempl* - SSR + Hydration for Svelte components in Go / Templ

>❗This project is in a pre-alpha state under active development, but feel free to take it for a spin and let me know what you think!

The goal of this project is to provide a seamless integration of Go and Svelte for the best of both worlds, with a focus on both developer and end user experience. The design of **sveltempl** is inspired by "Islands of Interactivity" but goes further by server-rendering those islands in a V8 runtime embedded in the Golang web server. If that sounds slow and resource intensive, rest assured it is not! (Numbers and architectural details to be provided with v1 release). When the web server starts, it fires up a long-running v8 isolate as a singleton, while each call to javascript to server-render a svelte component gets its own instantly-available context in the isolate.

To work effectively with **sveltempl**, start by building out your routing and logic in Go and your pages/views in Templ (with HTMX _strongly encouraged_). When you need rich clientside interactivity or need to manage complex client state, reaching for a Svelte component tree is as simple as calling `@Svelte("MyComponent", myProps)` in your template. **sveltempl** will code-split and seamlessly inject your Svelte component(s) on both sides of the network bridge, so that the resulting page or htmx partial remains as lean and SEO-friendly as possible. Only the exact fancy clientside code you need _right now_, and no more, will be dynamically fetched and injected without any layout shift or FOUT.

All the Svelte APIs you know and love are available: global stores, reactive delarations, scoped styles, motion primitives, etc... You can have your cake and eat it too 🍰 _(just pay for it with a few ms)_.

>Demo the examples in this repo online at [sveltempl.tlock.dev](https://sveltempl.tlock.dev)
>
>_**Note:** My server, like me, is located in Japan 🎌, so keep that in mind._


**Note**: In the future, this repo will house the **sveltempl** Go library package and an accompanying Vite plugin, while an example application will be provided in a sister repo. For now, this repo combines all three and acts more as a starter template, but if you want to star or follow the project, this is the repo to do that. Semver library releases will be provided here.

## Getting Started

These instructions will get you a demo application up and running for development and testing purposes.

### System Package Requirements

- Lastest version of Go
- Templ
- Tailwind standalone CLI
- Node.js (used only at build-time for Svelte)

### Svelte

From the `/svelte` directory:

- Install dependencies `npm install`
- That's it. Dev/build commands are handled by our `make` commands in the next section.

### Go

From the project root:

- Install dependencies `go get`
- Start a live-reloading process to recompile your build on changes `make watch`. 
  - This will also fire up your svelte components with Hot Module Reloading. If you're only changing a svelte file, you'll instantly see that change in the browser with no recompile/reload step.
- Compile a prod-ready build with `make build` and run it with `make run`.

### Niceties

To really grok working with this stack, you'll want to make sure your IDE is configured with the appropriate tooling / extensions for Go, Templ, Svelte, and Tailwind. Without them, ymmv.

---

**Bonus:**
If you use **sveltempl** with Echo, HTMX and Tailwind, and deploy with Docker and Nginx, you can enjoy claiming you run the `GETSHTDN` stack!

```
G E T S H T D N
o c e v t a o g
  h m e m i c i
  o p l x l k n
    l t   w e x
      e   i r
          n
          d
```
