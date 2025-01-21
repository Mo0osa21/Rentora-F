import React, { useState, useEffect } from 'react'
import {
  GetAllBookings,
  UpdateBookingStatus
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
        const bookingsData = await GetAllBookings()

        // Auto-update status based on current date
        const updatedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            const currentDate = new Date()
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

            // If status needs to be updated
            if (booking.status !== newStatus) {
              try {
                await UpdateBookingStatus(booking._id, newStatus)
                toast.success(
                  `Booking ${booking._id} status updated to ${newStatus}`
                )
              } catch (err) {
                console.error(
                  `Failed to update booking ${booking._id}:`,
                  err.message
                )
              }
            }

            return { ...booking, status: newStatus }
          })
        )

        setBookings(updatedBookings)
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
      await UpdateBookingStatus(bookingId, newStatus)
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      )
      toast.success('Booking status updated successfully!')
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
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
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
