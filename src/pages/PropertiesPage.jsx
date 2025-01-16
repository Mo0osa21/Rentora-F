import { useEffect, useState } from 'react'
import CategoryDropdown from '../components/CategoryDropdown'
import {
  getPropertiesByCategory,
  GetProperties,
  DeleteProperty
} from '../services/PropertyServices'
import { PlaceBooking } from '../services/BookServices'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PropertiesPage = ({ user }) => {
  const [properties, setProperties] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let data
        if (selectedCategory) {
          console.log(`Fetching properties for category: ${selectedCategory}`)
          data = await getPropertiesByCategory(selectedCategory)
        } else {
          console.log('Fetching all properties')
          data = await GetProperties()
        }
        setProperties(data)
      } catch (err) {
        console.error('Error fetching properties:', err)
        toast.error('Failed to fetch properties.')
      }
    }

    fetchProperties()
  }, [selectedCategory])

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
                  alt={property.title}
                  className="property-image"
                />
                <h2>{property.title}</h2>
                <p>Location: {property.location}</p>
                <p>Price: ${property.price}</p>

                <button
                  className="book-buttonp"
                  aria-label={`Book ${property.title}`}
                >
                  Book Now
                </button>
              </Link>
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
