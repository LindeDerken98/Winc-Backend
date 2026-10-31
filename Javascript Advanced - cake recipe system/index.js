'use strict';

const cakeRecipes = require("./cake-recipes.json");
const readline = require("node:readline");
const { stdin, stdout } = require("node:process");

// Your functions here
const getAuthors = (recipes) => {
  const authors = [];

  recipes.forEach((recipe) => {
    if (!authors.includes(recipe.Author)) {
      authors.push(recipe.Author);
    }
  });

  return authors;
};

const printRecipeNames = (recipes) => {
  if (recipes.length === 0) {
    console.log("There are no recipes found.");
    return;
  }

  recipes.forEach(({ Name }) => console.log(Name));
};

const getRecipesByAuthor = (recipes, author) =>
  recipes.filter((recipe) => recipe.Author === author);

const getRecipesByIngredient = (recipes, ingredient) =>
  recipes.filter((recipe) =>
    recipe.Ingredients.some((recipeIngredient) =>
      recipeIngredient.includes(ingredient)
    )
  );

const getRecipeByName = (recipes, name) =>
  recipes.find((recipe) => recipe.Name.includes(name)) ?? null;

const getAllIngredients = (recipes) =>
  recipes.reduce(
    (allIngredients, recipe) => allIngredients.concat(recipe.Ingredients),
    []
  );

// Part 2
const savedRecipes = [];

const displayMenu = () => {
  console.log("\nRecipe Management System Menu:");
  console.log("1. Show All Authors");
  console.log("2. Show Recipe names by Author");
  console.log("3. Show Recipe names by Ingredient");
  console.log("4. Get Recipe by Name");
  console.log("5. Get All Ingredients of Saved Recipes");
  console.log("0. Exit");
};

const runMenu = async () => {
  const terminal = readline.createInterface({ input: stdin, output: stdout });
  const inputLines = terminal[Symbol.asyncIterator]();
  const ask = async (message) => {
    stdout.write(message);
    const { value, done } = await inputLines.next();
    return done ? null : value;
  };
  let choice;

  try {
    do {
      displayMenu();
      const answer = await ask("Enter a number (1-5) or 0 to exit: ");
      if (answer === null) {
        break;
      }
      choice = Number.parseInt(answer, 10);

      switch (choice) {
        case 1:
          console.log(getAuthors(cakeRecipes));
          break;
        case 2: {
          const author = await ask("Enter an author name: ");
          if (author === null) {
            choice = 0;
            break;
          }
          printRecipeNames(getRecipesByAuthor(cakeRecipes, author));
          break;
        }
        case 3: {
          const ingredient = await ask("Enter an ingredient: ");
          if (ingredient === null) {
            choice = 0;
            break;
          }
          printRecipeNames(getRecipesByIngredient(cakeRecipes, ingredient));
          break;
        }
        case 4: {
          const name = await ask("Enter a recipe name: ");
          if (name === null) {
            choice = 0;
            break;
          }
          const recipe = getRecipeByName(cakeRecipes, name);
          if (!recipe) {
            console.log("No recipe found.");
            break;
          }

          console.log(recipe);
          const saveAnswer = await ask("Save this recipe's ingredients? (y/n): ");
          if (saveAnswer === null) {
            choice = 0;
            break;
          }
          if (saveAnswer.trim().toLowerCase() === "y") {
            savedRecipes.push(recipe);
            console.log("Ingredients saved.");
          }
          break;
        }
        case 5:
          if (savedRecipes.length === 0) {
            console.log("No recipes have been saved yet.");
          } else {
            console.log(getAllIngredients(savedRecipes));
          }
          break;
        case 0:
          console.log("Exiting...");
          break;
        default:
          console.log("Invalid input. Please enter a number between 0 and 5.");
      }
    } while (choice !== 0);
  } finally {
    terminal.close();
  }
};

runMenu();