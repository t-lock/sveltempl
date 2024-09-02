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

var ComponentMap = populateComponentMap("cmd/web/assets/js/client")

// populateComponentMap recursively traverses the given directory and populates the component map
func populateComponentMap(dir string) components {
	compMap := make(components)
	err := traverseDirectory(dir, compMap)
	if err != nil {
		log.Fatalf("Failed to populate component map: %v", err)
	}
	return compMap
}

func traverseDirectory(dir string, compMap components) error {
	files, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("failed to read directory %s: %v", dir, err)
	}

	for _, file := range files {
		filePath := filepath.Join(dir, file.Name())

		if file.IsDir() {
			// Recursively traverse subdirectories
			if err := traverseDirectory(filePath, compMap); err != nil {
				return err
			}
		} else {
			filename := file.Name()
			parts := strings.SplitN(filename, "-", 2)
			if len(parts) == 2 {
				key := parts[0]
				value := filePath

				// Extract the relative path
				relPath, _ := filepath.Rel("cmd/web/assets/js/client", dir)
				if relPath != "." {
					key = filepath.Join(relPath, key)
				}

				compMap[key] = strings.TrimPrefix(value, "cmd/web")
			} else {
				fmt.Printf("Skipping file with unexpected name format: %s\n", filename)
			}
		}
	}

	return nil
}
