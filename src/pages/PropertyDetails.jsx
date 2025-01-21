import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { GetProperty } from '../services/PropertyServices'
import { PlaceBooking, GetPropertyBookings } from '../services/BookServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdArrowBackIosNew } from 'react-icons/md'
import Reviews from '../components/Reviews' // Import the Reviews component

const PropertyDetails = ({ user }) => {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [bookedDates, setBookedDates] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertyData = await GetProperty(propertyId)
        setProperty(propertyData)

        const bookings = await GetPropertyBookings(propertyId)
        const dates = bookings.flatMap((booking) => {
          const start = new Date(booking.startDate)
          const end = new Date(booking.endDate)
          const dateArray = []

          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dateArray.push(new Date(d).toISOString().split('T')[0])
          }
          return dateArray
        })

        setBookedDates(dates)
      } catch (err) {
        console.error('Error fetching data:', err)
        toast.error('Failed to load data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [propertyId])

  const isDateBooked = (date) => bookedDates.includes(date)

  const handlePlaceOrder = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.')
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be before start date.')
      return
    }
    try {
      const orderData = {
        property: propertyId,
        user: user.id,
        startDate,
        endDate,
        price: property.discountedPrice
      }
      await PlaceBooking(orderData)
      toast.success('Reservation successful')
      navigate('/bookings')
    } catch (err) {
      console.error('Error placing order:', err)
      toast.error('Failed to place order')
    }
  }

  const handleBackButton = () => {
    navigate('/home')
  }

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value
    if (startDate && selectedEndDate < startDate) {
      toast.error('End date cannot be before start date.')
      return
    }
    if (isDateBooked(selectedEndDate)) {
      toast.error('Selected end date is already booked.')
      return
    }
    setEndDate(selectedEndDate)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!property) return <p>Property not found.</p>

  return (
    <div className="property-details" style={{ position: 'relative' }}>
      <ToastContainer />

      <div className="header-section">
        <div className="back-button">
          <button onClick={handleBackButton}>
            <MdArrowBackIosNew />
          </button>
        </div>
      </div>

      <div className="property-info-section">
        <div className="property-info">
          <h1>{property.name}</h1>
          <div className="property-image">
            <img src={property.imageUrl} alt={property.name} />
          </div>
          <p className="property-description">{property.description}</p>
          <div className="property-details-row">
            <p>
              Price per night: <span>${property.discountedPrice}</span>
            </p>
            <p>
              Location: <span>{property.location}</span>
            </p>
            <p>
              Category: <span>{property.category?.name || 'No Category'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="booking-section">
        <div className="booking-form">
          <div className="date-container">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                if (isDateBooked(e.target.value)) {
                  toast.error('Selected start date is already booked.')
                  return
                }
                setStartDate(e.target.value)
                setEndDate('')
              }}
            />
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
            />
          </div>

          <div className="reserve-button-container">
            <button
              onClick={handlePlaceOrder}
              className="action-button place-order"
            >
              Reserve Property
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <Reviews propertyId={propertyId} user={user} />
      </div>
    </div>
  )
}

export default PropertyDetails
