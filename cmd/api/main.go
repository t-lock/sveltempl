package main

import (
	"fmt"
	"net/http"
	"sveltempl/cmd/web"

	"github.com/a-h/templ"
)

func main() {
	http.Handle("/", templ.Handler(web.Home()))
	http.Handle("/page", templ.Handler(web.Page()))
	http.Handle("/no-svelte", templ.Handler(web.NoSvelte()))
	http.Handle("/trello-clone", templ.Handler(web.TrelloClone()))
	http.HandleFunc("/htmx", web.HTMXHandler)
	http.Handle("/modes", templ.Handler(web.Modes()))
	http.Handle("/nested", templ.Handler(web.Nested()))
	http.HandleFunc("/api/updateBoard", web.TrelloHandler)

	fileServer := http.FileServer(http.FS(web.Files))
	http.Handle("/assets/", fileServer)

	fmt.Println("Listening on :8080")
	http.ListenAndServe(":8080", nil)
}
