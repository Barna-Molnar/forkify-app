import * as model from './model.js'
import recipeView from './views/recipeView.js'
import { func } from 'assert-plus';

import 'core-js/stable';
import 'regenerator-runtime/runtime'
const { async } = require("q");





// https://forkify-api.herokuapp.com/v2



///////////////////////////////////////
const controlRecipe = async function () {
  try {

    const id = window.location.hash.slice(1)

    if (!id) return

    recipeView.renderSpinner();

    // 1)  Loading recipe

    await model.loadRecipe(id)

    // 2) Rendering recipe 


    recipeView.render(model.state.recipe)

  } catch (err) {

    alert(err)
  }
};

['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipe))

