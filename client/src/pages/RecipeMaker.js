import React, { useState } from 'react';
import { Header } from "../components/header.js";
import { Footer } from "../components/footer.js"
import { useAuth } from '../AuthContext.js';
import { getUserInfo } from '../components/UserInfo.js';

function RecipeMaker() {

  //---------------------------------------------------------------------------

  const { isLoggedIn } = useAuth();
  const userInfo = getUserInfo();
  const [displayInformation, setDisplayInformation] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  //---------------------------------------------------------------------------

  // react hooks
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDesc] = useState("");
  const [postTime, setPostTime] = useState(null);

  const [tags, setTags] = useState([]);
  const [enteredTag, setEnteredTag] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const predefinedTags = ['Dairy', 'Vegan', 'Gluten-free', 'Vegetarian'];

  const [isPublic, setIsPublic] = useState(false);

  const [enteredIngredients, setEnteredIngredients] = useState("");
  const [enteredInstructions, setEnteredInstructions] = useState("");

  const [selectedAppliances, setSelectedAppliances] = useState({
    "Oven": false,
    "Stove": false,
    "Microwave": false,
    "Toaster": false,
    "Blender": false,
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
  const [costBreakdown, setCostBreakdown] = useState([]);

  const [nutrients, setNutrients] = useState({
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    protein: 0,
  });

  //---------------------------------------------------------------------------

  // Input Error handling function
  const checkEmptyFields = () => {
    const errors = [];
    if (!title.trim()) {
      errors.push('Title is empty');
    }
    if (!image.trim()) {
      errors.push('Image URL is empty');
    }
    if (!description.trim()) {
      errors.push('Description is empty');
    }
    if (!enteredIngredients.trim()) {
      errors.push('Ingredients are empty');
    }
    if (!enteredInstructions.trim()) {
      errors.push('Instructions are empty');
    }
    setErrorMessages(errors);
    return errors.length === 0;
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
      const apiUrl = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}
                      &servings=${servings}&includeNutrition=${includeNutrition}&language=${language}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `ingredientList=${encodeURIComponent(ingredientList)}`,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      else {
        // update the required hooks accordingly
        const jsonResponse = await response.json();
        console.log('Parsed Ingredients:', jsonResponse);


        // Calculate total cost and update the state
        const newTotalCost = jsonResponse.reduce((sum, item) => sum + item.estimatedCost.value, 0);
        const totalCostInCAD = (newTotalCost / 100) * conversionRate;
        setTotalCost(totalCostInCAD);
        setCostBreakdown(jsonResponse);

        // Parse nutritional information
        const nutrientInfo = jsonResponse.reduce((acc, item) => {
          item.nutrition.nutrients.forEach(nutrient => {
            if (nutrient.name === 'Carbohydrates') {
              acc.carbohydrates += nutrient.amount;
            } else if (nutrient.name === 'Fat') {
              acc.fat += nutrient.amount;
            } else if (nutrient.name === 'Protein') {
              acc.protein += nutrient.amount;
            } else if (nutrient.name === 'Calories') {
              acc.calories += nutrient.amount;
            }
          });
          return acc;
        }, {
          carbohydrates: 0,
          fat: 0,
          protein: 0,
          calories: 0,
        });
        setNutrients(nutrientInfo);

        setDisplayInformation(true);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setDisplayInformation(false);
    }
  };

  //---------------------------------------------------------------------------

  // Function to add a tag
  const addTag = () => {
    const tagToAdd = enteredTag.trim() || selectedTag.trim();
    if (tagToAdd !== '' && tags.indexOf(tagToAdd) === -1) {
      setTags([...tags, tagToAdd]);
      setEnteredTag('');
      setSelectedTag('');
    }
  };


  // Function to remove a tag
  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
  };

  //---------------------------------------------------------------------------


  // main handler function - handling the posting of the recipe
  // send the complete information regarding the recipe to the backend
  // includes things like title, desc, nutrition object, cost, etc.

  const handlePostRecipe = async () => {
    setPostTime(Math.floor(new Date().getTime() / 1000));

    if (!checkEmptyFields()) {
      return;
    }

    try {
      const backendApi = process.env.REACT_APP_BACKEND;
      const response = await fetch(`${backendApi}/recipe/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userInfo.userID,
          title: title,
          image: image,
          description: description,
          postTime: postTime,
          isPublic: isPublic,
          rating: 0,
          tags: tags,
          Ingredients: enteredIngredients,
          Instructions: enteredInstructions,
          Appliances: selectedAppliances,
          totalCost,
          CostBreakdown: costBreakdown,
          nutrients,
        }),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message
      } else {
        // Handle failure, e.g., show an error message
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };



  //---------------------------------------------------------------------------


  return (
    <div>
      <header>
        <Header />
      </header>

      {isLoggedIn ? (
        <div className="body_sections overflow-hidden pt-20">
          <div className="Form py-20 mx-56 mb-12 rounded-3xl" style={{ backgroundColor: "lightgrey" }}>

            {/* Recipe Maker */}
            {/*---------------------------------------------------------------------------*/}
            <div>
              <p className="font-arvo text-3xl text-center">Recipe Maker</p>
              <hr className='mx-auto w-80 mt-2 border border-black'></hr>
              <p className="font-arvo mt-2 text-sm text-center">Create Custom Recipe</p>
            </div>

            <div className="px-32 mt-24">
              <label className='mr-4'>Recipe Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="px-32 mt-4">
              <label className='mr-4'>Cover Image</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>

            <div className="px-32 mt-4">
              <label className='mr-4'>Description</label>
              <input type="text" value={description} onChange={(e) => setDesc(e.target.value)} />
            </div>

            {/* Ingredients */}
            <div className="flex px-32 mt-4">
              <p className='mr-4'>Ingredients</p>
              <textarea
                id="ingredientList"
                rows="5"
                cols="30"
                placeholder="Enter ingredients, one per line"
                value={enteredIngredients}
                onChange={(e) => setEnteredIngredients(e.target.value)}
              ></textarea>
            </div>


            {/* Instructions */}
            <div className="flex px-32 mt-4">
              <label className='mr-4'>Instructions</label>
              <textarea
                id="instructionList"
                rows="5"
                cols="30"
                placeholder="Enter instructions, one per line"
                value={enteredInstructions}
                onChange={(e) => setEnteredInstructions(e.target.value)}
              >
                {/* Display dynamic numbered list */}
                {enteredInstructions.split('\n').map((instruction, index) => (
                  <React.Fragment key={index}>
                    {index + 1}. {instruction}
                    {index < enteredInstructions.split('\n').length - 1 && '\n'}
                  </React.Fragment>
                ))}
              </textarea>
            </div>


            {/* Display appliance checkboxes */}
            <div className="flex flex-wrap px-32 mt-4">
              <label className='mr-4'>Select Appliances:</label>
              {Object.keys(selectedAppliances).map((appliance) => (
                <div key={appliance} className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    id={appliance}
                    checked={selectedAppliances[appliance]}
                    onChange={() => {
                      setSelectedAppliances(prevState => ({
                        ...prevState,
                        [appliance]: !prevState[appliance],
                      }));
                    }}
                  />
                  <label htmlFor={appliance} className="ml-2">{appliance}</label>
                </div>
              ))}
            </div>



            {/* Tags */}
            <div className="flex px-32 mt-4">
              <p>Tags</p>
              <div className="tags-container">
                {/* Display selected tags as buttons with remove option on hover */}
                {tags.map((tag, index) => (
                  <div key={index} className="tag">
                    <button
                      className="tag-button p-4 bg-slate-400 rounded-lg"
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
                  className="tag-dropdown"
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
                />
                {/* Button to add tag */}
                <button className="tag-add" onClick={addTag}>+</button>
              </div>
            </div>


            {/* Public/Private Checkbox */}
            <div className="flex px-32 mt-4">
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                />
                Public Recipe
              </label>
            </div>

            <div className="flex items-center justify-center my-8">
              <button className="font-arvo bg-white hover:bg-slate-200 rounded-xl px-12 py-4" onClick={handleIngredients}>Generate Cost and Nutrition</button>
            </div>

            {/* Display error messages */}
            {errorMessages.length > 0 && (
              <div className="error-messages">
                <p>Please fix the following issues:</p>
                <ul>
                  {errorMessages.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* If there are no errors and  */}
            {displayInformation && (
              <div>
                {/* Display the total cost */}
                <div className="flex items-center justify-center">
                  <p>Total Cost: {totalCost.toFixed(2)} CAD</p>
                </div>

                {/* Display nutrient information */}
                <div className="mt-8">
                  <h2>Nutrient Information</h2>
                  <p>Calories: {nutrients.calories.toFixed(2)} kcal</p>
                  <p>Carbohydrates: {nutrients.carbohydrates.toFixed(2)} g</p>
                  <p>Fat: {nutrients.fat.toFixed(2)} g</p>
                  <p>Protein: {nutrients.protein.toFixed(2)} g</p>
                </div>

                {/* Display cost breakdown as a table */}
                <table className="mt-8">
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Cost (USD)</th>
                      <th>Cost (CAD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costBreakdown.map((ingredient) => (
                      <tr key={ingredient.id}>
                        <td>{ingredient.original}</td>
                        <td>{(ingredient.estimatedCost.value / 100).toFixed(2)}</td>
                        <td>{((ingredient.estimatedCost.value / 100) * conversionRate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-center my-8">
              <button className="font-arvo bg-white hover:bg-slate-200 rounded-xl px-12 py-4" onClick={handlePostRecipe}>Post</button>
            </div>

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