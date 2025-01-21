import { useEffect, useState } from 'react'
import {
  GetReviewsForProperty,
  AddReview,
  CheckReviewEligibility
} from '../services/ReviewServices'
import { toast } from 'react-toastify'

const Reviews = ({ propertyId, user }) => {
  const [reviews, setReviews] = useState([])
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(1)
  const [isEligible, setIsEligible] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await GetReviewsForProperty(propertyId)
        setReviews(response)
      } catch (err) {
        toast.error('Failed to load reviews')
      }
    }

    const checkEligibility = async () => {
      if (!user) return
      try {
        const response = await CheckReviewEligibility(user.id, propertyId)
        console.log('Eligibility response:', response)
        setIsEligible(response) // Ensure correct key from API response
      } catch (err) {
        console.error('Error checking eligibility:', err)
        setIsEligible(false) // Handle error scenario
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
      await AddReview({ propertyId, userId: user.id, comment, rating })
      toast.success('Review submitted successfully')
      setComment('')
      setRating(1)
      setReviews([...reviews, { userId: { name: user.name }, comment, rating }])
    } catch (err) {
      toast.error('Failed to add review')
    }
  }

  return (
    <div className="review-section">
      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="review">
            <p>
              <strong>{review.userId.name}</strong> rated {review.rating}/5
            </p>
            <p>{review.comment}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}

      {isEligible ? (
        <div className="add-review">
          <h3>Leave a Review</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
          />
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Star{num > 1 && 's'}
              </option>
            ))}
          </select>
          <button onClick={handleReviewSubmit}>Submit Review</button>
        </div>
      ) : (
        <p>You need to book and stay at this property to leave a review.</p>
      )}
    </div>
  )
}

export default Reviews
