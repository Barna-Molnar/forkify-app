import { async } from "q";
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
    }

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
}

export const loadSearchReasult = async function (query) {
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
    console.log(state.search.page)
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
