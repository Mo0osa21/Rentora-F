import React, { useEffect, useState } from 'react'
import {
  GetUserBookings,
  CancelBooking,
  UpdateBookingStatus
} from '../services/BookServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UserBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await GetUserBookings()

        // Get the current date
        const currentDate = new Date()

        // Update the status of each booking
        const updatedBookings = response.map((booking) => {
          const startDate = new Date(booking.startDate)
          const endDate = new Date(booking.endDate)

          let newStatus = booking.status

          if (currentDate < startDate) {
            newStatus = 'Pending'
          } else if (currentDate >= startDate && currentDate <= endDate) {
            newStatus = 'Active'
          } else if (currentDate > endDate) {
            newStatus = 'Expired'
          }

          // Only update status if necessary
          if (booking.status !== newStatus) {
            // Update the booking status via API
            UpdateBookingStatus(booking._id, newStatus)
              .then(() => {
                toast.success(`Booking status updated to ${newStatus}`)
              })
              .catch((error) => {
                toast.error(
                  `Failed to update status for booking ${booking._id}`
                )
              })
          }

          return { ...booking, status: newStatus }
        })

        setBookings(updatedBookings)
      } catch (error) {
        console.error('Error fetching bookings:', error.message)
        toast.error('Failed to load your bookings.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()

    // Optional: Set up a periodic status update (e.g., every 1 minute)
    const interval = setInterval(fetchBookings, 60000)

    // Clean up the interval on component unmount
    return () => clearInterval(interval)
  }, [])

  const handleCancelBooking = async (bookingId) => {
    try {
      await CancelBooking(bookingId)
      toast.success('Booking cancelled successfully.')
      setBookings(bookings.filter((booking) => booking._id !== bookingId))
    } catch (error) {
      console.error('Error cancelling booking:', error.message)
      toast.error('Failed to cancel booking.')
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString()

  if (loading) return <p>Loading your bookings...</p>

  return (
    <div className="user-bookings-page">
      <ToastContainer />
      <div className="bookings-header">
        <h1>My Bookings</h1>
      </div>
      <div className="bookings-content">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>No bookings yet. Start exploring properties!</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-image-wrapper">
                  <img
                    src={booking.property.imageUrl}
                    alt={booking.property.name}
                    className="booking-image"
                  />
                </div>
                <div className="booking-info-wrapper">
                  <h3 className="property-name">{booking.property.name}</h3>
                  <p className="property-location">
                    Location: {booking.property.location}
                  </p>
                  <p className="booking-dates">
                    Dates: {formatDate(booking.startDate)} -{' '}
                    {formatDate(booking.endDate)}
                  </p>
                  <p className="booking-price">
                    Total Price: ${booking.totalPrice}
                  </p>
                  <p
                    className={`booking-status ${
                      booking.status === 'confirmed' ? 'confirmed' : 'cancelled'
                    }`}
                  >
                    Status: {booking.status}
                  </p>
                  <div className="booking-actions">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="cancel-button"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserBookings
