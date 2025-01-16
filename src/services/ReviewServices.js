import Client from './api'

// Get all reviews for a specific property
export const GetReviewsForProperty = async (propertyId) => {
  try {
    const res = await Client.get(`/reviews/${propertyId}`)
    return res.data
  } catch (error) {
    throw error
  }
}

// Add a new review for a property
export const AddReview = async (data) => {
  try {
    const res = await Client.post('/reviews', data)
    return res.data
  } catch (error) {
    throw error
  }
}

// Check if a user is eligible to review a property
export const CheckReviewEligibility = async (userId, propertyId) => {
  try {
    const res = await Client.get(`/reviews/eligibility/${userId}/${propertyId}`)
    return res.data
  } catch (error) {
    throw error
  }
}

// Edit an existing review
export const EditReview = async (reviewId, data) => {
  try {
    const res = await Client.put(`/reviews/${reviewId}`, data)
    return res.data
  } catch (error) {
    throw error
  }
}

// Delete a review
export const DeleteReview = async (reviewId) => {
  try {
    const res = await Client.delete(`/reviews/${reviewId}`)
    return res.data
  } catch (error) {
    throw error
  }
}
