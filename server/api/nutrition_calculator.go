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
	ID            int      `json:"id"`
	Original      string   `json:"original"`
	OriginalName  string   `json:"originalName"`
	Name          string   `json:"name"`
	Amount        float64  `json:"amount"`
	Unit          string   `json:"unit"`
	UnitShort     string   `json:"unitShort"`
	UnitLong      string   `json:"unitLong"`
	PossibleUnits []string `json:"possibleUnits"`
	EstimatedCost struct {
		Value float64 `json:"value"`
		Unit  string  `json:"unit"`
	} `json:"estimatedCost"`
	Consistency       string        `json:"consistency"`
	ShoppingListUnits []string      `json:"shoppingListUnits"`
	Aisle             string        `json:"aisle"`
	Image             string        `json:"image"`
	Meta              []interface{} `json:"meta"`
	Nutrition         struct {
		Nutrients []struct {
			Name                string  `json:"name"`
			Amount              float64 `json:"amount"`
			Unit                string  `json:"unit"`
			PercentOfDailyNeeds float64 `json:"percentOfDailyNeeds"`
		} `json:"nutrients"`
		Properties []struct {
			Name   string  `json:"name"`
			Amount float64 `json:"amount"`
			Unit   string  `json:"unit"`
		} `json:"properties"`
		Flavonoids []struct {
			Name   string  `json:"name"`
			Amount float64 `json:"amount"`
			Unit   string  `json:"unit"`
		} `json:"flavonoids"`
		CaloricBreakdown struct {
			PercentProtein float64 `json:"percentProtein"`
			PercentFat     float64 `json:"percentFat"`
			PercentCarbs   float64 `json:"percentCarbs"`
		} `json:"caloricBreakdown"`
		WeightPerServing struct {
			Amount int    `json:"amount"`
			Unit   string `json:"unit"`
		} `json:"weightPerServing"`
	} `json:"nutrition"`
	CategoryPath []string `json:"categoryPath"`
}

// recipes store simplified nutrition facts
type RecipeNutrition struct {
	Calories      float64 `json:"calories"`
	Protein       float64 `json:"protein"`
	Fat           float64 `json:"fat"`
	Carbohydrates float64 `json:"carbohydrates"`
	Sodium        float64 `json:"sodium"`
	Cholesterol   float64 `json:"cholesterol"`
}

func calculate_nutrition_facts(ingredients []Ingredient) (*RecipeNutrition, error) {
	var apikey string = os.Getenv("API_KEY")

	if len(ingredients) == 0 {
		return nil, errors.New("no ingredients found")
	}

	idToQuery := ingredients[0].ID
	urlToQuery := "https://api.spoonacular.com/food/ingredients/" + fmt.Sprint(idToQuery) + "/information?apiKey=" + apikey +
		"&amount=1&unit=grams"

	resp, err := http.Get(urlToQuery)
	if err != nil {
		return nil, errors.New("could not contact API")
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.New("error reading data")
	}

	var nutrition NutritionFacts
	// var recNutrition RecipeNutrition
	if err := json.Unmarshal(body, &nutrition); err != nil {
		return nil, errors.New("error unmarshaling json data")
	} else {
		fmt.Println(nutrition.ID)
		fmt.Println(nutrition.Name)
		fmt.Println(nutrition.Amount)
		for i := 0; i < len(nutrition.Nutrition.Nutrients); i++ {
			fmt.Printf("there are %f %s in this\n", nutrition.Nutrition.Nutrients[i].Amount, nutrition.Nutrition.Nutrients[i].Name)
		}
	}
	return nil, nil
}
