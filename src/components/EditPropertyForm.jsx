import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, updateProduct } from '../services/ProductServices'
import { deleteProduct } from '../services/ProductServices'
import { getCategories } from '../services/CategoryServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditProductForm = () => {
  const { productId } = useParams()
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stockQuantity: '',
    discount: ''
  })
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const product = await getProduct(productId)
        setProductData(product)
      } catch (err) {
        console.error('Error fetching product details:', err)
        toast.error('Failed to load product details.')
      }
    }
    const fetchCategories = async () => {
      try {
        const categoriesFromDB = await getCategories()
        setCategories(categoriesFromDB)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories. Please try again.')
      }
    }

    fetchProductDetails()
    fetchCategories()
  }, [productId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData({ ...productData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (productData.discount > 100) {
      toast.error('Discount cannot exceed 100%. Please adjust the value.')
      return
    }

    const updatedData = {
      ...productData,
      price: productData.price,
      stockQuantity: productData.stockQuantity
    }

    try {
      console.log('Submitting data to update:', updatedData)
      await updateProduct(productId, updatedData)
      toast.success('Product updated successfully!')
      navigate('/products')
    } catch (err) {
      console.error(
        'Error updating product:',
        err.response?.data || err.message
      )
      toast.error('Failed to update product. Please try again.')
    }
  }

  if (error) {
    return <p className="error-message">{error}</p>
  }

  return (
    <div className="form-container">
      <ToastContainer />
      <form className="product-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Edit Product</h2>
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            className="form-textarea"
            name="description"
            value={productData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Price:</label>
          <input
            className="form-input"
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Image URL:</label>
          <input
            className="form-input"
            type="text"
            name="imageUrl"
            value={productData.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            className="form-select"
            name="category"
            value={productData.category}
            onChange={handleChange}
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
          <label className="form-label">Stock Quantity:</label>
          <input
            className="form-input"
            type="number"
            name="stockQuantity"
            value={productData.stockQuantity}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Discount:</label>
          <input
            className="form-input"
            type="number"
            name="discount"
            value={productData.discount}
            onChange={handleChange}
          />
        </div>
        <button className="form-submit-button" type="submit">
          Update Product
        </button>
      </form>
    </div>
  )
}

export default EditProductForm
