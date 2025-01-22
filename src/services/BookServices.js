import Client from './api'

// Place a new booking
export const PlaceBooking = async (data) => {
  try {
    const res = await Client.post('/books', data)
    return res.data
  } catch (error) {
    console.error('Error placing booking:', error)
    throw error
  }
}

// Get all bookings (admin view)
export const GetAllBookings = async () => {
  try {
    const res = await Client.get('/books')
    return res.data
  } catch (error) {
    console.error('Error fetching all bookings:', error)
    throw error
  }
}

// Get bookings for the logged-in user
export const GetUserBookings = async () => {
  try {
    const res = await Client.get('/books/user')
    return res.data
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    throw error
  }
}

export const UpdateBookingStatus = async (id, status) => {
  try {
    console.log('Booking ID:', id)
    const res = await Client.put(`/books/${id}`, { status })
    return res.data
  } catch (error) {
    console.error('Failed to update booking status', error)
    throw error
  }
}

export const GetPropertyBookings = async (propertyId) => {
  try {
    const res = await Client.get(`books/property/${propertyId}`)
    return res.data.bookings
  } catch (error) {
    console.error('Error fetching property bookings:', error)
    throw error
  }
}

export const CancelBooking = async (bookingId) => {
  const token = localStorage.getItem('token')

  await Client.delete(`books/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
