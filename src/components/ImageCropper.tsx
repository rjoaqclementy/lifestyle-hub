import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { Crop } from 'react-image-crop';
import { X } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  image: File;
  onCrop: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
  cropShape?: 'rect' | 'round';
}

const ImageCropper: React.FC<ImageCropperProps> = ({ 
  image, 
  onCrop, 
  onCancel,
  aspectRatio = 1,
  cropShape = 'round'
}) => {
  const [crop, setCrop] = React.useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = React.useState<any>(null);
  const [imgSrc, setImgSrc] = React.useState<string>('');
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
    });
    reader.readAsDataURL(image);
  }, [image]);

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCrop(blob);
      }
    }, image.type);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl p-4"
      >
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4">Crop Image</h2>

        <div className="flex flex-col items-center">
          {imgSrc && (
            <div className="max-h-[70vh] overflow-hidden mb-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                circularCrop={cropShape === 'round'}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop me"
                  className="max-h-[65vh] object-contain"
                />
              </ReactCrop>
            </div>
          )}

          <div className="flex justify-end space-x-3 w-full">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              className="btn-primary"
              disabled={!completedCrop}
            >
              Apply Crop
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ImageCropper;