package v8

import (
	"context"

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
