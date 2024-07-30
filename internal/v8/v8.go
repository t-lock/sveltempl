package v8

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"rogchap.com/v8go"
)

type ContextKey string
var V8ContextKey ContextKey = "v8"

func GetV8Context(ctx context.Context) *v8go.Isolate {
	if iso, ok := ctx.Value(V8ContextKey).(*v8go.Isolate); ok {
		return iso
	}
	return nil
}

func V8Middleware(iso *v8go.Isolate) fiber.Handler {
	  return func(c *fiber.Ctx) error {
        ctx := context.WithValue(c.UserContext(), V8ContextKey, iso)
        c.SetUserContext(ctx)
        return c.Next()
    }
}
