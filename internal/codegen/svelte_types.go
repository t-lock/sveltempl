package codegen

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

// TODO make type-safe in a way that provides IDE completions
type components map[string]string

var ComponentMap = populateComponentMap("cmd/web/assets/svelte/")

func populateComponentMap(dir string) components {
	compMap := make(components)

	files, err := os.ReadDir(dir)
	if err != nil {
		log.Fatalf("Failed to read directory: %v", err)
	}

	for _, file := range files {
		if !file.IsDir() {
			filename := file.Name()
			parts := strings.SplitN(filename, "-", 2)
			if len(parts) == 2 {
				key := parts[0]
				value := filepath.Join(dir, filename)
				compMap[key] = strings.TrimPrefix(value, "cmd/web")
			} else {
				fmt.Printf("Skipping file with unexpected name format: %s\n", filename)
			}
		}
	}

	return compMap
}
