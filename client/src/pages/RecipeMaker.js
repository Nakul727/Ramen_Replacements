import React, { useState } from "react";
import { Header } from "../components/header.js";
import { Footer } from "../components/footer.js";
import { useAuth } from "../AuthContext.js";
import { getUserInfo } from "../components/UserInfo.js";
import { useNavigate } from "react-router-dom";

function RecipeMaker() {
  //---------------------------------------------------------------------------

  // variables for component
  const { isLoggedIn } = useAuth();
  const userInfo = getUserInfo();

  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState("");
  const [displayInformation, setDisplayInformation] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  //---------------------------------------------------------------------------

  // react hooks for recipe information
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDesc] = useState("");
  const [enteredIngredients, setEnteredIngredients] = useState("");
  const [enteredInstructions, setEnteredInstructions] = useState("");

  const [tags, setTags] = useState([]);
  const [enteredTag, setEnteredTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const predefinedTags = ["Dairy", "Vegan", "Gluten-free", "Vegetarian"];

  const [isPublic, setIsPublic] = useState(false);

  const [selectedAppliances, setSelectedAppliances] = useState({
    Oven: false,
    Stove: false,
    Microwave: false,
    Toaster: false,
    Blender: false,
    "Air Fryer": false,
    "Grill/Barbecue": false,
    "Toaster Oven": false,
    "Waffle Iron": false,
    "Stand Mixer": false,
    "Electric Mixer": false,
    "Slow Cooker": false,
  });

  // Fields obtained from/needed by external API
  const conversionRate = 1.38;
  const [totalCost, setTotalCost] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState({});

  const [nutrients, setNutrients] = useState({
    calories: 0,

    fat: 0,
    saturated_fat: 0,
    carbohydrates: 0,
    protein: 0,

    sugar: 0,
    cholestrol: 0,
    sodium: 0,
  });

  //---------------------------------------------------------------------------

  // Input Error handling function
  const checkEmptyFields = () => {
    const errors = [];
    if (!title.trim()) {
      errors.push("Title is empty");
    }
    if (!image.trim()) {
      errors.push("Image URL is empty");
    }
    if (!description.trim()) {
      errors.push("Description is empty");
    }
    if (!enteredIngredients.trim()) {
      errors.push("Ingredients are empty");
    }
    if (!enteredInstructions.trim()) {
      errors.push("Instructions are empty");
    }
    setErrorMessages(errors);
    return errors.length === 0;
  };

  //---------------------------------------------------------------------------

  const handleAutoFill = () => {

    // demo data as a object
    const demoData = {
      title: "The Lengendary 276 Sandwich",
      image: "https://images.nightcafe.studio/jobs/DjXaUmDc5oRjE1d7uRqR/DjXaUmDc5oRjE1d7uRqR--1--76ikb.jpg?tr=w-1600,c-at_max",
      description: "This is the most prestigous sandwich ever created. This recipe is not just for a demo, but for the world to remember as 'The legendary sandwich of Steve's 276 class'",
      enteredInstructions: "Use the ingredients to make the sandwich\nEat it",
    };

    // Set the state with demo data
    setTitle(demoData.title);
    setImage(demoData.image);
    setDesc(demoData.description);
    setEnteredInstructions(demoData.enteredInstructions);
    setTags(["DemoTag1", "Vegan"]);

    setSelectedAppliances({
      Oven: false,
      Microwave: false,
      Blender: false,
      Stove: true,
      Toaster: true,
      "Air Fryer": false,
      "Grill/Barbecue": false,
      "Toaster Oven": false,
      "Waffle Iron": false,
      "Stand Mixer": false,
      "Electric Mixer": false,
      "Slow Cooker": false,
    });
  };

  //---------------------------------------------------------------------------

  // main handler function - handling cost and nutritional component rendering
  // get the information from the field of ingredients (External API)
  // call the spoonacular api -> update the cost and nutritional react hooks

  const handleIngredients = async () => {
    if (!checkEmptyFields()) {
      return;
    }

    try {
      const ingredientList = enteredIngredients;
      const servings = 1;
      const includeNutrition = true;
      const language = "en";

      const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
      const apiUrl = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}&servings=${servings}&includeNutrition=${includeNutrition}&language=${language}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `ingredientList=${encodeURIComponent(ingredientList)}`,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        // update the required hooks accordingly
        const jsonResponse = await response.json();
        console.log("Parsed Ingredients:", jsonResponse);

        // Check if any ingredients were not found
        const notFoundIngredients = jsonResponse.filter(
          (ingredient) => !ingredient.estimatedCost || !ingredient.estimatedCost.value
        );

        if (notFoundIngredients.length > 0) {
          // Display an error message for not found ingredients
          const notFoundIngredientNames = notFoundIngredients.map(
            (ingredient) => ingredient.original
          );
          const errorMessage = `Some ingredients not found: ${notFoundIngredientNames.join(
            ", "
          )}. Please adjust your ingredient wording.`;

          setErrorMessages([errorMessage]);
          setDisplayInformation(false);
          return;
        }

        // Calculate total cost and update the state
        const newTotalCost = jsonResponse.reduce(
          (sum, item) => sum + item.estimatedCost.value,
          0
        );
        const totalCostInCAD = (newTotalCost / 100) * conversionRate;
        setTotalCost(totalCostInCAD);

        // Create an array of objects for costBreakdown
        const costBreakdownData = jsonResponse.map((ingredient) => ({
          name: ingredient.original,
          costUSD: (ingredient.estimatedCost.value / 100).toFixed(2),
          costCAD: (
            (ingredient.estimatedCost.value / 100) *
            conversionRate
          ).toFixed(2),
        }));
        setCostBreakdown(costBreakdownData);

        // Parse nutritional information
        const nutrientInfo = jsonResponse.reduce(
          (acc, item) => {
            item.nutrition.nutrients.forEach((nutrient) => {
              if (nutrient.name === "Carbohydrates") {
                acc.carbohydrates += nutrient.amount;
              } else if (nutrient.name === "Fat") {
                acc.fat += nutrient.amount;
              } else if (nutrient.name === "Saturated Fat") {
                acc.saturated_fat += nutrient.amount;
              } else if (nutrient.name === "Protein") {
                acc.protein += nutrient.amount;
              } else if (nutrient.name === "Calories") {
                acc.calories += nutrient.amount;
              } else if (nutrient.name === "Sugar") {
                acc.sugar += nutrient.amount;
              } else if (nutrient.name === "Cholesterol") {
                acc.cholestrol += nutrient.amount;
              } else if (nutrient.name === "Sodium") {
                acc.sodium += nutrient.amount;
              }
            });
            return acc;
          },
          {
            carbohydrates: 0,
            fat: 0,
            protein: 0,
            calories: 0,
          }
        );
        setNutrients(nutrientInfo);

        // display the information
        setDisplayInformation(true);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setDisplayInformation(false);
    }
  };

  //---------------------------------------------------------------------------

  // Function to add a tag
  const addTag = () => {
    const tagToAdd = enteredTag.trim() || selectedTag.trim();
    if (tagToAdd !== "" && tags.indexOf(tagToAdd) === -1) {
      setTags([...tags, tagToAdd]);
      setEnteredTag("");
      setSelectedTag("");
    }
  };

  // Function to remove a tag
  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  //---------------------------------------------------------------------------

  // main handler function - handling the posting of the recipe
  // send the complete information regarding the recipe to the backend
  // includes things like title, desc, nutrition object, cost, etc.

  const handlePostRecipe = async () => {
    if (!checkEmptyFields()) {
      return;
    }

    try {
      const backendApi = process.env.REACT_APP_BACKEND;

      // Check userInfo before sending
      if (!userInfo || !userInfo.userID) {
        console.error("User information is missing or incomplete.");
        return;
      }

      setDisplayInformation(false);
      setLoadingMessage("Posting Recipe...");
      setDisplayInformation(true);

      const postData = {
        userID: userInfo.userID, // int
        username: userInfo.username, // string

        title: title, // string
        image: image, // string
        description: description, // string
        Ingredients: enteredIngredients, // string (parse with \n)
        Instructions: enteredInstructions, // string (parse with \n)

        isPublic: isPublic, // bool value

        postTime: 0, // int64 (calcluated in backend)
        likes: 0, // int
        totalCost: totalCost, // float64

        tags: tags, // array of strings

        Appliances: selectedAppliances, // json object {"key": boolean}
        nutrients: nutrients, // json object {"key": float64}
        CostBreakdown: costBreakdown, // array of json object [{"key": float64, "xyz: 123"}, {}]
      };

      const response = await fetch(`${backendApi}/recipe/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server error:", errorResponse);
        setLoadingMessage("Failed to post recipe. Please try again.");
        setDisplayInformation(false);
      } else {
        console.log("Recipe successfully posted");
        setLoadingMessage("Recipe Posted");
        setDisplayInformation(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);

      }
    } catch (error) {
      console.error("Error:", error);
      setLoadingMessage("An error occurred. Please try again.");
      setDisplayInformation(false);
    }
  };

  //---------------------------------------------------------------------------

  return (
    <div>
      <header>
        <Header />
      </header>

      {isLoggedIn ? (
        <div className="body_sections overflow-hidden pt-20 bg-amber-200">
          <div className="Form py-20 mx-56 mb-12 rounded-3xl border border-black bg-zinc-300">
            {/* Recipe Maker */}
            {/*---------------------------------------------------------------------------*/}
            <div>
              <p className="font-arvo text-3xl text-center">Recipe Maker</p>
              <hr className="mx-auto w-80 mt-2 border border-black"></hr>
              <p className="font-arvo mt-2 text-sm text-center">
                Create Custom Recipe
              </p>
            </div>

            <div className="flex items-center mt-24 mb-8">
              <label className="font-arvo font-arvo_bold text-gray-800 mb-2 mr-8 ml-32">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block rounded-xl w-96 p-2 focus:outline-none focus-border-indigo-500 text-gray-700"
              />
            </div>

            <div className="flex items-center mt-4 mb-8">
              <label className="font-arvo font-arvo_bold text-gray-800 mb-2 mr-5 ml-32">
                Image
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="block rounded-xl w-96 p-2 focus:outline-none focus-border-indigo-500 text-gray-700"
              />
            </div>

            <div className="flex items-center justify-center my-8">
              <button
                className="font-arvo bg-white hover:bg-slate-200 rounded-xl px-12 py-4"
                onClick={handleAutoFill}
              >
                Auto Fill Demo
              </button>
            </div>

            <hr className="mx-32 w-auto my-6 border-black"></hr>

            <div className="flex items-center mt-4 mb-8">
              <label className="font-arvo font-arvo_bold text-gray-800 mb-2 mr-5 ml-32">
                Description
              </label>
              <div className="flex-grow mr-32">
                <textarea
                  value={description}
                  onChange={(e) => setDesc(e.target.value)}
                  className="block rounded-xl w-full p-2 focus:outline-none focus-border-indigo-500 text-gray-700"
                  rows="2"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="flex items-center mt-4 mb-8">
              <label className="font-arvo font-arvo_bold text-gray-800 mb-2 mr-5 ml-32">
                Ingredients
              </label>
              <div className="flex-grow mr-32">
                <textarea
                  id="ingredientList"
                  rows="5"
                  cols="30"
                  placeholder="Enter ingredients, one per line"
                  value={enteredIngredients}
                  onChange={(e) => setEnteredIngredients(e.target.value)}
                  className="block rounded-xl w-full p-2 focus:outline-none focus-border-indigo-500 text-gray-700"
                ></textarea>
              </div>
            </div>

            {/* Instructions */}
            <div className="flex items-center mt-4 mb-8">
              <label className="font-arvo font-arvo_bold text-gray-800 mb-2 mr-5 ml-32">
                Instructions
              </label>
              <div className="flex-grow mr-32">
                <textarea
                  id="instructionList"
                  rows="5"
                  cols="30"
                  placeholder="Enter instructions, one per line"
                  value={enteredInstructions}
                  onChange={(e) => setEnteredInstructions(e.target.value)}
                  className="block rounded-xl w-full p-2 focus:outline-none focus-border-indigo-500 text-gray-700"
                ></textarea>
              </div>
            </div>

            <hr className="mx-32 w-auto my-6 border-black"></hr>

            {/* Display appliance checkboxes */}
            <div className="flex flex-wrap items-center px-32 mt-4 mb-16">
              <label className="font-arvo font-arvo_bold text-gray-800 mr-4 mb-4">
                Extra Appliances
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.keys(selectedAppliances).map((appliance) => (
                  <div key={appliance} className="flex items-center">
                    <input
                      type="checkbox"
                      id={appliance}
                      checked={selectedAppliances[appliance]}
                      onChange={() => {
                        setSelectedAppliances((prevState) => ({
                          ...prevState,
                          [appliance]: !prevState[appliance],
                        }));
                      }}
                    />
                    <label
                      htmlFor={appliance}
                      className="font-arvo text-gray-800 ml-2"
                    >
                      {appliance}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center px-32 mt-4">
              <label className="font-arvo font-arvo_bold text-gray-800 mb-2 mr-4">
                Tags
              </label>
              <div className="tags-container flex flex-wrap items-center">
                {/* Display selected tags as buttons with remove option on hover */}
                {tags.map((tag, index) => (
                  <div key={index} className="tag flex items-center mb-2 mr-2">
                    <button
                      className="tag-button p-3 bg-slate-400 font-arvo rounded-xl mr-2"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                    </button>
                    <button
                      className="tag-remove"
                      onClick={() => removeTag(tag)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                ))}
                {/* Dropdown for predefined tags */}
                <select
                  className="tag-dropdown p-2 rounded-md border border-gray-300 mr-2 font-arvo"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="">Select a tag</option>
                  {predefinedTags.map((tag, index) => (
                    <option key={index} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                {/* Input for custom tags */}
                <input
                  type="text"
                  placeholder="Add a custom tag"
                  value={enteredTag}
                  onChange={(e) => setEnteredTag(e.target.value)}
                  className="p-2 rounded-md border border-gray-300 mr-2 font-arvo"
                />
                {/* Button to add tag */}
                <button
                  className="tag-add p-2 bg-zinc-400 hover:bg-zinc-500 text-white rounded-md font-arvo"
                  onClick={addTag}
                >
                  Add Tag
                </button>
              </div>
            </div>

            <hr className="mx-32 w-auto my-6 border-black"></hr>



            {/*---------------------------------------------------------------------------*/}
            {/* External API Call*/}
            <div className="flex items-center justify-center my-8">
              <button
                className="font-arvo bg-white hover:bg-slate-200 rounded-xl px-12 py-4"
                onClick={handleIngredients}
              >
                Generate Cost and Nutrition
              </button>
            </div>

            {/* Display error messages */}
            {errorMessages.length > 0 && (
              <div className="error-messages mx-32 text-red-800 text-center">
                <ul>
                  {errorMessages.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/*---------------------------------------------------------------------------*/}

            {/* If API call was successful, display results and Post button to RR Backend */}
            {displayInformation && (
              <div className="mx-32">
                <div className="flex mt-8">
                  <div className="flex-grow mr-8">
                    <h2 className="font-arvo">Nutrient Information</h2>
                    <table className="table-auto border-collapse border border-black w-full">
                      <thead>
                        <tr>
                          <th className="border border-black px-4 py-2">
                            Nutrient
                          </th>
                          <th className="border border-black px-4 py-2">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-black px-4 py-2">
                            Calories
                          </td>
                          <td className="border border-black px-4 py-2">
                            {nutrients.calories.toFixed(2)} kcal
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black px-4 py-2">
                            Carbohydrates
                          </td>
                          <td className="border border-black px-4 py-2">
                            {nutrients.carbohydrates.toFixed(2)} g
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black px-4 py-2">Fat</td>
                          <td className="border border-black px-4 py-2">
                            {nutrients.fat.toFixed(2)} g
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black px-4 py-2">
                            Protein
                          </td>
                          <td className="border border-black px-4 py-2">
                            {nutrients.protein.toFixed(2)} g
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Right Column - Cost Information */}
                  <div>
                    <div className="flex items-center justify-center">
                      <p className="font-arvo">
                        Total Cost: {totalCost.toFixed(2)} CAD
                      </p>
                    </div>

                    <div className="mt-8">
                      <h2 className="font-arvo">Cost Breakdown</h2>
                      <table className="table-auto border-collapse border border-black w-full">
                        <thead>
                          <tr>
                            <th className="border border-black px-4 py-2">
                              Ingredient
                            </th>
                            <th className="border border-black px-4 py-2">
                              Cost (CAD)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {costBreakdown.map((ingredient, index) => (
                            <tr key={index}>
                              <td className="border border-black px-4 py-2">
                                {ingredient.name}
                              </td>
                              <td className="border border-black px-4 py-2">
                                {ingredient.costCAD}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Public/Private Checkbox */}
                <div className="flex mt-12">
                  <label className="font-arvo font-arvo_bold text-gray-800">
                    Visibility:
                  </label>

                  <div className="ml-8 flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                        className="h-5 w-5 text-indigo-600"
                      />
                      <span className="font-arvo ml-2">Public</span>
                    </label>

                    <label className="ml-8 flex items-center">
                      <input
                        type="checkbox"
                        checked={!isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                        className="h-5 w-5 text-indigo-600"
                      />
                      <span className="font-arvo ml-2">Private</span>
                    </label>
                  </div>
                </div>

                {/*---------------------------------------------------------------------------*/}
                {/* Recipe Post Button */}
                <div className="flex items-center justify-center my-8">
                  <button
                    className="font-arvo bg-white hover:bg-slate-200 rounded-xl px-12 py-4"
                    onClick={handlePostRecipe}
                  >
                    Post
                  </button>
                </div>

                {loadingMessage && (
                  <div className="mx-32 mt-4 text-center text-zinc-900">
                    <p>{loadingMessage}</p>
                  </div>
                )}
                {/*---------------------------------------------------------------------------*/}
              </div>
            )}
          </div>
        </div>
      ) : (
        // if the user is not logged in
        <div className="body-sections">
          <div className="mt-40">
            <p>You are not logged In</p>
          </div>
        </div>
      )}

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default RecipeMaker;
