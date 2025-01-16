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

// Update booking status (e.g., pending, active, expired)
export const UpdateBookingStatus = async (bookId, status) => {
  try {
    const res = await Client.put(`/books/${bookId}`, { status })
    return res.data
  } catch (error) {
    console.error('Error updating booking status:', error)
    throw error
  }
}
