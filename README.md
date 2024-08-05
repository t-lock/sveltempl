# Introducing *sveltempl* - SSR + Hydration for Svelte components in Go / Templ

>❗This project is in a pre-alpha state under active development, but feel free to take it for a spin and let me know what you think!

The goal of this project is to provide a seamless integration of Go and Svelte for the best of both worlds, with a focus on both developer and end user experience. The design of **sveltempl** is inspired by "Islands of Interactivity" but goes further by server-rendering those islands in a V8 runtime embedded in the Golang web server. If that sounds slow and resource intensive, rest assured it is not! (Numbers and architectural details to be provided with v1 release).

To work effectively with **sveltempl**, start by building out your routing and logic in Go and your pages/views in Templ (with HTMX _strongly encouraged_). When you need rich clientside interactivity or need to manage complex client state, reaching for a Svelte component tree is as simple as calling `@Svelte("MyComponent", myProps)` in your template. **sveltempl** will code-split and seamlessly inject your Svelte component(s) on both sides of the network bridge, so that the resulting page or htmx partial remains as lean and SEO-friendly as possible. Only the exact fancy clientside code you need _right now_, and no more, will be dynamically fetched and injected without any layout shift or FOUT.

All the Svelte APIs you know and love are available: global stores, reactive delarations, scoped styles, motion primitives, etc... You can have your cake and eat it too 🍰 _(just pay for it with a few ms)_.

**Note**: In the future, this repo will house the **sveltempl** Go library package and an accompanying Vite plugin, while an example application will be provided in a sister repo. For now, this repo combines all three and acts more as a starter template, but if you want to star or follow the project, this is the repo to do that. Semver library releases will be provided here.

## Getting Started

These instructions will get you a demo application up and running for development and testing purposes.

### System Package Requirements

- Lastest version of Go
- Templ
- Tailwind standalone CLI

### Svelte

From the `/svelte` directory:

- Install dependencies `npm install`
- Build Svelte client and server bundles `npm run build`

### Go

From the project root:

- Install dependencies `go get`
- Start a live-reloading process to recompile your build on changes `make watch`

### Niceties

To really grok working with this stack, you'll want to make sure your IDE is configured with the appropriate tooling / extensions for Go, Templ, Svelte, and Tailwind. Without them, ymmv.
