import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './LeafletMap.css';
import { reverseGeocode } from '../utils/reverseGeocode';

// Fix default marker icon issues with Leaflet's default images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map events (right-click to select point)
function MapEventHandler({ onSelect, onPositionChange }) {
  useMapEvents({
    contextmenu(e) {
      if (e.originalEvent) {
        e.originalEvent.preventDefault();
      }
      const { lat, lng } = e.latlng;
      const newPos = { lat, lng };
      // Update the position state to move the marker
      if (onPositionChange) onPositionChange(newPos);
      // Also notify parent
      if (onSelect) onSelect(newPos);
    },
  });
  return null;
}

// Component to handle map invalidation when container size changes
function MapSizeHandler({ onMapReady }) {
  const map = useMap();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (map && !map._destroyed) map.invalidateSize();
    }, 100);
    const handleResize = () => {
      if (map && !map._destroyed) map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    if (onMapReady) onMapReady(map);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [map, onMapReady]);

  return null;
}

// Component to handle marker position and dragging
function MapMarker({ position, draggable, onSelect }) {
  const handleDragEnd = useCallback((e) => {
    const newPos = e.target.getLatLng();
    if (onSelect) onSelect({ lat: newPos.lat, lng: newPos.lng });
  }, [onSelect]);

  return (
    <Marker
      position={[position.lat, position.lng]}
      draggable={draggable}
      eventHandlers={draggable ? { dragend: handleDragEnd } : undefined}
    />
  );
}

// Wrapper component that handles map container cleanup
function MapContainerWrapper({ children, onMapCreated, center, zoom, ...containerProps }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Cleanup on unmount - this runs before React re-mounts in Strict Mode
  useEffect(() => {
    return () => {
      // Clean up the map instance
      if (mapInstanceRef.current) {
        try {
          if (!mapInstanceRef.current._destroyed) {
            mapInstanceRef.current.remove();
          }
        } catch (e) {
          console.debug('Map cleanup error:', e.message);
        }
        mapInstanceRef.current = null;
      }
      
      // Clean up the container's leaflet reference to prevent "already initialized" error
      if (containerRef.current) {
        // Remove all leaflet-related properties
        Object.keys(containerRef.current).forEach(key => {
          if (key.startsWith('_leaflet')) {
            try {
              delete containerRef.current[key];
            } catch (e) {
              containerRef.current[key] = undefined;
            }
          }
        });
      }
    };
  }, []);

  // Wrap the onMapCreated to store reference
  const handleMapCreated = useCallback((map) => {
    mapInstanceRef.current = map;
    if (onMapCreated) {
      onMapCreated(map);
    }
  }, [onMapCreated]);

  return (
    <div ref={containerRef} style={{ height: '100%', width: '100%' }}>
      <MapContainer
        whenCreated={handleMapCreated}
        center={center}
        zoom={zoom}
        {...containerProps}
      >
        {children}
      </MapContainer>
    </div>
  );
}

export default function LeafletMap({
  initialPosition = { lat: -12.093456, lng: -77.021345 },
  onSelect,
  onMapReady,
  draggable = false,
  onGPS,
}) {
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState('');
  const [zoom, setZoom] = useState(15);

  // Update position when initialPosition changes (e.g., from GPS)
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  // Handle map creation
  const handleMapCreated = useCallback((mapInstance) => {
    if (onMapReady) {
      onMapReady(mapInstance);
    }
  }, [onMapReady]);

  // Handle marker selection and get address
  const handleMarkerSelect = useCallback((coords) => {
    setPosition(coords);
      setPosition(coords);
      if (onSelect) onSelect(coords);
  }, [onSelect]);

  // Get address when position changes
  useEffect(() => {
    if (position.lat && position.lng) {
      reverseGeocode(position.lat, position.lng)
        .then((addr) => {
          setAddress(addr || 'Selecciona un punto en el mapa');
        })
        .catch(() => {
          setAddress('Selecciona un punto en el mapa');
        });
    } else {
      setAddress('');
    }
  }, [position]);

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainerWrapper
          onMapCreated={handleMapCreated}
          center={[position.lat, position.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          className="leaflet-map-container"
          dragging
          touchZoom
          scrollWheelZoom
          doubleClickZoom
          boxZoom={false}
          keyboard={false}
        >
          <TileLayer
            attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapMarker 
            position={position} 
            draggable={draggable} 
            onSelect={handleMarkerSelect} 
          />
          <MapEventHandler onSelect={onSelect} onPositionChange={setPosition} />
          <MapSizeHandler onMapReady={onMapReady} />
        </MapContainerWrapper>
      </div>
      <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '6px', marginBottom: '0', borderLeft: '3px solid #28a745' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.2rem' }}>📍</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#28a745', textTransform: 'uppercase' }}>Ubicación seleccionada</span>
        </div>
        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#333' }}>
          <strong>Coordenadas:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#333' }}>
          <strong>Dirección:</strong> {address || 'Cargando...'}
        </p>
      </div>
    </div>
  );
}
