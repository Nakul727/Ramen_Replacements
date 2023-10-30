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
      steps: [''], // Initialize with one step input
      ingredients: '',
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

  handleSubmit = async () => {
    const { title, description, steps, ingredients, picture, temp } = this.state;
    const appliances = 1;
    const userid = 1;
    var stepsString = "";
    for(var i = 0; i < steps.length; i++) {
        // add symbols to number so we know what are steps and what numbers are added by users
        stepsString += "$$" + String(i+1) + "$$" + ": " + steps[i];
    }
    
    try {
        const response = await fetch("http://localhost:8080/recipe/post", {
            method: "POST",
            headers: {
                "Content-Type": "applicaion/json",
            },
            body: JSON.stringify({ userid: userid, title: title, description: description, steps: stepsString, ingredients: ingredients,
            appliances: appliances, picture: picture})
        });
        if(!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
        }
        console.log({ title, description, stepsString, ingredients, picture, appliances });
    }
    catch(error) {
        console.log(error);
    }}

  render() {
    const { title, description, steps, ingredients, picture, appliances } = this.state;

    return (
      <div>
        <h1>Hello</h1>
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
          <label htmlFor="ingredients">Ingredients</label><br />
          <input
            type="text"
            name="ingredients"
            value={ingredients}
            onChange={this.handleChange}
            className="border border-solid border-black w-24 md:w-32 xl:w-40"
          /><br />
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

/*
function RecipeMaker() {
    async function PostRecipe(userid, title, description, steps, ingredients, picture, appliances) {
        try {
            const response = await fetch("http://localhost:8080/recipe/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userid: userid, title: title, description: description, steps: steps,
                ingredients: ingredients, picture: picture, appliances: appliances}), 
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                displayMessage("post-result", errorData.errorMessage);
            }
        } catch(error) {
            displayMessage("post-result", error)
        }
    }

    function submit() {
        let title = document.getElementById("recipe-title").value;
        let description = document.getElementById("recipe-description").value;
        let steps = document.getElementById("recipe-steps").value;
        let ingredients = document.getElementById("recipe-ingredients").value;
        let picture = document.getElementById("recipe-picture").value;
        let appliances = document.getElementById("recipe-appliances").value;

        if(title === "" || description === "" || steps === "" || 
        ingredients === "" || picture === "" || appliances === "") {

        } else {
            PostRecipe(1, title, description, steps, ingredients, picture, 1)
        }
    }

    // function for adding/removing steps boxes
    function handleSteps() {
        const container = getElementById("steps-container")
    }

    return (
        <div>
            <h1>Hello</h1>
            <div className="text-center">
                <label for="name">Title</label><br/>
                <input id="recipe-title" name="title" type="text" 
                className="border border-solid border-black w-24 md:w-32 xl:w-40"></input><br/>
                <label for="name">Description</label><br/>
                <input id="recipe-description" name="description" type="text" 
                className="border border-solid border-black w-24 md:w-32 xl:w-40"></input><br/>
                <div className="steps-box" id="steps-container">
                    <label for="name">Steps</label><br/>
                    
                </div>
                <input id="recipe-steps" name="steps" type="text" 
                className="border border-solid border-black w-24 md:w-32 xl:w-40"></input><br/>
                <label for="name">Ingredients</label><br/>
                <input id="recipe-ingredients" name="ingredients" type="text" 
                className="border border-solid border-black w-24 md:w-32 xl:w-40"></input><br/>
                <label for="name">Picture</label><br/>
                <input id="recipe-picture" name="picture" type="text" 
                className="border border-solid border-black w-24 md:w-32 xl:w-40"></input><br/>
                <label for="name">Appliances</label><br/>
                <input id="recipe-appliances" name="appliances" type="text" 
                className="border border-solid border-black w-24 md:w-32 xl:w-40"></input><br/>
                <button onClick={submit}>Post</button>
                <p id="post-result"></p>
            </div>
        </div>
    );
}

export default RecipeMaker;
*/