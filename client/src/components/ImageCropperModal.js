import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import '../pages/Profile.css';

const ImageCropperModal = ({ image, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = useCallback((crop) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom) => {
        setZoom(zoom);
    }, []);

    const onRotationChange = useCallback((rotation) => {
        setRotation(rotation);
    }, []);

    const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="profile-modal" style={{ maxWidth: '450px', display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header">
                    <h3>Edit Photo</h3>
                    <button className="close-modal-btn" onClick={onCancel}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="modal-body" style={{ position: 'relative', height: '350px', background: '#111', padding: 0 }}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                        onRotationChange={onRotationChange}
                        cropShape="round"
                        showGrid={false}
                    />
                </div>

                <div className="modal-footer" style={{ flexDirection: 'column', gap: '20px', padding: '24px' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="control-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                                ZOOM <span>{Math.round(zoom * 100)}%</span>
                            </label>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="zoom-range"
                                style={{ width: '100%', accentColor: 'var(--accent)' }}
                            />
                        </div>

                        <div className="control-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                                ROTATE <span>{rotation}°</span>
                            </label>
                            <input
                                type="range"
                                value={rotation}
                                min={0}
                                max={360}
                                step={1}
                                aria-labelledby="Rotation"
                                onChange={(e) => setRotation(parseInt(e.target.value))}
                                className="rotation-range"
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'stretch', width: '100%' }}>
                        <button className="nav-btn nav-btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={onCancel}>Cancel</button>
                        <button className="nav-btn nav-btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCrop}>Apply & Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
