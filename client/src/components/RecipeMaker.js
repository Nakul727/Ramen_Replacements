import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom'
import { getUserInfo } from '../components/UserInfo.js';

// returns integer value for appliance bit field
function calculateAppliancesValue(arr) {
  var curIndex = 1;
  var curValue = 0;
  for(var i = 0; i < arr.length; i++) {
    if(arr[i]) {
      curValue += curIndex;
      curIndex *= 2;
    }
  }
  return curValue
}

function getUserID() {
  return getUserInfo.userID
}

class RecipeMaker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publicRecipe: false,
      userInfo: '',
      title: '',
      description: '',
      steps: [''],
      ingredients: [''],
      amounts: [],
      picture: '',
      appliances: [false, false, false, false, false, false, false, false, false, false, false, false],
      applianceList: ["Oven", "Stove", "Microwave", "Toaster", "Blender", "Air Fryer", "Grill/Barbecue", "Toaster Oven", "Waffle Iron", "Stand Mixer", "Electric Mixer", "Slow Cooker"],
      result: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleCheckboxChange = (index) => {
    this.setState((prevState) => {
      const appliances = [...prevState.appliances];
      appliances[index] = !appliances[index];
      return { appliances };
    });
  }

  handlePublicChange = () => {
    this.setState((prevState) => ({
      publicRecipe: !prevState.publicRecipe
    }));
  }

  addStep = () => {
    this.setState((prevState) => ({
      steps: [...prevState.steps, ''],
    }));
  }

  removeStep = (index) => {
    this.setState((prevState) => {
      const steps = [...prevState.steps];
      steps.splice(index, 1);
      return { steps };
    });
  }

  addIngredient = () => {
    this.setState((prevState) => ({
      ingredients: [...prevState.ingredients, ''],
    }));
  }

  removeIngredient = (index) => {
    this.setState((prevState) => {
      const ingredients = [...prevState.ingredients];
      ingredients.splice(index, 1);
      return { ingredients };
    });
  }

  handleSubmit = async () => {
    const { publicRecipe, title, description, steps, ingredients, amounts, picture, appliances } = this.state;
    let result = ''
    var stepsString = "";
    for (var i = 0; i < steps.length; i++) {
      // add symbols to number so we know what are steps and what numbers are added by users
      stepsString += "$$" + String(i + 1) + "$$: " + steps[i];
    }
    var ingredientsString = "{'";
    var count = 1;
    if (ingredients.length > 0) {
      ingredientsString += ingredients[0] + "'"
    }
    for (var i = 1; i < ingredients.length; i++) {
      ingredientsString += ",'" + ingredients[i] + "'"
    }
    ingredientsString += "}"
    // convert to SQL friendy array string
    var amountsString = "{"
    if(amounts.length > 0) {
      amountsString += amounts[0]
    }
    for (var i = 1; i < amounts.length; i++) {
      amountsString += "," + amounts[i]
    }
    amountsString += "}"
  
    try {
      // Convert amounts to an array of integers
      const amountsArray = amounts.map(amount => parseInt(amount, 10));
      const backendApi = process.env.REACT_APP_BACKEND;
      const response = await fetch(`${backendApi}/recipe/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public: publicRecipe,
          userid: getUserID(),
          title: title,
          description: description,
          steps: stepsString,
          ingredients: ingredientsString,
          amounts: amountsString,
          appliances: calculateAppliancesValue(appliances),
          picture: picture,
        }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        result = errorData
        console.log(errorData);
      } else {
        result = "Recipe posted!"
      }
      console.log({ publicRecipe, title, description, stepsString, ingredientsString, amountsArray, picture, appliances });
    } catch (error) {
      result = "There was an error"
      console.log(error);
    }
    this.setState({ result });
  }

  Checkbox = ({ label, value, onChange }) => {
    return (
      <label>
        <input type="checkbox" checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };
  

  render() {
    const { publicRecipe, title, description, steps, ingredients, picture, amounts, appliances, applianceList, result } = this.state;
    return (
      <div>
        <div className="text-center">
        <label htmlFor="public">Public Recipe </label>
          <input
            type="checkbox"
            onChange={() => this.handlePublicChange(publicRecipe)}
            checked={publicRecipe}
          /><br />
          <label htmlFor="title">Title</label><br />
          <input
            type="text"
            name="title"
            value={title}
            onChange={this.handleChange}
            className="border border-solid border-black w-24 md:w-64 xl:w-40"
          /><br />
          <label htmlFor="description">Description</label><br />
          <input
            type="text"
            name="description"
            value={description}
            onChange={this.handleChange}
            className="border border-solid border-black w-24 md:w-32 xl:w-40"
          /><br />
          <div className="steps-box" id="steps-container">
            <label>Steps</label><br />
            {steps.map((step, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => {
                    const updatedSteps = [...steps];
                    updatedSteps[index] = e.target.value;
                    this.setState({ steps: updatedSteps });
                  }}
                  className="border border-solid border-black w-24 md:w-32 xl:w-40"
                />
                <button onClick={() => this.removeStep(index)}>Remove</button>
              </div>
            ))}
            <button onClick={this.addStep}>Add Step</button>
          </div>
          <div className="ingredients-box" id="ingredients-container">
          <label>Ingredients</label><br />
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => {
                  const updatedIngredients = [...ingredients];
                  updatedIngredients[index] = e.target.value;
                  this.setState({ ingredients: updatedIngredients });
                }}
                className="border border-solid border-black w-24 md:w-32 xl:w-40"
              />
              <input
                type="number"
                value={amounts[index]}
                onChange={(e) => {
                  const updatedAmounts = [...amounts];
                  updatedAmounts[index] = e.target.value;
                  this.setState({ amounts: updatedAmounts });
                }}
                className="border border-solid border-black w-24 md:w-32 xl:w-40"
                placeholder="Amount (grams/mL)"
              />
              <button onClick={() => this.removeIngredient(index)}>Remove</button>
            </div>
          ))}
          <button onClick={this.addIngredient}>Add Ingredient</button>
        </div>
          <label htmlFor="picture">Picture (URL)</label><br />
          <input
            type="text"
            name="picture"
            value={picture}
            onChange={this.handleChange}
            className="border border-solid border-black w-24 md:w-32 xl:w-40"
          /><br />
          <label htmlFor="appliances">Appliances</label><br />
          {appliances.map((isChecked, index) => (
            <div key={index}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => this.handleCheckboxChange(index)}
              />
              {applianceList[index]}
            </div>
          ), appliances)}
          <button onClick={this.handleSubmit}>Post</button>
          <p id="post-result">{result == "" ?
          <div>
            
          </div>
          :
          <div>
            <p>{result}</p>
          </div>}</p>
        </div>
      </div>
    );
  }
}

export default RecipeMaker;
