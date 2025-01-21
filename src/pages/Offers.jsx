import { useEffect, useState } from 'react'
import { GetProperties, DeleteProperty } from '../services/PropertyServices'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Offers = ({ user }) => {
  const [properties, setProperties] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allProperties = await GetProperties()
        if (allProperties) {
          const discountedProperties = allProperties.filter(
            (property) => property.discount > 0
          )
          setProperties(discountedProperties)
        } else {
          setProperties([])
        }
      } catch (err) {
        console.error('Error fetching properties:', err)
        setError('Failed to fetch properties.')
      }
    }
    fetchProperties()
  }, [])

  const handleDelete = async (propertyId) => {
    try {
      await DeleteProperty(propertyId)
      toast.success('Property deleted successfully!')
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property._id !== propertyId)
      )
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message)
      toast.error('Failed to delete property. Please try again.')
    }
  }

  return (
    <div className="container">
      <ToastContainer />
      <div className="header-container">
        <h1>Property Offers</h1>
      </div>

      <div className="card-wrapper">
        {error && <p className="error-message">{error}</p>}
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="card">
              <Link to={`/property/${property._id}`}>
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="property-imagee"
                />
                <h2>{property.title}</h2>
                <p>Name: {property.name}</p>
                <p>Location: {property.location}</p>
                <p>Price: ${property.discountedPrice}</p>
              </Link>
              <button
                className="book-buttonp"
                aria-label={`Book ${property.title}`}
              >
                Book Now
              </button>
              {user?.isAdmin && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(property._id)}
                >
                  Delete Property
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="empty-state-message">No property offers available</p>
        )}
      </div>
    </div>
  )
}

export default Offers
