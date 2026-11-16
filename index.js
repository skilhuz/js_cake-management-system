//------------------------------------------------------------------
// Divider used to break code into sections
// Purely for myself to avoid overwhelm and to remember logic
//------------------------------------------------------------------

"use strict";

// Where data will be retrieved from for app
const cakeRecipes = require("./cake-recipes.json");

// Allows user input in terminal - won't work in VScode if not added
const prompt = require("prompt-sync")();

//------------------------------------------------------------------
// Display menu
//------------------------------------------------------------------

const displayMenu = () => {
  console.log("\nRecipe Management System Menu:");
  console.log("1. Show All Authors");
  console.log("2. Show Recipe names by Author");
  console.log("3. Show Recipe names by Ingredient");
  console.log("4. Get Recipe by Name");
  console.log("5. Get All Ingredients of Saved Recipes");
  console.log("0. Exit");

  const choice = prompt("Enter a number (1-5) or 0 to exit: ");
  return parseInt(choice);
};

const inputText = (question) => {
  return prompt(question).trim();
};

//-------------------------------------------------------------------
// 0. Get recipe names from data
//-------------------------------------------------------------------

// Show list of recipes, get recipe names from list, return as new list with names

const getAllRecipeNames = (recipes) => {
  return recipes.map(({ Name }) => Name);
};

// Display recipe names
// If returned list is empty then show console message otherwise show list
const displayAllRecipeNames = (recipes) => {
  if (recipes.length === 0) {
    console.log("Sorry, no recipes were found.");
    return;
  }

  getAllRecipeNames(recipes).forEach((name) => {
    console.log(name);
  });
};

// ----------------------------------------------------------------
// 1. Show All Authors
// ----------------------------------------------------------------

const getAllRecipeAuthors = (recipes) => {
  // Create empty array to store authors
  const authors = [];

  // Search each recipe for an author,
  // If author is found and not included in array list then store author

  recipes.forEach((recipe) => {
    if (!authors.includes(recipe.Author)) {
      authors.push(recipe.Author);
    }
  });

  return authors;
};

//---------------------------------------------------------------------
// 2. Show recipe names by author
//---------------------------------------------------------------------

const getRecipesByAuthor = (recipes, author) => {
  // Search author
  const inputAuthor = author.trim().toLowerCase();

  // Filter recipes that include inputed author
  // Show recipes names with matching author

  return recipes.filter(
    (recipe) => recipe.Author.toLowerCase() === inputAuthor,
  );
};

//---------------------------------------------------------------------
// 3. Show recipe names by Ingredient
//---------------------------------------------------------------------

const getRecipesByIngredient = (recipes, ingredient) => {
  const inputIngredient = ingredient.trim().toLowerCase();

  // If inputed ingredient not found in recipe then return empty list

  if (!inputIngredient) {
    return [];
  }

  // Check all recipes for inputed ingredient
  // Check recipes if they match at least 1 inputed ingredient
  // Check recipes if they include inputed ingredient
  // Show all matching recipes
  return recipes.filter((recipe) =>
    recipe.Ingredients.some((item) =>
      item.toLowerCase().includes(inputIngredient),
    ),
  );
};

//-----------------------------------------------------------------------
// 4. Get recipe by name
//-----------------------------------------------------------------------

const getRecipeByName = (recipes, name) => {
  const inputName = name.trim().toLowerCase();

  // If recipe name not found return nothing
  if (!inputName) {
    return null;
  }

  // Find name match that includes name
  // Return name matches if found
  return (
    recipes.find((recipe) => recipe.Name.toLowerCase().includes(inputName)) ||
    null
  );
};

//------------------------------------------------------------------------
// 5. Get all ingredients from saved recipes
//------------------------------------------------------------------------

// Get all ingredients
const getAllIngredients = (recipes) => {
  return recipes.reduce((allIngredients, recipe) => {
    return [...allIngredients, ...recipe.Ingredients];
  }, []);
};

// Save recipe ingredients, return new list with recipe ingredients

const saveRecipeIngredients = (savedIngredients, recipe) => {
  return [...savedIngredients, ...getAllIngredients([recipe])];
};

// Store saved ingredients
let savedIngredients = [];

//---------------------------------------------------------------
// Menu options
//---------------------------------------------------------------

// Switch recipe management menu
let choice;

do {
  choice = displayMenu();

  // Create menu options
  switch (choice) {
    // Option 1: Show all authors from recipes
    case 1:
      console.log("\n1. Show All Authors: ");
      getAllRecipeAuthors(cakeRecipes).forEach((author) => console.log(author));
      break;

    // Option 2: Search recipes by author
    case 2: {
      const author = inputText("Enter an author name: ");

      if (!author) {
        console.log("Please enter an author name.");
        break;
      }
      const recipes = getRecipesByAuthor(cakeRecipes, author);

      console.log("\nRecipe names by Author: ");
      displayAllRecipeNames(recipes);
      break;
    }

    // Option 3: Search for recipes by ingredient
    case 3: {
      const ingredient = inputText("What ingredient(s) are you looking for?: ");

      const recipes = getRecipesByIngredient(cakeRecipes, ingredient);

      console.log("\nRecipe names by ingredients:\n");
      displayAllRecipeNames(recipes);
      break;
    }
    // Option 4: Search recipe and save ingredients.
    case 4: {
      const nameRecipe = inputText("Enter name of recipe: ");

      const recipe = getRecipeByName(cakeRecipes, nameRecipe);

      // Save ingredients
      if (recipe) {
        console.log("\nDetails from your recipe:\n");
        console.log(recipe);

        const saveRecipe = inputText("Save ingredients? Write Yes or no: ");

        if (saveRecipe.trim().toLowerCase() === "yes") {
          savedIngredients = saveRecipeIngredients(savedIngredients, recipe);
          console.log("Your ingredients are saved.");
        }
      } else {
        console.log("Sorry, your recipe wasn't found.");
      }

      break;
    }

    // Show ingredients from saved recipe
    case 5:
      if (savedIngredients.length === 0) {
        console.log("No ingredients were found in your saved recipes.");
      } else {
        console.log("\nIngredients from your saved recipes:");
        console.log(savedIngredients);
      }
      break;

    // Option 0: End menu application
    case 0:
      console.log("Exiting...");
      break;

    // Response if menu choice is invalid
    default:
      console.log("Invalid input. Please enter a number between 0 and 5.");
  }
  // Continue loop until user reachers 0
} while (choice !== 0);

//--------------------------------------------------------------------------
// Testing - uncomment to test
//--------------------------------------------------------------------------

// console.log(getAllRecipeAuthors(cakeRecipes));
// displayAllRecipeNames(cakeRecipes);
// displayAllRecipeNames(getRecipesByIngredient(cakeRecipes, "caster sugar"));
// console.log(getRecipeByName(cakeRecipes, "clementine"));
// console.log(getAllIngredients(getRecipesByAuthor(cakeRecipes, "Mary Cadogan")));
