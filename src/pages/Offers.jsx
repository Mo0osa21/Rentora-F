import { useEffect, useState } from 'react'
import { getProducts, deleteProduct } from '../services/ProductServices'
import { addToCart } from '../services/CartServices'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Offers = ({ user }) => {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data.filter((product) => product.discount > 0))
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to fetch products.')
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = async (productId, quantity, price, discount = 0) => {
    try {
      const products = [
        {
          product: productId,
          quantity: quantity,
          price: price,
          discount: discount
        }
      ]
      await addToCart(products)
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: 0
      }))
      toast.success('Product added to cart successfully!')
    } catch (err) {
      console.error('Error adding product to cart:', err)
      toast.error('Failed to add product. Please try again.')
    }
  }

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId)
      toast.success('Product deleted successfully!')
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      )
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message)
      toast.error('Failed to delete product. Please try again.')
    }
  }

  const handleQuantityChange = (productId, event) => {
    const newQuantity = Math.max(1, event.target.value)
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity
    }))
  }

  return (
    <div>
      <ToastContainer />
      <div className="browse-products-header">
        <h1>Browse Products</h1>
      </div>
      <div className="offers-page">
        {error && <p className="error-message">{error}</p>}
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                </Link>
                <h2 className="product-name">{product.name}</h2>

                <p>Price: ${product.discountedPrice}</p>
                <p className="product-discount">
                  Discount: {product.discount}%
                </p>

                {product.stockQuantity === 0 ? (
                  <p className="out-of-stock">Out of Stock</p>
                ) : (
                  !user?.isAdmin && (
                    <div className="quantity-container">
                      <label htmlFor={`quantity-${product._id}`}>
                        Quantity:
                      </label>
                      <input
                        type="number"
                        id={`quantity-${product._id}`}
                        name="quantity"
                        min="1"
                        max={product.stockQuantity}
                        value={quantities[product._id] || 1}
                        onChange={(e) => handleQuantityChange(product._id, e)}
                        className="quantity-input"
                      />
                    </div>
                  )
                )}

                {product.stockQuantity > 0 && !user?.isAdmin && (
                  <button
                    onClick={() => {
                      const quantityInput = document.getElementById(
                        `quantity-${product._id}`
                      )
                      const quantity = parseInt(quantityInput.value, 10)

                      if (!quantity || quantity <= 0) {
                        alert('Please enter a valid quantity.')
                        return
                      }

                      handleAddToCart(product._id, quantity, product.price)
                    }}
                    className="cart-buttonp"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    Add to Cart
                  </button>
                )}
                {user?.isAdmin && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-product/${product._id}`)}
                      className="edit-buttonp"
                      aria-label={`Edit details for ${product.name}`}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-buttonp"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete Product
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state-message">No products available</p>
        )}
      </div>
    </div>
  )
}

export default Offers
