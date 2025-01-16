import Client from './api'

// Get all properties (with optional filters)
export const GetProperties = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString()
    const res = await Client.get(`/properties?${query}`)
    return res.data
  } catch (error) {
    throw error
  }
}

// Get a single property by ID
export const GetProperty = async (propertyId) => {
  try {
    const res = await Client.get(`/properties/${propertyId}`)
    return res.data
  } catch (error) {
    throw error
  }
}

// Create a new property
export const CreateProperty = async (data) => {
  try {
    const res = await Client.post('/properties', data)
    return res.data
  } catch (error) {
    throw error
  }
}

// Update an existing property
export const UpdateProperty = async (propertyId, data) => {
  try {
    const res = await Client.put(`/properties/${propertyId}`, data)
    return res.data
  } catch (error) {
    throw error
  }
}

// Delete a property by ID
export const DeleteProperty = async (propertyId) => {
  try {
    const res = await Client.delete(`/properties/${propertyId}`)
    return res.data
  } catch (error) {
    throw error
  }
}
