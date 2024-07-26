package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sveltempl/cmd/web"

	"github.com/a-h/templ"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"rogchap.com/v8go"
)

func sveltemplHandler(componentName string, iso *v8go.Isolate) *templ.ComponentHandler {
	htmlOutput, err := sveltemplRenderToString(componentName, iso)
	if (err != nil) {
		return templ.Handler(web.SvelTemplComponent("<p style='color: red'>" + err.Error() + "</p>"))
	}

	return templ.Handler(web.SvelTemplBase(web.SvelTemplComponent(htmlOutput)))
}

func sveltemplRenderToString(componentName string, iso *v8go.Isolate) (string, error) {
			// Create a new Javascript context
			ctx := v8go.NewContext(iso)

			if (componentName =="") {
				return "", fmt.Errorf("you must pass in a component name to render")
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
				return "", fmt.Errorf("could not read JavaScript file %s", componentPath)
			}

			// Run the JS file which will load it into context
			_, err = ctx.RunScript(string(componentScript), componentPath)
			if err != nil {
				return "", fmt.Errorf("error executing JavaScript file %s", componentPath)
			}

			// Run the component render method
			componentOutput, err := ctx.RunScript(fmt.Sprintf("%s.render({server: true}).html", componentName), "output.js") // return a value in JavaScript back to Go
			if err != nil {
				return "", fmt.Errorf("error executing JavaScript function")
			}

			return componentOutput.String(), nil
}

func (s *FiberServer) RegisterFiberRoutes() {
	// mine
	iso := v8go.NewIsolate() // creates a new JavaScript VM

	s.App.Get("/basic", adaptor.HTTPHandler(templ.Handler(web.Basic())))
	s.App.Get("/code-only", adaptor.HTTPHandler(templ.Handler(web.CodeOnly("code <strong>only!</strong>"))))

	s.App.Get("/BoxOne", adaptor.HTTPHandler(sveltemplHandler("BoxOne", iso)))
	s.App.Get("/BoxTwo", adaptor.HTTPHandler(sveltemplHandler("BoxTwo", iso)))
	s.App.Get("/BoxThree", adaptor.HTTPHandler(sveltemplHandler("BoxThree", iso)))
	s.App.Get("/not-a-component", adaptor.HTTPHandler(sveltemplHandler("Nope", iso)))

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
