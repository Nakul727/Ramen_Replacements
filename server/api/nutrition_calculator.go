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
	Sugar         float64 `json:"sugar"`
	Sodium        float64 `json:"sodium"`
	Cholesterol   float64 `json:"cholesterol"`
}

func calculate_nutrition_facts(ingredients []Ingredient) ([]float64, []int, error) {
	var apikey string = os.Getenv("API_KEY")
	if len(ingredients) == 0 {
		return nil, nil, errors.New("no ingredients found")
	}
	var recNutrition RecipeNutrition
	amounts := make([]int, len(ingredients))
	for i := 0; i < len(ingredients); i++ {
		idToQuery := ingredients[i].ID
		amount := ingredients[i].Amount
		amounts[i] = ingredients[i].Amount
		urlToQuery := "https://api.spoonacular.com/food/ingredients/" + fmt.Sprint(idToQuery) + "/information?apiKey=" + apikey +
			"&amount=" + fmt.Sprint(amount) + "&unit=grams"

		resp, err := http.Get(urlToQuery)
		if err != nil {
			return nil, nil, errors.New("could not contact API")
		}

		if resp.StatusCode != 200 {
			return nil, nil, errors.New("API authentication failed")
		}

		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, nil, errors.New("error reading data")
		}

		var nutrition NutritionFacts
		if err := json.Unmarshal(body, &nutrition); err != nil {
			return nil, nil, errors.New("error unmarshaling json data")
		} else {
			for i := 0; i < len(nutrition.Nutrition.Nutrients); i++ {
				switch nutrition.Nutrition.Nutrients[i].Name {
				case "Calories":
					recNutrition.Calories += nutrition.Nutrition.Nutrients[i].Amount
				case "Fat":
					recNutrition.Fat += nutrition.Nutrition.Nutrients[i].Amount
				case "Carbohydrates":
					recNutrition.Carbohydrates += nutrition.Nutrition.Nutrients[i].Amount
				case "Protein":
					recNutrition.Protein += nutrition.Nutrition.Nutrients[i].Amount
				case "Cholesterol":
					recNutrition.Cholesterol += nutrition.Nutrition.Nutrients[i].Amount
				case "Sodium":
					recNutrition.Sodium += nutrition.Nutrition.Nutrients[i].Amount
				case "Sugar":
					recNutrition.Sugar += nutrition.Nutrition.Nutrients[i].Amount
				}
			}

			fmt.Printf("testing: %f %f %f %f %f %f %f", recNutrition.Calories, recNutrition.Carbohydrates, recNutrition.Fat,
				recNutrition.Protein, recNutrition.Sodium, recNutrition.Sugar, recNutrition.Cholesterol)
		}
	}
	var arr []float64 = []float64{recNutrition.Calories, recNutrition.Carbohydrates, recNutrition.Fat, recNutrition.Protein,
		recNutrition.Sodium, recNutrition.Sugar, recNutrition.Cholesterol}
	return arr, amounts, nil
}
