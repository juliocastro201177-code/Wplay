import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Crop, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Check, 
  Sparkles, 
  Image as ImageIcon,
  FolderOpen,
  CloudUpload,
  Code2,
  ChevronRight
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import { db } from '../../services/databaseService';

interface ImageCropperModalProps {
  isOpen: boolean;
  type: 'avatar' | 'banner';
  currentUserId: string;
  onImageSaved: (url: string, type: 'avatar' | 'banner', storagePath: string) => void;
  onClose: () => void;
}

// Preset samples for fast testing if user doesn't have image files handy
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
];

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80', // Party lights
  'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?w=1000&auto=format&fit=crop&q=80', // Cyber neon
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80', // Tropical sunset
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80', // Golden luxury
];

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  type,
  currentUserId,
  onImageSaved,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    type === 'avatar' ? PRESET_AVATARS[0] : PRESET_BANNERS[0]
  );
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Uploading simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string | null>(null);
  const [showFlutterCode, setShowFlutterCode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Stop camera when closing
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (!isOpen) return null;

  // Handle local file selection (image_picker equivalent)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          playSound('pop');
          setSelectedImage(uploadEvent.target.result as string);
          setZoom(1);
          setPosition({ x: 0, y: 0 });
          setRotation(0);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Camera
  const handleStartCamera = async () => {
    try {
      playSound('pop');
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera could not be accessed directly:', err);
      alert('No se pudo acceder a la cámara en este dispositivo o permisos no concedidos. Puedes subir una foto desde tu galería.');
      setIsCameraActive(false);
    }
  };

  // Capture Camera Snapshot
  const handleCaptureSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = video.videoWidth || 640;
      tempCanvas.height = video.videoHeight || 640;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
        const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.9);
        setSelectedImage(dataUrl);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        playSound('camera');
        stopCamera();
      }
    }
  };

  // Mouse / Touch Dragging to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Crop and Save to Firebase Storage + Firestore simulation
  const handleCropAndSave = () => {
    if (!selectedImage) return;

    playSound('coin');
    setIsUploading(true);
    setUploadStep('1. Recortando imagen con ImageCropper...');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedImage;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (type === 'avatar') {
        // Square canvas for circular avatar
        const size = 400;
        canvas.width = size;
        canvas.height = size;

        // Circular clipping
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Fill background
        ctx.fillStyle = '#1A0B2E';
        ctx.fillRect(0, 0, size, size);

        // Draw transformed image
        ctx.translate(size / 2 + position.x, size / 2 + position.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        const aspect = img.width / img.height;
        let drawW = size;
        let drawH = size;
        if (aspect > 1) {
          drawW = size * aspect;
        } else {
          drawH = size / aspect;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      } else {
        // Banner (16:9 / 800x450)
        const w = 800;
        const h = 400;
        canvas.width = w;
        canvas.height = h;

        ctx.save();
        ctx.fillStyle = '#1A0B2E';
        ctx.fillRect(0, 0, w, h);

        ctx.translate(w / 2 + position.x, h / 2 + position.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        const aspect = img.width / img.height;
        let drawW = w;
        let drawH = h;
        if (aspect > w / h) {
          drawW = h * aspect;
        } else {
          drawH = w / aspect;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

      setTimeout(() => {
        setUploadStep(`2. Subiendo a Firebase Storage en /${type === 'avatar' ? 'avatars' : 'banners'}/${currentUserId}.jpg...`);
      }, 500);

      setTimeout(() => {
        setUploadStep('3. Guardando URL en documento de usuario en Firestore...');
        let result;
        if (type === 'avatar') {
          result = db.saveUserAvatar(currentUserId, croppedDataUrl);
        } else {
          result = db.saveUserBanner(currentUserId, croppedDataUrl);
        }

        setTimeout(() => {
          setUploadStep('¡Guardado exitosamente en Firestore! 🎉');
          setTimeout(() => {
            setIsUploading(false);
            onImageSaved(croppedDataUrl, type, result.storagePath);
            onClose();
          }, 600);
        }, 600);
      }, 1200);
    };

    img.onerror = () => {
      // Fallback in case of CORS restriction on remote image
      let result;
      if (type === 'avatar') {
        result = db.saveUserAvatar(currentUserId, selectedImage);
      } else {
        result = db.saveUserBanner(currentUserId, selectedImage);
      }
      setIsUploading(false);
      onImageSaved(selectedImage, type, result.storagePath);
      onClose();
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#2B1055] via-[#1F0C38] to-[#120422] border-2 border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF2E9D] to-purple-600 flex items-center justify-center text-white shadow-md">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-white">
                {type === 'avatar' ? 'Subir Foto de Perfil' : 'Subir Portada de Perfil'}
              </h3>
              <p className="text-[10px] text-purple-300 font-mono">
                Almacenamiento: /{type === 'avatar' ? 'avatars' : 'banners'}/{currentUserId}.jpg
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image / Camera View Area */}
        <div className="p-4 flex flex-col items-center">
          {isCameraActive ? (
            <div className="relative w-full h-64 bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-purple-500/40">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 flex items-center gap-3">
                <button
                  onClick={handleCaptureSnapshot}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF2E9D] to-purple-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capturar Foto</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-full bg-black/60 text-white text-xs hover:bg-black/80 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full h-64 bg-[#0F041B] rounded-2xl overflow-hidden border border-purple-600/30 flex items-center justify-center cursor-move select-none"
            >
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FF2E9D_1px,transparent_1px)] [background-size:12px_12px]" />

              {/* Transformed Image */}
              {selectedImage && (
                <div
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                  className="flex items-center justify-center pointer-events-none"
                >
                  <img
                    ref={imageElementRef}
                    src={selectedImage}
                    alt="Recorte"
                    className="max-h-72 max-w-72 object-contain pointer-events-none rounded-lg"
                  />
                </div>
              )}

              {/* Crop Mask Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {type === 'avatar' ? (
                  <div className="relative">
                    {/* Circle Cutout guide with VIP border */}
                    <div className="w-48 h-48 rounded-full border-2 border-[#FF2E9D] shadow-[0_0_0_9999px_rgba(15,4,27,0.78)] flex items-center justify-center">
                      <div className="w-full h-full rounded-full border border-dashed border-white/50 animate-pulse" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-pink-300 bg-black/70 px-2 py-0.5 rounded-full border border-pink-500/30 whitespace-nowrap">
                      Recorte Circular (image_cropper)
                    </span>
                  </div>
                ) : (
                  <div className="relative w-[90%] h-36 border-2 border-[#FF2E9D] shadow-[0_0_0_9999px_rgba(15,4,27,0.78)] rounded-xl flex items-center justify-center">
                    <div className="w-full h-full border border-dashed border-white/50 rounded-xl" />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-pink-300 bg-black/70 px-2 py-0.5 rounded-full border border-pink-500/30 whitespace-nowrap">
                      Recorte de Portada 16:9
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cropper Controls (Zoom, Pan, Rotate) */}
          <div className="w-full mt-3 p-2 bg-purple-950/40 rounded-xl border border-purple-800/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <ZoomOut className="w-3.5 h-3.5 text-purple-300" />
              <input
                type="range"
                min="0.6"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#FF2E9D] cursor-pointer"
              />
              <ZoomIn className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-[10px] font-mono text-purple-300 w-8 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <button
              onClick={() => {
                playSound('pop');
                setRotation((r) => (r + 90) % 360);
              }}
              className="p-1.5 rounded-lg bg-purple-800/50 hover:bg-purple-700 text-purple-200 transition"
              title="Girar 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Sources & Presets */}
          <div className="w-full mt-3 flex items-center justify-between gap-2">
            {/* Real File Picker button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => {
                playSound('pop');
                fileInputRef.current?.click();
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/40 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Abrir Galería</span>
            </button>

            {/* Camera Snapshot button */}
            <button
              onClick={handleStartCamera}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/40 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Camera className="w-3.5 h-3.5 text-pink-400" />
              <span>Usar Cámara</span>
            </button>
          </div>

          {/* Preset options */}
          <div className="w-full mt-3">
            <div className="text-[11px] font-bold text-purple-300 mb-1.5 flex items-center justify-between">
              <span>Galería Rápida WePlay:</span>
              <span className="text-[9px] text-gray-400">Toca para probar</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {(type === 'avatar' ? PRESET_AVATARS : PRESET_BANNERS).map((presetUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playSound('pop');
                    setSelectedImage(presetUrl);
                    setZoom(1);
                    setPosition({ x: 0, y: 0 });
                    stopCamera();
                  }}
                  className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                    selectedImage === presetUrl ? 'border-[#FF2E9D] scale-105 shadow-md' : 'border-purple-800/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Flutter Code reference toggle */}
          <div className="w-full mt-2">
            <button
              onClick={() => {
                playSound('pop');
                setShowFlutterCode(!showFlutterCode);
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-black/40 hover:bg-black/60 border border-purple-800/30 flex items-center justify-between text-[11px] text-purple-300 transition"
            >
              <span className="flex items-center gap-1.5 font-bold">
                <Code2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Código Flutter (image_picker + image_cropper + Firebase)</span>
              </span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showFlutterCode ? 'rotate-90' : ''}`} />
            </button>

            {showFlutterCode && (
              <div className="mt-2 p-2.5 bg-black/80 rounded-xl border border-purple-800/40 text-[10px] font-mono text-purple-200 overflow-x-auto max-h-36">
                <p className="text-gray-400">// 1. Selección y Recorte Circular</p>
                <p className="text-cyan-300">{`final picker = ImagePicker();\nfinal pickedFile = await picker.pickImage(source: ImageSource.gallery);`}</p>
                <p className="text-yellow-300 mt-1">{`final croppedFile = await ImageCropper().cropImage(\n  sourcePath: pickedFile.path,\n  cropStyle: CropStyle.circle,\n  aspectRatioPresets: [CropAspectRatioPreset.square],\n);`}</p>
                <p className="text-gray-400 mt-2">// 2. Subida a Firebase Storage</p>
                <p className="text-pink-300">{`final ref = FirebaseStorage.instance.ref().child('/avatars/\${uid}.jpg');\nawait ref.putFile(File(croppedFile.path));\nfinal url = await ref.getDownloadURL();`}</p>
                <p className="text-gray-400 mt-2">// 3. Guardar en Firestore</p>
                <p className="text-green-300">{`await FirebaseFirestore.instance.collection('users').doc(uid).update({\n  'avatarUrl': url,\n});`}</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Stepper Progress */}
        {isUploading && (
          <div className="px-5 py-2 bg-pink-950/40 border-y border-pink-500/30 text-center">
            <span className="text-xs font-bold text-pink-300 animate-pulse flex items-center justify-center gap-2">
              <CloudUpload className="w-4 h-4 animate-bounce" />
              <span>{uploadStep}</span>
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 border-t border-purple-800/40 bg-[#16062A]/95 flex items-center gap-3">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            disabled={isUploading}
            className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleCropAndSave}
            disabled={isUploading || !selectedImage}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E9D] via-pink-600 to-purple-600 hover:opacity-95 text-white font-heading font-black text-sm shadow-[0_0_20px_rgba(255,46,157,0.4)] transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4 text-yellow-300 stroke-[3]" />
            <span>{isUploading ? 'Procesando...' : 'Recortar y Subir'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
