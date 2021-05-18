import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import PaginationView from './views/paginationView.js'


import 'core-js/stable';
import 'regenerator-runtime/runtime'
import paginationView from './views/paginationView.js'
const { async } = require("q");

// https://forkify-api.herokuapp.com/v2

/// against re-load the page ==> parcel feature
// if (module.hot) {
//   module.hot.accept();
// }

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
    recipeView.renderError()

  }
};

const controlSearchResults = async function () {
  try {
    // 1) get search query 
    resultsView.renderSpinner()
    const query = searchView.getQuery()
    if (!query) return;

    // 2) Load search results 
    await model.loadSearchReasult(query)

    // 3) Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage())

    // 4) Render the initial pagitantion 
    PaginationView.render(model.state.search)

  } catch (err) {
    console.error(err)
  }
}

const controlPagination = function (goToPage) {

  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // Render NEW pagination button  
  PaginationView.render(model.state.search)
}

const init = function () {
  recipeView.addHandlerRender(controlRecipe)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)

};
init();
