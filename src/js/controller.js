import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'


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

    // 0) update results view  to mark selected search result 

    resultsView.update(model.getSearchResultsPage())

    // update bookmarksView 
    bookmarksView.update(model.state.bookmarks)

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
    await model.loadSearchResult(query)

    // 3) Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage(1))

    // 4) Render the initial pagitantion 
    paginationView.render(model.state.search)

  } catch (err) {
    console.error(err)
  }
}

const controlPagination = function (goToPage) {

  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // Render NEW pagination button  
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {

  // update the recipe servings (is state)
  model.updateServings(newServings)
  // Update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // Add or remove bookmark 
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  /// update recipeView 
  recipeView.update(model.state.recipe)

  // render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const init = function () {
  recipeView.addHandlerRender(controlRecipe)

  // listening to increase or decrease 
  recipeView.addHandlerUpdateServings(controlServings)
  // listening to bookmark button click 
  recipeView.addHandlerAddBookmark(controlAddBookmark)

  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)


};
init();
