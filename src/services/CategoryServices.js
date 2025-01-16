import Client from './api'

// Fetch all categories
export const GetCategories = async () => {
  try {
    const res = await Client.get('/categories')
    return res.data
  } catch (error) {
    throw error
  }
}

// Create a new category
export const CreateCategory = async (data) => {
  try {
    const res = await Client.post('/categories', data)
    return res.data
  } catch (error) {
    throw error
  }
}

// Update an existing category
export const UpdateCategory = async (categoryId, data) => {
  try {
    const res = await Client.put(`/categories/${categoryId}`, data)
    return res.data
  } catch (error) {
    throw error
  }
}

// Delete a category
export const DeleteCategory = async (categoryId) => {
  try {
    const res = await Client.delete(`/categories/${categoryId}`)
    return res.data
  } catch (error) {
    throw error
  }
}
