import { useEffect, useState } from 'react'
import {
  GetReviewsForProperty,
  AddReview,
  EditReview,
  DeleteReview,
  CheckReviewEligibility
} from '../services/ReviewServices'
import { toast } from 'react-toastify'

const Reviews = ({ propertyId, user }) => {
  const [reviews, setReviews] = useState([])
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(1)
  const [isEligible, setIsEligible] = useState(false)
  const [editingReview, setEditingReview] = useState(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await GetReviewsForProperty(propertyId)
        setReviews(response)
      } catch (err) {
        toast.error('Failed to fetch reviews')
      }
    }

    const checkEligibility = async () => {
      if (!user) return
      try {
        const response = await CheckReviewEligibility(user.id, propertyId)
        setIsEligible(response)
      } catch (err) {
        setIsEligible(false)
      }
    }

    fetchReviews()
    checkEligibility()
  }, [propertyId, user])

  const handleReviewSubmit = async () => {
    if (!comment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      if (editingReview) {
        await EditReview(editingReview._id, { comment, rating })
        setReviews((prevReviews) =>
          prevReviews.map((r) =>
            r._id === editingReview._id ? { ...r, comment, rating } : r
          )
        )
        setEditingReview(null)
        toast.success('Review updated successfully')
      } else {
        const newReview = await AddReview({
          propertyId,
          userId: user.id,
          comment,
          rating
        })
        setReviews([...reviews, { ...newReview, userId: { name: user.name } }])
        toast.success('Review submitted successfully')
      }
      setComment('')
      setRating(1)
    } catch (err) {
      toast.error('Failed to submit review')
    }
  }

  const handleEditReview = (review) => {
    setComment(review.comment)
    setRating(review.rating)
    setEditingReview(review)
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await DeleteReview(reviewId)
      setReviews(reviews.filter((review) => review._id !== reviewId))
      toast.success('Review deleted successfully')
    } catch (err) {
      toast.error('Failed to delete review')
    }
  }

  return (
    <div className="review-section">
      <div className="reviews-header">
        <h2>Reviews</h2>
      </div>
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review">
              <p className="review-author">
                <strong>{review.userId.name}</strong> rated {review.rating}/5
              </p>
              <p className="review-comment">{review.comment}</p>
              {user?.id === review.userId?._id && (
                <div className="review-actions">
                  <button onClick={() => handleEditReview(review)}>Edit</button>
                  <button onClick={() => handleDeleteReview(review._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-reviews">No reviews yet.</p>
        )}
      </div>

      <div className="add-review-section">
        {isEligible ? (
          <div className="add-review">
            <h3>{editingReview ? 'Edit Review' : 'Leave a Review'}</h3>
            <div className="review-form">
              <textarea
                className="review-comment-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
              />
              <select
                className="review-rating-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 && 's'}
                  </option>
                ))}
              </select>
              <button
                className="review-submit-button"
                onClick={handleReviewSubmit}
              >
                {editingReview ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </div>
        ) : (
          <p className="eligibility-message">
            You need to book and stay at this property to leave a review.
          </p>
        )}
      </div>
    </div>
  )
}

export default Reviews
