import Client from './api'

export const getPropertiesByCategory = async (categoryId) => {
  try {
    console.log(`Fetching properties for category: ${categoryId}`)
    const response = await Client.get(`/properties?category=${categoryId}`)
    console.log('Properties by category:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching properties by category:', error)
    throw error
  }
}

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

export const GetPropertiesByUser = async (userId) => {
  try {
    const response = await Client.get(`/properties?owner=${userId}`);
    console.log('Properties by user:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties by user:', error);
    throw error;
  }
};