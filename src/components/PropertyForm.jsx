import { useState, useEffect } from 'react';
import { CreateProperty } from '../services/PropertyServices'; // Change the service to PropertyServices
import { GetCategories } from '../services/CategoryServices'; // You can keep the categories if applicable
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'react-router-dom';

const PropertyForm = () => {
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

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesFromDB = await GetCategories();
        setCategories(categoriesFromDB);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyData({
      ...propertyData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (propertyData.discount > 100) {
      toast.error('Discount cannot exceed 100%. Please adjust the value.');
      return;
    }

    try {
      await CreateProperty(propertyData);
      toast.success('Property added successfully!');
      setPropertyData({
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
    } catch (error) {
      console.error('Error adding property:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('Failed to add property. Please try again.');
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <form className="property-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Add New Property</h2>

        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={propertyData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={propertyData.description}
            onChange={handleChange}
            className="form-textarea"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Price:</label>
          <input
            type="number"
            name="price"
            value={propertyData.price}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={propertyData.imageUrl}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            name="category"
            value={propertyData.category}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Location:</label>
          <input
            type="text"
            name="location"
            value={propertyData.location}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Amenities:</label>
          <input
            type="text"
            name="amenities"
            value={propertyData.amenities}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Availability:</label>
          <input
            type="checkbox"
            name="availability"
            checked={propertyData.availability}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Discount (%):</label>
          <input
            type="number"
            name="discount"
            value={propertyData.discount}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Discounted Price:</label>
          <input
            type="number"
            name="discountedPrice"
            value={propertyData.discountedPrice}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Created At:</label>
          <input
            type="text"
            name="createdAt"
            value={propertyData.createdAt}
            onChange={handleChange}
            className="form-input"
            disabled
          />
        </div>

        <button type="submit" className="form-submit-button">
          Add Property
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
