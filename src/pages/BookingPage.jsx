import React, { useState, useEffect } from 'react'
import {
  getAllBookings,
  updateBookingStatus
} from '../services/BookingServices' // Assuming BookingServices
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const BookingPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await getAllBookings()
        setBookings(bookingsData)
      } catch (error) {
        console.error('Error fetching bookings:', error.message)
        toast.error('Failed to fetch bookings. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const updatedBooking = await updateBookingStatus(bookingId, newStatus)
      console.log('Updated Booking:', updatedBooking)
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      )
    } catch (error) {
      console.error(
        'Error updating booking status:',
        error.response?.data || error.message
      )
      toast.error('Failed to update booking status. Please try again.')
    }
  }

  if (loading) return <p>Loading bookings...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div className="orders-page">
      <ToastContainer />
      <h1>All Bookings</h1>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User</th>
            <th>Properties</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking._id}</td>
              <td>{booking.user?.name || 'Guest'}</td>
              <td>
                {booking.properties.map((item) => (
                  <div key={item.property._id}>
                    {item.property.title} x {item.quantity}
                  </div>
                ))}
              </td>
              <td>${booking.totalPrice}</td>
              <td>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(booking._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookingPage
