import { useEffect, useState } from 'react'
import CategoryDropdown from '../components/CategoryDropdown'
import { getPropertiesByCategory } from '../services/PropertyServices' // Update to Property service
import { getProperties, deleteProperty } from '../services/PropertyServices' // Update to Property service
import { addToCart } from '../services/CartServices'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PropertiesPage = ({ user }) => {
  const [properties, setProperties] = useState([]) // Updated to properties
  const [selectedCategory, setSelectedCategory] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let data
        if (selectedCategory) {
          console.log(`Fetching properties for category: ${selectedCategory}`)
          data = await getPropertiesByCategory(selectedCategory)
        } else {
          console.log('Fetching all properties')
          data = await getProperties()
        }
        console.log('Fetched properties:', data)
        setProperties(data)
      } catch (err) {
        console.error('Error fetching properties:', err)
        toast.error('Failed to fetch properties.')
      }
    }

    fetchProperties()
  }, [selectedCategory])

  const handleAddToCart = async (propertyId, quantity, price, discount = 0) => {
    try {
      const properties = [
        {
          property: propertyId,
          quantity: quantity,
          price: price,
          discount: discount
        }
      ]
      await addToCart(properties)
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [propertyId]: 0
      }))
      toast.success('Property added to cart successfully!')
    } catch (err) {
      console.error('Error adding property to cart:', err)
      toast.error('Failed to add property. Please try again.')
    }
  }

  const handleDelete = async (propertyId) => {
    try {
      await deleteProperty(propertyId)
      toast.success('Property deleted successfully!')
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property._id !== propertyId)
      )
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message)
      toast.error('Failed to delete property. Please try again.')
    }
  }

  const handleQuantityChange = (propertyId, event) => {
    const newQuantity = Math.max(1, event.target.value)
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [propertyId]: newQuantity
    }))
  }

  return (
    <div>
      <ToastContainer />
      <div className="browse-properties-header">
        <h1>Browse Properties</h1>
      </div>

      <CategoryDropdown
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="properties-grid">
        {error && <p className="error-message">{error}</p>}
        {properties && properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="property-card">
              <Link to={`/property/${property._id}`}>
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="property-image"
                />
              </Link>
              <h2>{property.name}</h2>

              <p>Price: ${property.discountedPrice}</p>

              {property.availability === 'unavailable' ? (
                <p className="out-of-stock">Unavailable</p>
              ) : (
                !user?.isAdmin && (
                  <div className="quantity-container">
                    <label htmlFor={`quantity-${property._id}`}>Quantity:</label>
                    <input
                      type="number"
                      id={`quantity-${property._id}`}
                      name="quantity"
                      min="1"
                      max={property.availability}
                      value={quantities[property._id] || 1}
                      onChange={(e) => handleQuantityChange(property._id, e)}
                      className="quantity-input"
                    />
                  </div>
                )
              )}

              {property.availability > 0 && !user?.isAdmin && (
                <button
                  onClick={() => {
                    const quantityInput = document.getElementById(
                      `quantity-${property._id}`
                    )
                    const quantity = parseInt(quantityInput.value, 10)

                    if (!quantity || quantity <= 0) {
                      alert('Please enter a valid quantity.')
                      return
                    }

                    handleAddToCart(property._id, quantity, property.price)
                  }}
                  className="cart-button"
                  aria-label={`Add ${property.name} to cart`}
                >
                  Add to Cart
                </button>
              )}

              {user?.isAdmin && (
                <>
                  <button
                    onClick={() => navigate(`/edit-property/${property._id}`)}
                    className="edit-button"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(property._id)}
                    className="delete-button"
                  >
                    Delete Property
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No properties available</p>
        )}
      </div>
    </div>
  )
}

export default PropertiesPage
