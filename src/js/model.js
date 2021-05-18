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
    const start = (page - 1) * RES_PER_PAGE;
    const end = page * RES_PER_PAGE



    return state.search.results.slice(start, end)
}
