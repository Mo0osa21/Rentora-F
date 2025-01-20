import React, { useEffect, useState } from 'react'
import { GetUserProperties, DeleteProperty } from '../services/PropertyServices'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

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

  // Handle Edit button click
  const handleEdit = (propertyId) => {
    navigate(`/edit-property/${propertyId}`)
  }

  // Handle Delete button click
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
    <div>
      <ToastContainer />
      <h1>My Properties</h1>
      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property._id}>
              <h3>{property.name}</h3>
              <p>{property.description}</p>
              <p>Price: ${property.price}</p>
              <button onClick={() => handleEdit(property._id)}>Edit</button>
              <button
                onClick={() => handleDelete(property._id)}
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserProperties
