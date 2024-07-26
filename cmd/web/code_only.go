package web

import (
	"context"
	"io"

	"github.com/a-h/templ"
)

func CodeOnly(text string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		_, err := io.WriteString(w, "<button>"+text+"</button>")
		return err
	})
}
