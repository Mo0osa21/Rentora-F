import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty, updateProperty } from '../services/PropertyServices'; // Update service
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPropertyForm = () => {
  const { propertyId } = useParams();
  const [propertyData, setPropertyData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    location: '',
    amenities: '',
    availability: true,
    discount: '',
    discountedPrice: '',
    createdAt: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const property = await getProperty(propertyId);
        setPropertyData(property);
      } catch (err) {
        console.error('Error fetching property details:', err);
        toast.error('Failed to load property details.');
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyData({
      ...propertyData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...propertyData,
    };

    try {
      console.log('Submitting data to update:', updatedData);
      await updateProperty(propertyId, updatedData); // Update service call
      toast.success('Property updated successfully!');
      navigate('/properties'); // Update navigation path
    } catch (err) {
      console.error('Error updating property:', err.response?.data || err.message);
      toast.error('Failed to update property. Please try again.');
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="form-container">
      <ToastContainer />
      <form className="property-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Edit Property</h2>

        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={propertyData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            className="form-textarea"
            name="description"
            value={propertyData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Price:</label>
          <input
            className="form-input"
            type="number"
            name="price"
            value={propertyData.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL:</label>
          <input
            className="form-input"
            type="text"
            name="imageUrl"
            value={propertyData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category:</label>
          <input
            className="form-input"
            type="text"
            name="category"
            value={propertyData.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location:</label>
          <input
            className="form-input"
            type="text"
            name="location"
            value={propertyData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Amenities:</label>
          <input
            className="form-input"
            type="text"
            name="amenities"
            value={propertyData.amenities}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Availability:</label>
          <input
            className="form-input"
            type="checkbox"
            name="availability"
            checked={propertyData.availability}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Discount (%):</label>
          <input
            className="form-input"
            type="number"
            name="discount"
            value={propertyData.discount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Discounted Price:</label>
          <input
            className="form-input"
            type="number"
            name="discountedPrice"
            value={propertyData.discountedPrice}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Created At:</label>
          <input
            className="form-input"
            type="text"
            name="createdAt"
            value={propertyData.createdAt}
            onChange={handleChange}
            disabled
          />
        </div>

        <button className="form-submit-button" type="submit">
          Update Property
        </button>
      </form>
    </div>
  );
};

export default EditPropertyForm;
