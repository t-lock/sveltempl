package server

import (
	"net/http"
	"sveltempl/cmd/web"

	"github.com/a-h/templ"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"rogchap.com/v8go"
)

func (s *FiberServer) RegisterFiberRoutes() {
	// creates a new JavaScript VM
	iso := v8go.NewIsolate() // creates a new JavaScript VM

	// routes
	s.App.Get("/", adaptor.HTTPHandler(templ.Handler(web.Home(iso))))
	s.App.Get("/page", adaptor.HTTPHandler(templ.Handler(web.Page(iso))))

	// blueprint assets
	s.App.Use("/assets", filesystem.New(filesystem.Config{
		Root:       http.FS(web.Files),
		PathPrefix: "assets",
		Browse:     false,
	}))
}

func (s *FiberServer) HelloWorldHandler(c *fiber.Ctx) error {
	resp := fiber.Map{
		"message": "Hello World",
	}

	return c.JSON(resp)
}
