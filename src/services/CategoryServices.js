import Client from './api'

export const getCategories = async () => {
  try {
    const response = await Client.get('/categories')
    return response.data
  } catch (error) {
    console.error(
      'Error fetching categories:',
      error.response?.data || error.message
    )
    throw error
  }
}

export const createCategory = async (categoryData) => {
  try {
    const response = await Client.post('/categories', categoryData)
    return response.data
  } catch (error) {
    console.error(
      'Error creating category:',
      error.response?.data || error.message
    )
    throw error
  }
}

export const updateCategory = async (categoryId, updatedData) => {
  try {
    const response = await Client.put(`/categories/${categoryId}`, updatedData)
    return response.data
  } catch (error) {
    console.error(
      'Error updating category:',
      error.response?.data || error.message
    )
    throw error
  }
}

export const deleteCategory = async (categoryId) => {
  try {
    const response = await Client.delete(`/categories/${categoryId}`)
    return response.data
  } catch (error) {
    console.error(
      'Error deleting category:',
      error.response?.data || error.message
    )
    throw error
  }
}
