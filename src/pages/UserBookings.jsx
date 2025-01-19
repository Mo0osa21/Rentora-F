import React, { useEffect, useState } from 'react'
import { GetUserBookings, CancelBooking } from '../services/BookServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UserBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await GetUserBookings()
        setBookings(response)
      } catch (error) {
        console.error('Error fetching bookings:', error.message)
        toast.error('Failed to load your bookings.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
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
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet. Start exploring properties!</p>
      ) : (
        <div className="bookings-container">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <img
                src={booking.property.imageUrl}
                alt={booking.property.name}
                className="booking-image"
              />
              <div className="booking-info">
                <h3>{booking.property.name}</h3>
                <p>Location: {booking.property.location}</p>
                <p>
                  Dates: {formatDate(booking.startDate)} -{' '}
                  {formatDate(booking.endDate)}
                </p>
                <p>Total Price: ${booking.totalPrice}</p>
                <p
                  className={`status ${
                    booking.status === 'confirmed' ? 'confirmed' : 'cancelled'
                  }`}
                >
                  Status: {booking.status}
                </p>

                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="cancel-button"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserBookings
