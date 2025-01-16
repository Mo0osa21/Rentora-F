import { useEffect, useState } from 'react'
import { getCategories } from '../services/CategoryServices'

const CategoryDropdown = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategories()
        setCategories(categoryData)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories.')
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="category-dropdown-container">
      <label htmlFor="category-select" className="category-label">
        Filter by Category:
      </label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="category-dropdown"
      >
        <option value="" className="dropdown-item">
          All Categories
        </option>
        {categories.map((category) => (
          <option
            key={category._id}
            value={category._id}
            className="dropdown-item"
          >
            {category.name}
          </option>
        ))}
      </select>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default CategoryDropdown
