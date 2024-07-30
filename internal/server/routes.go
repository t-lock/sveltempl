package server

import (
	"net/http"
	"sveltempl/cmd/web"
	v8 "sveltempl/internal/v8"

	"github.com/a-h/templ"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"rogchap.com/v8go"
)

func (s *FiberServer) RegisterFiberRoutes() {
	// create a new JavaScript VM and expose it via middleware/context to all routes
	iso := v8go.NewIsolate()
	s.App.Use(v8.V8Middleware(iso))

	// routes
	s.App.Get("/", svelTemplHandler(web.Home()))
	s.App.Get("/page", svelTemplHandler(web.Page()))
	s.App.Get("/no-svelte", adaptor.HTTPHandler(templ.Handler(web.NoSvelte())))

	// blueprint assets
	s.App.Use("/assets", filesystem.New(filesystem.Config{
		Root:       http.FS(web.Files),
		PathPrefix: "assets",
		Browse:     false,
	}))
}


// custom handler exposes templ render function so that I can get ctx into it
// ? this might be a hack and likely not the best way to do this
func svelTemplHandler(component templ.Component) func(*fiber.Ctx) error {
    return func(c *fiber.Ctx) error {
			c.Set(fiber.HeaderContentType, fiber.MIMETextHTMLCharsetUTF8)

			ctx := c.UserContext()
			w := c.Response().BodyWriter()

			component.Render(ctx, w)
			return nil
    }
}
