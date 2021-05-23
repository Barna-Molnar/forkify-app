import View from './View.js'
import icons from 'url:../../img/icons.svg'


class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');


    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline')
            if (!btn) return
            const goToPage = +btn.dataset.goto
            handler(goToPage)
        })
    }

    _generateMarkup() {
        console.log(this._data)
        const curPage = this._data.page

        // Next highest number of pages
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);




        // Page 1 and there are other pages 
        if (curPage === 1 && numPages > 1) {
            return `
                <div  class="btn--inline pagination__currPage">
                    <span>${curPage}/ ${numPages}</span>

                </div>
                 <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }


        // last page
        if (curPage === numPages && numPages > 1) {
            return `
              
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                         <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
                <div  class="btn--inline pagination__currPage">
                    <span>${curPage} / ${numPages}</span>

                </div>
            `;
        }
        // other  page 
        if (curPage < numPages) {
            return `
               <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                         <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
                <div  class="btn--inline pagination__currPage">
                    <span>${curPage}/ ${numPages}</span>

                </div>
                 <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
              
                
             
            `;
        }

        // page 1 and there are ≈not other pages
        if (curPage === 1 && this._data.results.length < 10) {
            return ''
        }
    }
}
export default new PaginationView();

