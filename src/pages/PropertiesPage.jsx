import { useEffect, useState } from 'react'
import CategoryDropdown from '../components/CategoryDropdown'
import {
  getPropertiesByCategory,
  GetProperties
} from '../services/PropertyServices'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PropertiesPage = ({ user }) => {
  const [properties, setProperties] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
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

        if (!data) {
          setError('No properties found.')
          return
        }

        // Ensure data is filtered only if searchQuery is provided
        if (searchQuery) {
          data = data.filter((property) => {
            const titleMatch =
              property.name &&
              property.name.toLowerCase().includes(searchQuery.toLowerCase())
            const locationMatch =
              property.location &&
              property.location
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            return titleMatch || locationMatch
          })
        }

        setProperties(data)
      } catch (err) {
        console.error('Error fetching properties:', err)
        toast.error('Failed to fetch properties.')
        setError('An error occurred while fetching properties.')
      }
    }

    fetchProperties()
  }, [selectedCategory, searchQuery])

  return (
    <div className="container">
      <ToastContainer />
      <div className="header-container">
        <h1>Browse Properties</h1>
      </div>

      {/* Search Bar Section */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search properties by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter Section */}
      <div className="category-filter-container">
        <div className="category-dropdown">
          <CategoryDropdown
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Properties Display Section */}
      <div className="card-wrapper">
        {error && <p className="error-message">{error}</p>}
        {properties && properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="card">
              <Link
                to={`/property/${property._id}`}
                className="property-card-link"
              >
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="property-imagee"
                />
                <h2>{property.title}</h2>
                <p>Name: {property.name}</p>
                <p>Location: {property.location}</p>
                <p>Price: ${property.discountedPrice}</p>
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
