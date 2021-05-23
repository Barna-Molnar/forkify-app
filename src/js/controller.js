import * as model from './model.js'
import { CLOSE_MODAL_SEC } from './config.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/AddRecipeView.js'
import sortView from './views/sortView.js'



import 'core-js/stable';
import 'regenerator-runtime/runtime'
import paginationView from './views/paginationView.js'
import { add } from 'lodash'


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


    // 1)  Loading recipe

    await model.loadRecipe(id)

    // 2) Rendering recipe 
    recipeView.render(model.state.recipe)
    // update bookmarksView 
    bookmarksView.update(model.state.bookmarks)

  } catch (err) {
    recipeView.renderError()
    console.log(err)

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


const controlHandlerBookmark = function () {
  bookmarksView.render(model.state.bookmarks)

}

const controlAddRecipe = async function (newRecipe) {
  try {
    //upload the recipe data
    addRecipeView.renderSpinner()
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)

    //render Recipe 
    recipeView.render(model.state.recipe)

    // render succesmessage 
    addRecipeView.renderMessage()

    // render the bookmarkview
    bookmarksView.render(model.state.bookmarks)

    // change Id in url 
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // close the model window 
    setTimeout(function () {
      addRecipeView.toggleWindow()

    }, CLOSE_MODAL_SEC * 1000)

  } catch (err) {
    addRecipeView.renderError(err.message)
  }
}

const controlSort = function (btn) {
  console.log(btn)
}

const init = function () {
  // control sort 
  sortView.addHandlerSort(controlSort)
  // bookmark
  bookmarksView.addHandlerRender(controlHandlerBookmark)

  recipeView.addHandlerRender(controlRecipe)

  // listening to increase or decrease 
  recipeView.addHandlerUpdateServings(controlServings)
  // listening to bookmark button click 
  recipeView.addHandlerAddBookmark(controlAddBookmark)

  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)


};
init();
