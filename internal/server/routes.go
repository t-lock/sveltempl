package server

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"templte/cmd/web"

	"github.com/a-h/templ"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"rogchap.com/v8go"
)

func jsHandler(iso *v8go.Isolate) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			// Create a new Javascript context
			ctx := v8go.NewContext(iso)

			// Parse the query parameters
			queryParams := r.URL.Query()

			// Get the value of the 'name' parameter
			componentName := queryParams.Get("component")

			if (componentName =="") {
				http.Error(w, "You must pass in a component name to render", http.StatusInternalServerError)
				return
			}

			// Construct the file path using fmt.Sprintf for string interpolation
			cwd, err := os.Getwd()
			if err != nil {
				log.Fatalf("Failed to get current working directory: %v", err)
			}
			componentPath := filepath.Join(cwd, "svelte/dist-ssr-go", fmt.Sprintf("%s.js", componentName))

			// Read the JavaScript file from disk
			componentScript, err := os.ReadFile(componentPath)
			if err != nil {
				http.Error(w, fmt.Sprintf("Could not read JavaScript file %s", componentPath), http.StatusInternalServerError)
				return
			}

			// Run the JS file which will load it into context
			_, err = ctx.RunScript(string(componentScript), componentPath)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error executing JavaScript file %s", componentPath), http.StatusInternalServerError)
				return
			}

			// Run the component render method
			componentOutput, err := ctx.RunScript(fmt.Sprintf("%s.render({server: true}).html", componentName), "output.js") // return a value in JavaScript back to Go
			if err != nil {
				http.Error(w, "Error executing JavaScript function", http.StatusInternalServerError)
				return
			}

			io.WriteString(w, componentOutput.String()); // print output to response writer
		},
	)
}

func (s *FiberServer) RegisterFiberRoutes() {
	// mine
	iso := v8go.NewIsolate() // creates a new JavaScript VM

	s.App.Get("/basic", adaptor.HTTPHandler(templ.Handler(web.Basic())))

	s.App.Get("/box", adaptor.HTTPHandler(jsHandler(iso)))

	// blueprint

	s.App.Get("/", s.HelloWorldHandler)

	s.App.Use("/assets", filesystem.New(filesystem.Config{
		Root:       http.FS(web.Files),
		PathPrefix: "assets",
		Browse:     false,
	}))

	s.App.Get("/web", adaptor.HTTPHandler(templ.Handler(web.HelloForm())))

	s.App.Post("/hello", func(c *fiber.Ctx) error {
		return web.HelloWebHandler(c)
	})

}

func (s *FiberServer) HelloWorldHandler(c *fiber.Ctx) error {
	resp := fiber.Map{
		"message": "Hello World",
	}

	return c.JSON(resp)
}
