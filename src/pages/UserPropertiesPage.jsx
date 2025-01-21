import React, { useEffect, useState } from 'react'
import { GetUserProperties, DeleteProperty } from '../services/PropertyServices'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

const UserProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const data = await GetUserProperties()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching user properties:', error)
      toast.error('Failed to fetch your properties')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (propertyId) => {
    navigate(`/edit-property/${propertyId}`)
  }

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await DeleteProperty(propertyId)
        toast.success('Property deleted successfully')
        setProperties(
          properties.filter((property) => property._id !== propertyId)
        )
      } catch (error) {
        console.error('Error deleting property:', error)
        toast.error('Failed to delete property')
      }
    }
  }

  return (
    <div className="user-properties">
      <ToastContainer />
      <div className="header">
        <h1>My Properties</h1>
      </div>
      <div className="content">
        {loading ? (
          <div className="loading">
            <p>Loading...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="no-properties">
            <p>No properties found</p>
          </div>
        ) : (
          <ul className="property-list">
            {properties.map((property) => (
              <li className="property-item" key={property._id}>
                <div className="property-details">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="property-imageee"
                  />
                  <h3>{property.name}</h3>
                  <p>{property.description}</p>
                  <p>Price: ${property.price}</p>
                </div>
                <div className="property-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(property._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default UserProperties
