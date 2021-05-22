
import { API_URL } from './config.js'
import { RES_PER_PAGE } from './config.js'
import { getJSON } from './helpers.js'

export const state = {
    recipe: {},
    search: {
        query: '',
        page: 1,
        results: [],
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],

};

export const loadRecipe = async function (id) {
    try {

        const data = await getJSON(`${API_URL}${id}`)

        let { recipe } = data.data

        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.sourceUrl,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        }

        console.log(state.recipe)
    } catch (err) {
        throw err
    }

    // check if there is any bookmarked recipe 
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
        state.recipe.bookmarked = true
    } else {
        state.recipe.bookmarked = false
    }
}

export const loadSearchResult = async function (query) {
    try {

        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`)

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,

            }
        })

    } catch (err) {
        console.error(err)
        throw err
    }
};

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page
    // console.log(state.search.page)
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;



    return state.search.results.slice(start, end)
}

export const updateServings = function (newServings) {
    console.log(state.recipe)
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity / state.recipe.servings * newServings

        // newQuantity = oldQ * newServing / oldServings  // 2 x 8 / 4 = 4 
    });

    state.recipe.servings = newServings;

}

// storing the data in the localstorage 
const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
    // add bookmark 

    state.bookmarks.push(recipe)

    // Mark current recipe as bookmarked\

    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks()
};

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id = id)

    state.bookmarks.splice(index, 1)
    // Mark current recipe as NOT bookmarked

    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks()
}

// get the data from localstorage and store in the state on load(init function)
const init = function () {
    const storage = localStorage.getItem('bookmarks')

    if (storage) state.bookmarks = JSON.parse(storage)

}
init();

const clearBookmarks = function () {
    localStorage.clear('bookmarks')
}

export const uploadRecipe = async function (newRecipe) {

    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== "")
            .map(ing => {
                const ingArr = ing[1].replaceAll(' ', '').split(',')
                if (ingArr.length !== 3)
                    throw new Error('Description format is uncorrect! Please use the correct form :D!')

                const [quantity, unit, description] = ingArr
                return { quantity: quantity ? +quantity : null, unit, description }
            })
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        }
        console.log(recipe)

        console.log(ingredients)
    } catch (err) {
        console.error(err)
        throw err
    }
}
