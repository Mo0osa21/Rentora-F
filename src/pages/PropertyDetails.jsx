import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProduct } from '../services/ProductServices'
import { addToCart } from '../services/CartServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Reviews from '../components/Reviews'
import { MdArrowBackIosNew } from 'react-icons/md'

const ProeprtytDetails = ({ user }) => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productData = await getProduct(productId)
        setProduct(productData)
      } catch (err) {
        console.error('Error fetching product details:', err)
        toast.error('Failed to load product details.')
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [productId])

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
      toast.success('Product added to cart')
    } catch (err) {
      console.error('Error adding product to cart:', err)
      toast.error('Failed to add product to cart')
    }
  }

  const handleQuantityChange = (productId, event) => {
    const newQuantity = Math.max(1, event.target.value)
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity
    }))
  }

  const handleBackButton = () => {
    navigate('/products')
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!product) return <p>Product not found.</p>

  return (
    <div className="product-details" style={{ position: 'relative' }}>
      <ToastContainer />
      <button
        onClick={handleBackButton}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: '14px',
          padding: '5px 10px',
          backgroundColor: '#ff6f00',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 10
        }}
        className="back-button"
      >
        <MdArrowBackIosNew />
      </button>
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: ${product.discountedPrice}</p>
      <p>Stock Quantity: {product.stockQuantity}</p>
      <p>Category: {product.category?.name || 'No Category'}</p>
      <div className="quantity-container">
        <label htmlFor={`quantity-${product._id}`}>Quantity:</label>
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
      <button
        onClick={() =>
          handleAddToCart(
            product._id,
            quantities[product._id] || 1,
            product.price
          )
        }
        className="action-button add-to-cart"
      >
        Add to Cart
      </button>
      <Reviews productId={product._id} userId={user.id} />
    </div>
  )
}

export default ProeprtytDetails
