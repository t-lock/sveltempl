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
	// mine
	iso := v8go.NewIsolate() // creates a new JavaScript VM

	s.App.Get("/basic", adaptor.HTTPHandler(templ.Handler(web.Basic())))
	s.App.Get("/code-only", adaptor.HTTPHandler(templ.Handler(web.CodeOnly("code <strong>only!</strong>"))))

	s.App.Get("/boxone", adaptor.HTTPHandler(templ.Handler(web.SvelTemplComponent("BoxOne", iso, nil))))
	s.App.Get("/boxtwo", adaptor.HTTPHandler(templ.Handler(web.SvelTemplComponent("BoxTwo", iso, nil))))
	s.App.Get("/boxthree", adaptor.HTTPHandler(templ.Handler(web.SvelTemplComponent("BoxThree", iso, nil))))
	s.App.Get("/not-a-component", adaptor.HTTPHandler(templ.Handler(web.SvelTemplComponent("Nope", iso, nil))))
	s.App.Get("/props", adaptor.HTTPHandler(templ.Handler(web.PropsExample(iso))))
	s.App.Get("/", adaptor.HTTPHandler(templ.Handler(web.PageOne(iso))))

	// blueprint
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
