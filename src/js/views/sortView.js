class SortView {
    _parentElement = document.querySelector('.search__sort');



    addHandlerSort(handler) {
        this._parentElement.addEventListener('click', function (e) {
            e.preventDefault();
            const btn = e.target.closest('.btnSort')
            handler(btn);
        })
    }

}

export default new SortView();