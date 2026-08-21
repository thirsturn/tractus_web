import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import './ImageAdjustModal.css';

interface ImageAdjustModalProps {
  isOpen: boolean;
  imageSrc: string;
  cropType: 'avatar' | 'cover';
  onClose: () => void;
  onApply: (file: File) => void;
}

export default function ImageAdjustModal({
  isOpen,
  imageSrc,
  cropType,
  onClose,
  onApply,
}: ImageAdjustModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imgRef.current = img;
      };
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { ...position };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({
      x: initialPos.current.x + dx,
      y: initialPos.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotateLeft = () => setRotation((prev) => (prev - 90) % 360);
  const handleRotateRight = () => setRotation((prev) => (prev + 90) % 360);

  const handleSave = () => {
    if (!imgRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const outputWidth = cropType === 'avatar' ? 400 : 1200;
    const outputHeight = cropType === 'avatar' ? 400 : 400;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.save();

    // Fill background
    ctx.fillStyle = '#1e1e2d';
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    // Center canvas
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(position.x * (outputWidth / 300), position.y * (outputHeight / 300));

    const img = imgRef.current;
    const aspect = img.width / img.height;
    let drawWidth = outputWidth;
    let drawHeight = outputWidth / aspect;

    if (drawHeight < outputHeight) {
      drawHeight = outputHeight;
      drawWidth = outputHeight * aspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `${cropType}_adjusted.jpg`, { type: 'image/jpeg' });
          onApply(file);
        }
      },
      'image/jpeg',
      0.9
    );
  };

  return (
    <div className="modal-overlay">
      <div className="adjust-modal-container">
        <div className="adjust-modal-header">
          <h3>Adjust {cropType === 'avatar' ? 'Profile Picture' : 'Cover Photo'}</h3>
          <button className="close-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div
          className={`crop-preview-area ${cropType}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="crop-image-wrapper"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            <img src={imageSrc} alt="Preview" draggable={false} />
          </div>

          <div className={`crop-overlay-mask ${cropType}`} />
        </div>

        <div className="adjust-controls">
          <div className="control-row">
            <ZoomOut size={18} />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="zoom-slider"
            />
            <ZoomIn size={18} />
          </div>

          <div className="control-row rotate-row">
            <button className="rotate-btn" onClick={handleRotateLeft}>
              <RotateCcw size={16} /> Rotate Left
            </button>
            <button className="rotate-btn" onClick={handleRotateRight}>
              <RotateCw size={16} /> Rotate Right
            </button>
          </div>
        </div>

        <div className="adjust-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            <Check size={18} /> Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
}
