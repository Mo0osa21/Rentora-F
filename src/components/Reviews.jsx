import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
import {
  getReviews,
  checkReviewEligibility,
  addReview,
  editReview,
  deleteReview
} from '../services/ReviewServices'

const Reviews = ({ productId, userId }) => {
  const [reviews, setReviews] = useState([])
  const [isEligible, setIsEligible] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [updatedComment, setUpdatedComment] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsData, eligibility] = await Promise.all([
          getReviews(productId),
          checkReviewEligibility(userId, productId)
        ])
        setReviews(reviewsData)
        setIsEligible(eligibility)
      } catch (error) {
        toast.error('Failed to load data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId, userId, reviews])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!comment.trim()) {
      toast.error('Comment cannot be empty.')
      return
    }

    try {
      const response = await addReview({ productId, userId, comment })
      console.log('New review added:', response)

      const newReview = response.review

      if (!newReview || !newReview._id || !newReview.userId) {
        console.log('Error: Invalid review data', newReview)
        return
      }

      setReviews((prevReviews) => [...prevReviews, newReview])

      setComment('')
      toast.success('Comment added successfully.')
    } catch (error) {
      toast.error('Failed to add comment.')
    }
  }

  const handleEdit = (review) => {
    setEditingReviewId(review._id)
    setUpdatedComment(review.comment)
  }

  const handleSave = async (reviewId) => {
    if (!updatedComment.trim()) {
      toast.error('Comment cannot be empty.')
      return
    }

    try {
      await editReview(reviewId, updatedComment, userId)

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, comment: updatedComment }
            : review
        )
      )

      setEditingReviewId(null)
      toast.success('Review updated successfully.')
    } catch (error) {
      toast.error('Failed to update review.')
    }
  }

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId, userId)
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      )
      toast.success('Review deleted successfully.')
    } catch (error) {
      toast.error('Failed to delete review.')
    }
  }

  return (
    <div className="reviews-section">
      <ToastContainer />
      <h2>Reviews</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review._id} className="review-card">
              <div className="review-content">
                {editingReviewId === review._id ? (
                  <textarea
                    value={updatedComment}
                    onChange={(e) => setUpdatedComment(e.target.value)}
                    aria-label="Edit review"
                  />
                ) : (
                  <p>
                    <strong>{review.userId.name}</strong>: {review.comment}
                  </p>
                )}
              </div>
              {review.userId._id === userId && (
                <div className="review-actions">
                  {editingReviewId === review._id ? (
                    <>
                      <button
                        className="save-button"
                        onClick={() => handleSave(review._id)}
                        aria-label="Save edit"
                      >
                        <FaSave />
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => setEditingReviewId(null)}
                        aria-label="Cancel edit"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(review)}
                        aria-label="Edit review"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(review._id)}
                        aria-label="Delete review"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}
      {isEligible && (
        <form className="review-form" onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            required
            aria-label="Add review"
          />
          <button
            type="submit"
            className="submit-button"
            aria-label="Submit review"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  )
}

export default Reviews
