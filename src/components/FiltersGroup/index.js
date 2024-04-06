import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    ratingBtn,
    categoryBtn,
    activeCategoryId,
    activeRatingId,
    clearFilters,
  } = props

  const searchInput = () => {
    const {searchInputValueBtn, activeSearchInputValue, enterSearchInput} = props

    const onChangeSearchItem = event => {
      //  console.log(event.target.value)
      searchInputValueBtn(event.target.value)
    }

    const onEnterSearchInput = event => {
      if (event.key === 'Enter') {
        enterSearchInput()
      }
    }
    return (
      <div className="search-card">
        <input
          type="search"
          onChange={onChangeSearchItem}
          onKeyDown={onEnterSearchInput}
          value={activeSearchInputValue}
          className="search-input"
          placeholder="Search"
        />
      </div>
    )
  }

  const categoryList = () => (
    <div className="category-card">
      <h1 className="category-card-heading">Category</h1>
      {/* <ul className="category-items-card"></ul> */}
      {categoryOptions.map(each => {
        const onClickCategoryItem = () => {
          categoryBtn(each.categoryId)
          //  categoryBtn()
          //  console.log(each.categoryId)
          //  console.log('Hi')
        }
        const iaActiveCat = activeCategoryId === each.categoryId ? 'active' : ''
        return (
          <button
            className={`category-card-btn ${iaActiveCat}`}
            onClick={onClickCategoryItem}
            type="button"
          >
            <p>{each.name}</p>
          </button>
        )
      })}
    </div>
  )

  const ratingList = () => (
    <div className="ratings-list-card">
      <h1 className="ratings-list-card-heading">Rating</h1>
      {ratingsList.map(rating => {
        const onClickRatingItem = () => {
          ratingBtn(rating.ratingId)
          //  console.log(rating.ratingId)
        }
        const isActiveRat = activeRatingId === rating.ratingId ? 'active' : ''
        return (
          <button
            className={`ratings-list-card-btn ${isActiveRat}`}
            onClick={onClickRatingItem}
            type="button"
          >
            <img
              className="ratings-list-card-img"
              src={rating.imageUrl}
              alt={`rating ${rating.ratingId}`}
            />{' '}
            {'  & up'}
          </button>
        )
      })}
    </div>
  )

  const clearFiltersRender = () => {
    const onClickClearFilterBtn = () => {
      //  console.log('clear')
      clearFilters()
    }
    return (
      <div className="clear-filter-card">
        <button
          className="clear-filter-btn"
          onClick={onClickClearFilterBtn}
          type="button"
        >
          Clear Filters
        </button>
      </div>
    )
  }

  return (
    <div className="filters-group-container">
      {searchInput()}
      {categoryList()}
      {ratingList()}
      {clearFiltersRender()}
      {/* Replace this element with your code */}
    </div>
  )
}

export default FiltersGroup
