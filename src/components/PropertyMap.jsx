import React, { useEffect, useState } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api'

const PropertyMap = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const [zoom, setZoom] = useState(10)

  useEffect(() => {
    if (properties && properties.length > 0) {
      const firstProperty = properties[0]
      setMapCenter({
        lat: firstProperty.location.lat,
        lng: firstProperty.location.lng
      })
    }
  }, [properties])

  const containerStyle = {
    width: '100%',
    height: '400px'
  }

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
      >
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={{
              lat: property.location.lat,
              lng: property.location.lng
            }}
            onClick={() => setSelectedProperty(property)}
          />
        ))}

        {selectedProperty && (
          <InfoWindow
            position={{
              lat: selectedProperty.location.lat,
              lng: selectedProperty.location.lng
            }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div>
              <h4>{selectedProperty.name}</h4>
              <p>{selectedProperty.description}</p>
              {/* You can add nearby attractions here */}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}

export default PropertyMap
