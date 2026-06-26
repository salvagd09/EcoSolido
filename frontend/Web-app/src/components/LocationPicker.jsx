import React, { useState, useEffect, useCallback } from 'react';
import './LocationPicker.css';
import LeafletMap from './LeafletMap';
import WarningModal from './WarningModal';
import { reverseGeocode } from '../utils/reverseGeocode';

export default function LocationPicker({ value, onConfirm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ lat: '', lng: '' });
  const [address, setAddress] = useState('');
  const [searchError, setSearchError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isGettingGPS, setIsGettingGPS] = useState(false);
  const [leafletKey, setLeafletKey] = useState(0);
  const [gpsError, setGpsError] = useState(null);

  // Confirm button enabled only when there is a valid location
  const isLocationReady = coords.lat && coords.lng;

  const closeModal = () => {
    setIsOpen(false);
  };

  const confirmLocation = () => {
    if (!coords.lat || !coords.lng) {
      setWarningMsg('No hay una ubicación seleccionada. Seleccione un punto en el mapa o use el GPS.');
      setShowWarning(true);
      return;
    }
    setIsConfirming(true);
    setConfirmed(true);
    
    const locationData = { 
      lat: parseFloat(coords.lat), 
      lng: parseFloat(coords.lng), 
      address 
    };
    
    if (onConfirm) onConfirm(locationData);
    setIsOpen(false);
    setIsConfirming(false);
  };

  // Atajos de teclado (activos cuando el modal está abierto)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      // Esc para cerrar modal
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
      // Enter para confirmar ubicación (si hay ubicación seleccionada)
      if (e.key === 'Enter' && isLocationReady && !isConfirming) {
        e.preventDefault();
        confirmLocation();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLocationReady, isConfirming, closeModal, confirmLocation]);

  // Open modal function restores previous behavior and forces map remount
  const openModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(true);
    // Reset errors and stale data
    setGpsError(null);
    setSearchError('');
    setAddress('');
    setCoords({ lat: '', lng: '' });
    // Reset map key to remount LeafletMap
    setLeafletKey((k) => k + 1);
    // If there is an existing location, prefill
    if (value && value.lat && value.lng) {
      setCoords({ lat: value.lat.toString(), lng: value.lng.toString() });
      setAddress(value.address || '');
    }
  };

  // Initialize with existing value if provided
  useEffect(() => {
    if (value && value.lat && value.lng) {
      setCoords({ lat: value.lat.toString(), lng: value.lng.toString() });
      setAddress(value.address || '');
      setConfirmed(true);
    }
  }, [value]);

  // Get address when coordinates change (after user selects)
  useEffect(() => {
    if (coords.lat && coords.lng) {
      // Only fetch address if we don't already have one (e.g., from fallback)
      if (!address) {
        reverseGeocode(parseFloat(coords.lat), parseFloat(coords.lng))
          .then((addr) => {
            if (addr) setAddress(addr);
            else setAddress('Dirección no disponible');
          })
          .catch(() => setAddress('Dirección no disponible'));
      }
      // Reset confirmation when new coords selected
      setConfirmed(false);
    }
  }, [coords, address]);

  // ---- Search result callbacks from LeafletMap ----
  const handleSearchResult = ({ lat, lng, address: foundAddress }) => {
    setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
    setAddress(foundAddress);
    setGpsError(null);
    setSearchError('');
    setIsGettingGPS(false);
  };

  const handleSearchError = (msg) => {
    setSearchError(msg);
    setAddress('');
    setIsGettingGPS(false);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocalización no está disponible en este navegador. Por favor, seleccione la ubicación manualmente en el mapa.');
      return;
    }

    // Verificación rápida de si la geolocalización podría funcionar
    if (!navigator.permissions) {
      setGpsError('Su navegador no soporta verificación de permisos. Use el mapa para seleccionar manualmente.');
      return;
    }

    setIsGettingGPS(true);
    setGpsError(null);
    setSearchError('');

    const options = {
      enableHighAccuracy: true,
      timeout: 60000, // Aumentado a 60 segundos para mejor precisión
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (accuracy > 100) {
          setGpsError(`Precisión del GPS baja (${Math.round(accuracy)}m). Intente de nuevo o seleccione manualmente.`);
          setIsGettingGPS(false);
          return;
        }
        setCoords({ lat: latitude.toFixed(6), lng: longitude.toFixed(6) });
        setIsGettingGPS(false);
        setGpsError(null);
        // Force map to update to the new GPS position
        setLeafletKey((k) => k + 1);
        // Get address for the GPS location
        reverseGeocode(latitude, longitude)
          .then((addr) => {
            if (addr) setAddress(addr);
            else setAddress('Dirección no disponible');
          })
          .catch(() => setAddress('Dirección no disponible'));
      },
      (err) => {
        console.error('Error de geolocalización:', err.code, err.message);
        let msg = '';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Permiso denegado. Use el mapa para seleccionar manualmente (click derecho para colocar el marcador).';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'No se pudo obtener la ubicación. Verifique que el GPS esté activado.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Se agotó el tiempo de espera (60s). Posibles causas: 1) GPS desactivado, 2) Está en interiores o área con mala señal, 3) Su dispositivo no tiene GPS. Intente de nuevo o use el mapa para seleccionar manualmente.';
        } else {
          msg = `Error: ${err.message}`;
        }
        setGpsError(msg);
        setIsGettingGPS(false);
      },
      options
    );
  };

  const handleMapSelect = useCallback((c) => {
    setCoords({ lat: c.lat.toFixed(6), lng: c.lng.toFixed(6) });
    // Clear any previous GPS or search errors now that a valid location is chosen manually
    setGpsError(null);
    setSearchError('');
  }, []);

  // Render compact view when modal is closed
  if (!isOpen) {
    return (
      <div className="location-picker__status">
        <div className="location-picker__status-header">
          <div className="location-picker__title-group">
            <label className="location-picker__label">UBICACIÓN DE LA INCIDENCIA:</label>
            <span className="location-picker__required">*</span>
          </div>
          <button
            type="button"
            className={confirmed ? "location-picker__modify-btn" : "location-picker__open-btn"}
            onClick={openModal}
          >
            {confirmed ? "Modificar ubicación" : "Registrar ubicación"}
          </button>
        </div>
        {confirmed && (
          <>
            <p className="location-picker__success">✅ Ubicación confirmada:</p>
            <div className="location-picker__address-display">{address}</div>
          </>
        )}
      </div>
    );
  }

  // Render modal with simple inputs
  return (
    <div className="location-picker-modal-overlay" onClick={closeModal}>
      <div className="location-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="location-picker-modal__header">
          <h3 className="location-picker-modal__title">Registrar ubicación</h3>
          <button type="button" className="location-picker-modal__close" onClick={closeModal} aria-label="Cerrar modal">×</button>
        </div>
        <div className="location-picker-modal__body">
          <button type="button" className="location-picker-modal__gps-btn" onClick={handleGPS} disabled={isGettingGPS}>
            {isGettingGPS ? (
              <span><span className="location-picker-modal__gps-spinner" /> Obteniendo ubicación...</span>
            ) : (
              <span>Usar mi ubicación actual</span>
            )}
          </button>

          <div className="location-picker-modal__map-container">
            <LeafletMap
              key={leafletKey}
              initialPosition={coords.lat ? { lat: parseFloat(coords.lat), lng: parseFloat(coords.lng) } : { lat: -12.093456, lng: -77.021345 }}
              onSelect={handleMapSelect}
              onSearchResult={handleSearchResult}
              onSearchError={handleSearchError}
              draggable={true}
              onConfirm={confirmLocation}
              onCancel={closeModal}
              onGPS={handleGPS}
            />
          </div>
          <p className="location-picker-modal__map-hint">
            <strong>Arrastrar marcador:</strong> Ajustar ubicación exacta &nbsp;|&nbsp; 
            <strong>Click derecho:</strong> Mover marcador al punto &nbsp;|&nbsp;
            <strong>Mapa:</strong> Arrastrar para mover
          </p>

          <div className="location-picker-modal__actions">
            <button
              type="button"
              className="location-picker-modal__btn location-picker-modal__btn--confirm"
              disabled={!isLocationReady || isConfirming}
              onClick={confirmLocation}
            >
              {isConfirming ? 'Confirmando...' : 'Confirmar ubicación'}
            </button>
            <button
              type="button"
              className="location-picker-modal__btn location-picker-modal__btn--cancel"
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {showWarning && (
        <WarningModal 
          message={warningMsg} 
          onClose={() => setShowWarning(false)} 
        />
      )}
    </div>
  );
}