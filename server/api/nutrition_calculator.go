package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
)

// Nutrition facts stores basic nutrition facts about its associated recipe
type NutritionFacts struct {
	ID            int     `json:"ID"` // note - ID is the ID of the associated recipe
	Calories      float64 `json:"Calories"`
	Protein       float64 `json:"Protein"`
	Carbohydrates float64 `json:"Carbohydrates"`
	Sugar         float64 `json:"Sugar"`
	Cholesterol   float64 `json:"Cholesterol"`
	Sodium        float64 `json:"Sodium"`
}

var apikey string = os.Getenv("API_KEY")

func post_nutrition_facts(ingredients []Ingredient) error {
	fmt.Println(apikey)
	idToQuery := ingredients[0].ID
	urlToQuery := "https://api.spoonacular.com/food/ingredients/" + fmt.Sprint(idToQuery) + "/information?apiKey=" + apikey

	resp, err := http.Get(urlToQuery)
	if err != nil {
		return errors.New("could not contact API")
	}

	var nutrition NutritionFacts

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return errors.New("error reading JSON data from API")
	}

	if err := json.Unmarshal(body, &nutrition); err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Printf("ID: %d\n", nutrition.ID)
		fmt.Printf("Calories: %f\n", nutrition.Calories)
		fmt.Printf("Protein: %f\n", nutrition.Protein)
		fmt.Printf("Carbohydrates: %f\n", nutrition.Carbohydrates)
		fmt.Printf("Sugar: %f\n", nutrition.Sugar)
		fmt.Printf("Cholesterol: %f\n", nutrition.Cholesterol)
		fmt.Printf("Sodium: %f\n", nutrition.Sodium)
	}

	return nil
}
