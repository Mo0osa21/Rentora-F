import React, { useState, useEffect } from 'react'
import { getAllOrders, updateOrderStatus } from '../services/OrderServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const BookingPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getAllOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error('Error fetching orders:', error.message)
        toast.error('Failed to fetch orders. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus)
      console.log('Updated Order:', updatedOrder)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch (error) {
      console.error(
        'Error updating order status:',
        error.response?.data || error.message
      )
    }
  }

  if (loading) return <p>Loading orders...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div className="orders-page">
      <ToastContainer />
      <h1>All Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name || 'Guest'}</td>
              <td>
                {order.products.map((item) => (
                  <div key={item.product._id}>
                    {item.product.name} x {item.quantity}
                  </div>
                ))}
              </td>
              <td>${order.totalPrice}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
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
