import { useState } from 'react'
import { createCategory } from '../services/CategoryServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CategoryForm = () => {
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCategoryData({ ...categoryData, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createCategory(categoryData)
      toast.success('Category added successfully!')
      setError(null)
      setCategoryData({ name: '', description: '' })
    } catch (err) {
      console.error('Error creating category:', err)
      toast.error('Failed to add category. Please try again.')
      setSuccess(null)
    }
  }

  return (
    <div>
      <ToastContainer />

      <form className="product-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Add Category</h1>
        <div className="form-group">
          <label className="form-label">Category Name:</label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            className="form-input"
            required
          ></textarea>
        </div>

        <button type="submit" className="form-submit-button">
          Add Category
        </button>
      </form>
    </div>
  )
}

export default CategoryForm
