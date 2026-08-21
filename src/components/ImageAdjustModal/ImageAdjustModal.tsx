import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Check, X } from 'lucide-react';
import './ImageAdjustModal.css';

interface ImageAdjustModalProps {
  imageSrc: string;
  aspectRatio?: number; // width / height ratio (1 for avatar, 16/9 for cover)
  title?: string;
  onCancel: () => void;
  onApply: (croppedBlob: Blob) => void;
}

export default function ImageAdjustModal({
  imageSrc,
  aspectRatio = 1,
  title = 'Adjust Image',
  onCancel,
  onApply,
}: ImageAdjustModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const handleApply = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const targetWidth = 800;
      const targetHeight = targetWidth / aspectRatio;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          onApply(blob);
        }
      }, 'image/jpeg', 0.9);
    };
  };

  return (
    <div className="adjust-modal-overlay">
      <div className="adjust-modal-content">
        <div className="adjust-modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onCancel}><X size={20} /></button>
        </div>

        <div className="adjust-modal-body">
          <div 
            className="crop-preview-container" 
            style={{ aspectRatio: `${aspectRatio}` }}
          >
            <img
              src={imageSrc}
              alt="Adjust preview"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          </div>

          <div className="adjust-controls">
            <div className="control-group">
              <ZoomOut size={18} />
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
              <ZoomIn size={18} />
            </div>

            <button className="rotate-btn" onClick={() => setRotation((r) => (r + 90) % 360)}>
              <RotateCw size={18} />
              <span>Rotate</span>
            </button>
          </div>
        </div>

        <div className="adjust-modal-footer">
          <button className="btn-secondary" onClick={onCancel}>
            <X size={16} /> Cancel
          </button>
          <button className="btn-primary" onClick={handleApply}>
            <Check size={16} /> Apply & Upload
          </button>
        </div>
      </div>
    </div>
  );
}
