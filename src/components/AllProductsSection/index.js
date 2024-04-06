import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    apiStatus: apiStatusConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeSearchInputValue: '',
    activeCategoryId: '',
    activeRatingId: '',
    apiCalling: true,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeSearchInputValue,
      activeCategoryId,
      activeRatingId,
    } = this.state
    //  const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}`
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${activeSearchInputValue}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
    console.log(response.status)
    this.setState({apiCalling: response.ok})
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  // renderNoProducts = () => (
  //   <div className="no-products-card no-products-view">
  //     <img
  //       className="no-products-img"
  //       src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
  //       alt="no products"
  //     />
  //     <h1 className="no-failure-heading">No Products Found</h1>
  //     <p className="no-failure-para">
  //       We could not find any products. Try other filters
  //     </p>
  //   </div>
  // )

  renderFailure = () => (
    <div className="failure-card">
      <img
        className="failure-card-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="no-failure-heading">Oops! Something Went Wrong</h1>
      <p className="no-failure-para">
        We are having some trouble processing your request. Pls try again.
      </p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    const shouldShowProductsList = productsList.length > 0
    // TODO: Add No Products View
    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-card no-products-view">
        <img
          className="no-products-img"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
        />
        <h1 className="no-failure-heading">No Products Found</h1>
        <p className="no-failure-para">
          We could not find any products. Try other filters
        </p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  searchInputValueBtn = value => {
    //  console.log(value)
    this.setState({activeSearchInputValue: value})
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  categoryBtn = id => {
    this.setState({activeCategoryId: id}, this.getProducts)
    //  console.log(id)
  }

  ratingBtn = id => {
    this.setState({activeRatingId: id}, this.getProducts)
    //  console.log(id)
  }

  clearFilters = () => {
    this.setState(
      {
        activeSearchInputValue: '',
        activeCategoryId: '',
        activeRatingId: '',
      },
      this.getProducts,
    )
  }

  renderAllProducts = () => {
    const {apiStatus, productsList} = this.state
    //  console.log(productsList.length)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsList()
      // if (productsList.length > 0) {
      //   return this.renderProductsList()
      // } else {
      //   return this.renderNoProducts()
      // }

      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  // TODO: Add failure view

  render() {
    const {
      activeSearchInputValue,
      activeCategoryId,
      activeRatingId,
      productsList,
    } = this.state
    console.log(productsList)

    return (
      <div className="all-products-section">
        {/*  TODO: Update the below element  */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          activeSearchInputValue={activeSearchInputValue}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          searchInputValueBtn={this.searchInputValueBtn}
          enterSearchInput={this.enterSearchInput}
          categoryBtn={this.categoryBtn}
          ratingBtn={this.ratingBtn}
          clearFilters={this.clearFilters}
          key={1}
        />
        {this.renderAllProducts()}
        {/*  isLoading ? this.renderLoader() : this.renderProductsList() */}
      </div>
    )
  }
}
export default AllProductsSection
