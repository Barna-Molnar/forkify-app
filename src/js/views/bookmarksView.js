// import View from './View.js';
import PreviewView from './previewView';


class BookmarksView extends PreviewView {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe, and bookmark it :)! '
    _message


    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    // _generateMarkup() {
    //     // console.log(this._data) 
    //     return this._data.map(this._generateMarkupPreview).join('')

    // }
    // _generateMarkupPreview(recipe) {
    //     const id = window.location.hash.slice(1)


    //     return `<li class="preview">
    //             <a class="preview__link ${recipe.id === id ? 'preview__link--active' : ''}" href="#${recipe.id}">
    //             <figure class="preview__fig">
    //                 <img src="${recipe.image}" alt="${recipe.title}" />
    //             </figure>
    //             <div class="preview__data">
    //                 <h4 class="preview__title">${recipe.title}</h4>
    //                 <p class="preview__publisher">${recipe.publisher}</p>

    //             </div>
    //             </a>
    //         </li>
    //     `;
    // }
}

export default new BookmarksView();
