import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { GetProperty } from '../services/PropertyServices'
import { PlaceBooking, GetPropertyBookings } from '../services/BookServices'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdArrowBackIosNew } from 'react-icons/md'
import Reviews from '../components/Reviews'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const PropertyDetails = ({ user }) => {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
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

        setBookedDates(dates.map((date) => new Date(date)))

        await axios.get(
          `http://your-backend-url/api/update-book-status/${propertyId}`
        )
      } catch (err) {
        console.error('Error fetching data:', err)
        toast.error('Failed to load data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [propertyId])

  const handlePlaceOrder = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.')
      return
    }

    if (endDate < startDate) {
      toast.error('End date cannot be before start date.')
      return
    }
    try {
      const orderData = {
        property: propertyId,
        user: user.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
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
    navigate('/properties')
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
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              excludeDates={bookedDates}
              minDate={new Date()}
              placeholderText="Select a start date"
            />

            <label>End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              excludeDates={bookedDates}
              minDate={startDate || new Date()}
              placeholderText="Select an end date"
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
