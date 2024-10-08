package web

import (
	"encoding/json"
	"io"
	"net/http"
)

func TrelloHandler(w http.ResponseWriter, r *http.Request) {
	// Read the body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Unmarshal the JSON into a Board struct
	var newBoard Board
	err = json.Unmarshal(body, &newBoard)
	if err != nil {
		http.Error(w, "Error unmarshaling JSON", http.StatusBadRequest)
		return
	}

	// Mutate the global board with the new board
	updateBoard(newBoard, &GlobalBoard)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Board updated successfully"})
}

type Board []Col

type Col struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Items []Item `json:"items"`
}

type Item struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

var colors = []string{"#75ADC7", "#85C49B", "#E0B386", "#D48D98", "#FFF099"}

var GlobalBoard = Board{
	{
		ID:   1,
		Name: "TODO",
		Items: []Item{
			{ID: 41, Name: "item41", Color: colors[0]},
			{ID: 42, Name: "item42", Color: colors[1]},
			{ID: 43, Name: "item43", Color: colors[2]},
			{ID: 44, Name: "item44", Color: colors[3]},
			{ID: 45, Name: "item45", Color: colors[4]},
			{ID: 46, Name: "item46", Color: colors[0]},
			{ID: 47, Name: "item47", Color: colors[1]},
			{ID: 48, Name: "item48", Color: colors[2]},
			{ID: 49, Name: "item49", Color: colors[3]},
		},
	},
	{
		ID:    2,
		Name:  "DOING",
		Items: []Item{},
	},
	{
		ID:    3,
		Name:  "DONE",
		Items: []Item{},
	},
}

func updateBoard(nb Board, ob *Board) {
	*ob = nb
}
