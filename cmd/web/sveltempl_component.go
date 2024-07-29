package web

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"

	"github.com/a-h/templ"
	"rogchap.com/v8go"
)

func SvelTemplComponent(componentName string, iso *v8go.Isolate, componentProps []byte) templ.Component {
	htmlOutput, err := svelTemplRenderToString(componentName, iso, componentProps)

	if err != nil {
		return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
			_, err := io.WriteString(w, "<p style='color: red'>"+err.Error()+"</p>")
			return err
		})
	}

	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		_, err := io.WriteString(w, htmlOutput)
		return err
	})
}

func svelTemplRenderToString(componentName string, iso *v8go.Isolate, componentProps []byte) (string, error) {
	// Create a new Javascript context
	ctx := v8go.NewContext(iso)

	if componentName == "" {
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

	// Handle props
	var propsJson string
	switch {
	case componentProps == nil:
		propsJson = "{}"
	case !json.Valid(componentProps):
		return "", fmt.Errorf("props must be valid json")
	default:
		propsJson = string(componentProps)
	}

	_, err = ctx.RunScript(fmt.Sprintf(`const props = {server: true, ...JSON.parse('%s')};`, propsJson), "inline scripting")
	if err != nil {
		return "", fmt.Errorf("error parsing props")
	}

	// Run the component render method
	componentOutput, err := ctx.RunScript(fmt.Sprintf("%s.render(props).html", componentName), "output.js") // return a value in JavaScript back to Go
	if err != nil {
		return "", fmt.Errorf("error executing JavaScript function")
	}

	return componentOutput.String(), nil
}