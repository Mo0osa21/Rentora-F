import React from 'react'
import PropertyMap from './PropertyMap'

const PropertyPage = ({ properties }) => {
  return (
    <div>
      <h2>Property Locations</h2>
      <PropertyMap properties={properties} />
    </div>
  )
}

export default PropertyPage
