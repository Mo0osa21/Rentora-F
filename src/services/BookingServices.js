import Client from './api'

export const getAllOrders = async () => {
  try {
    const response = await Client.get('/orders')
    return response.data
  } catch (error) {
    console.error(
      'Error fetching all orders:',
      error.response?.data || error.message
    )
    throw error
  }
}

export const getUserOrders = async () => {
  try {
    const response = await Client.get('/orders/user')
    return response.data
  } catch (error) {
    console.error(
      'Error fetching user orders:',
      error.response?.data || error.message
    )
    throw error
  }
}

export const placeOrder = async (orderData) => {
  try {
    const response = await Client.post('/orders', orderData)
    return response.data
  } catch (error) {
    console.error('Error placing order:', error.response?.data || error.message)
    throw error
  }
}

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await Client.put(`/orders/${orderId}`, { status })
    return response.data
  } catch (error) {
    console.error(
      'Error updating order status:',
      error.response?.data || error.message
    )
    throw error
  }
}