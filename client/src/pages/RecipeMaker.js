import React, { Component } from 'react';
import { displayMessage } from "../components/helper.js";
import { Footer } from "../components/footer.js";
import logo_img from "../assets/logo.png";
import menu_img from "../assets/menu.png";

class RecipeMaker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      steps: [''],
      ingredients: [''],
      amounts: [''],
      picture: '',
      appliances: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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
    const { title, description, steps, ingredients, amounts, picture } = this.state;
    const appliances = 1;
    const userid = 1;
    var stepsString = "";
    for (var i = 0; i < steps.length; i++) {
      // add symbols to number so we know what are steps and what numbers are added by users
      stepsString += "$$" + String(i + 1) + "$$: " + steps[i];
    }
    var ingredientsString = "";
    var count = 1;
    for (var i = 0; i < ingredients.length; i++) {
      if (ingredients[i] !== "") {
        ingredientsString += "$$" + String(count) + "$$: " + ingredients[i];
        count++;
      }
    }
  
    try {
      // Convert amounts to an array of integers
      const amountsArray = amounts.map(amount => parseInt(amount, 10));
    
      const response = await fetch("http://localhost:8080/recipe/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userid,
          title: title,
          description: description,
          steps: stepsString,
          ingredients: ingredientsString,
          amounts: amountsArray, // Send it as an array of integers
          appliances: appliances,
          picture: picture,
        }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
      }
      console.log({ title, description, stepsString, ingredientsString, amountsArray, picture, appliances });
    } catch (error) {
      console.log(error);
    }
  }
  

  render() {
    const { title, description, steps, ingredients, picture, amounts, appliances } = this.state;
    return (
      <div>
        <div className="text-center">
          <label htmlFor="title">Title</label><br />
          <input
            type="text"
            name="title"
            value={title}
            onChange={this.handleChange}
            className="border border-solid border-black w-24 md:w-32 xl:w-40"
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
                placeholder="Amount"
              />
              <button onClick={() => this.removeIngredient(index)}>Remove</button>
            </div>
          ))}
          <button onClick={this.addIngredient}>Add Ingredient</button>
        </div>
          <label htmlFor="picture">Picture</label><br />
          <input
            type="text"
            name="picture"
            value={picture}
            onChange={this.handleChange}
            className="border border-solid border-black w-24 md:w-32 xl:w-40"
          /><br />
          <label htmlFor="appliances">Appliances</label><br />
          <input
            type="text"
            name="appliances"
            value={appliances}
            onChange={this.handleChange}
            className="border border-solid border-black w-24 md:w-32 xl:w-40"
          /><br />
          <button onClick={this.handleSubmit}>Post</button>
          <p id="post-result"></p>
        </div>
      </div>
    );
  }
}

export default RecipeMaker;
