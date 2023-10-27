package api

// Nutrition facts stores basic nutrition facts about its associated recipe
type NutritionFacts struct {
	ID            int `json:"ID"` // note - ID is the ID of the associated recipe
	Calories      int `json:"Calories"`
	Protein       int `json:"Protein"`
	Carbohydrates int `json:"Carbohydrates"`
	Sugar         int `json:"Sugar"`
	Cholesterol   int `json:"Cholesterol"`
	Sodium        int `json:"Sodium"`
}

func calculate_nutrition(r Recipe) {

}
