package web

import (
	"math/rand"
	"net/http"

	"github.com/a-h/templ"
)

func HTMXHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		templ.Handler(getRandomComponent()).ServeHTTP(w, r)
	} else {
		templ.Handler(HTMX()).ServeHTTP(w, r)
	}
}

func getRandomComponent() templ.Component {
	components := []templ.Component{
		Svelte("BoxOne", nil),
		Svelte("BoxTwo", nil),
		Svelte("BoxThree", nil),
		Svelte("ModeBox", []byte(`{"text": "I got picked randomly!"}`)),
	}

	return components[rand.Intn(len(components))]
}
