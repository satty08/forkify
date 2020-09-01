import Search from './models/Search';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import Recipe from './models/Recipe';

/** Global State of the app
 * -Search object
 * -current recipe object
 * -liked recipe
 */ 
const state = {};

/* SEARCH CONTROLLER
*/ 

const controlSearch = async () => {
    // get the query from view
    const query = searchView.getInput();

    if (query){
        // New search object and add to state
        state.search = new Search(query)

        // prepare UI for results
        searchView.clearInput();
        searchView.clearPrevResult();
        renderLoader(elements.searchRes)

        try {
            //Search for recipes
            clearLoader();
            await state.search.getResults();

            // render results on UI
            searchView.renderResults(state.search.result);
            
        } catch (error) {
            alert('Something wrong with search...')
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearPrevResult();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/* SEARCH CONTROLLER
*/

const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //Prepare UI for changes

        //Create new recipe object
        state.recipe = new Recipe(id);

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render Recipe
            console.log(state.recipe);
            
        } catch (error) {
            alert('Error Processing Recipe!');
        }

    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

