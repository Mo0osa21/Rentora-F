import Client from './api'

export const getReviews = async (productId) => {
  try {
    const response = await Client.get(`/reviews/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}

export const checkReviewEligibility = async (userId, productId) => {
  try {
    const response = await Client.get(
      `/reviews/check-eligibility/${userId}/${productId}`
    )
    return response.data
  } catch (error) {
    console.error('Error checking review eligibility:', error)
    throw error
  }
}

export const addReview = async (reviewData) => {
  try {
    const response = await Client.post('/reviews', reviewData)
    return response.data
  } catch (error) {
    console.error('Error adding review:', error)
    throw error
  }
}

export const editReview = async (reviewId, reviewData, userId) => {
  try {
    const response = await Client.put(`/reviews/${reviewId}`, {
      comment: reviewData,
      userId
    })
    return response.data
  } catch (error) {
    console.error('Error updating review:', error)
    throw error
  }
}

export const deleteReview = async (reviewId, userId) => {
  try {
    const response = await Client.delete(`/reviews/${reviewId}`, {
      data: { userId }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}
