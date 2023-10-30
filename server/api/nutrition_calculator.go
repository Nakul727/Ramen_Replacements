package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
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

// returns array of int from formatted string
func parseArray(str string) []int {
	if len(str) == 0 {
		return nil
	}

	var arr []int
	startSlice, endSlice := 1, 1
	for i := startSlice; i < len(str); i++ {
		if str[i] == ',' || str[i] == '}' {
			curInt, _ := strconv.Atoi(str[startSlice:endSlice])
			arr = append(arr, curInt)
			startSlice = i + 1
			endSlice = i + 1
		} else {
			endSlice++
		}
	}
	return arr
}

// returns an array of nutrition facts
func calculate_nutrition_facts(ingredients []Ingredient, amountString string) ([]float64, error) {
	amounts := parseArray(amountString)
	var apikey string = os.Getenv("API_KEY")
	if len(ingredients) == 0 {
		return nil, errors.New("no ingredients found")
	}
	var ingredientNutrition RecipeNutrition
	var recipeNutrition = make([]float64, 7)
	for i := 0; i < len(ingredients); i++ {
		idToQuery := ingredients[i].ID
		urlToQuery := "https://api.spoonacular.com/food/ingredients/" + fmt.Sprint(idToQuery) + "/information?apiKey=" + apikey +
			"&amount=" + fmt.Sprint(amounts[i]) + "&unit=grams"

		resp, err := http.Get(urlToQuery)
		if err != nil {
			return nil, errors.New("could not contact API")
		}

		if resp.StatusCode != 200 {
			return nil, errors.New("API authentication failed")
		}

		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, errors.New("error reading data")
		}

		// since nutrition info is not always returned in the same order, we first put it into a struct
		// then into an array to return
		var nutrition NutritionFacts
		if err := json.Unmarshal(body, &nutrition); err != nil {
			return nil, errors.New("error unmarshaling json data")
		} else {
			for i := 0; i < len(nutrition.Nutrition.Nutrients); i++ {
				switch nutrition.Nutrition.Nutrients[i].Name {
				case "Calories":
					ingredientNutrition.Calories += nutrition.Nutrition.Nutrients[i].Amount
				case "Fat":
					ingredientNutrition.Fat += nutrition.Nutrition.Nutrients[i].Amount
				case "Carbohydrates":
					ingredientNutrition.Carbohydrates += nutrition.Nutrition.Nutrients[i].Amount
				case "Protein":
					ingredientNutrition.Protein += nutrition.Nutrition.Nutrients[i].Amount
				case "Cholesterol":
					ingredientNutrition.Cholesterol += nutrition.Nutrition.Nutrients[i].Amount
				case "Sodium":
					ingredientNutrition.Sodium += nutrition.Nutrition.Nutrients[i].Amount
				case "Sugar":
					ingredientNutrition.Sugar += nutrition.Nutrition.Nutrients[i].Amount
				}
			}
			var arr []float64 = []float64{ingredientNutrition.Calories, ingredientNutrition.Carbohydrates, ingredientNutrition.Fat, ingredientNutrition.Protein,
				ingredientNutrition.Sodium, ingredientNutrition.Sugar, ingredientNutrition.Cholesterol}
			for i := 0; i < len(arr); i++ {
				recipeNutrition[i] += arr[i]
			}
		}
	}

	return recipeNutrition, nil
}
