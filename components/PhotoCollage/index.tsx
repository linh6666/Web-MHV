"use client";

import React, { useState, useRef } from "react";
import NextImage from "next/image";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import {
  IconPhotoPlus,
  IconDownload,
  IconReplace,
  IconCirclePlus,
  IconCircleMinus,
  IconX,
  IconRotateClockwise,
  IconFlipHorizontal,
  IconFlipVertical,
  IconTrash,
  IconChevronLeft
} from "@tabler/icons-react";
import "./styles.css";
import { NotificationExtension } from "../../extension/NotificationExtension";

const CANVAS_SIZE = 450;
const EXPORT_SIZE = 1200;

interface TextItem {
  id: string;
  content: string;
  color: string;
  size: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  x: number;
  y: number;
}

export default function PhotoCollage() {
  const [image, setImage] = useState<string | null>(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  
  // Quản lý khung hình
  const frames = [
    { id: "frame1", src: "/Khung%20MohinhViet.png", title: "Khung Mô hình Việt" },
    { id: "frame2", src: "/KHUNG%20VIETMODEL.png", title: "Khung VietModel" }
  ];
  const [selectedFrame, setSelectedFrame] = useState(frames[0].src);
  
  // Quản lý danh sách chữ
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const activeText = texts.find(t => t.id === activeTextId);

  const addNewText = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newText: TextItem = {
      id: newId,
      content: "Nhập nội dung...",
      color: "#ffffff",
      size: 32,
      rotation: 0,
      flipH: false,
      flipV: false,
      x: 225,
      y: 225
    };
    setTexts([...texts, newText]);
    setActiveTextId(newId);
    setEditingTextId(newId);
  };

  const updateActiveText = (updates: Partial<TextItem>) => {
    if (!activeTextId) return;
    setTexts(texts.map(t => t.id === activeTextId ? { ...t, ...updates } : t));
  };

  const removeActiveText = (id: string) => {
    setTexts(texts.filter(t => t.id !== id));
    if (activeTextId === id) setActiveTextId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const currentCanvasWidth = canvasWrapperRef.current?.getBoundingClientRect().width || CANVAS_SIZE;
          const scaleW = currentCanvasWidth / img.width;
          const scaleH = currentCanvasWidth / img.height;
          const initialScale = Math.max(scaleW, scaleH);
          
          setImgDimensions({ width: img.width, height: img.height });
          setImage(src);
          
          setTimeout(() => {
            if (transformWrapperRef.current) {
              transformWrapperRef.current.setTransform(0, 0, initialScale, 0);
            }
          }, 100);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!image || !transformWrapperRef.current) return;
    
    try {
      const canvas = document.createElement("canvas");
      canvas.width = EXPORT_SIZE;
      canvas.height = EXPORT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);

      const state = transformWrapperRef.current.instance?.transformState 
        || transformWrapperRef.current.state 
        || { positionX: 0, positionY: 0, scale: 1 };

      const currentCanvasWidth = canvasWrapperRef.current?.getBoundingClientRect().width || CANVAS_SIZE;
      const exportScaleRatio = EXPORT_SIZE / currentCanvasWidth;

      // 1. Vẽ ảnh người dùng
      const img = new Image();
      const imgPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      img.src = image;
      await imgPromise;

      ctx.save();
      ctx.translate(state.positionX * exportScaleRatio, state.positionY * exportScaleRatio);
      ctx.scale(state.scale * exportScaleRatio, state.scale * exportScaleRatio);

      ctx.translate(imgDimensions.width / 2, imgDimensions.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.translate(-imgDimensions.width / 2, -imgDimensions.height / 2);
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, imgDimensions.width, imgDimensions.height);
      ctx.restore();

      // 2. Vẽ khung ảnh
      const frameImg = new Image();
      const framePromise = new Promise((resolve, reject) => {
        frameImg.onload = resolve;
        frameImg.onerror = () => reject(new Error("Không thể tải khung nền"));
      });
      frameImg.src = selectedFrame;
      await framePromise;
      ctx.drawImage(frameImg, 0, 0, EXPORT_SIZE, EXPORT_SIZE);

      // Lấy giá trị --canvas-scale thực tế từ CSS (phục vụ mobile hiển thị scale nhỏ hơn)
      const canvasScaleStr = canvasWrapperRef.current ? getComputedStyle(canvasWrapperRef.current).getPropertyValue('--canvas-scale') : "1";
      const canvasScale = parseFloat(canvasScaleStr) || 1;
      
      // Tỷ lệ chuyển đổi vị trí chữ từ CANVAS_SIZE (cố định 450) sang EXPORT_SIZE (1200)
      const textPositionRatio = EXPORT_SIZE / CANVAS_SIZE;

      // 3. Vẽ tất cả mẫu chữ
      texts.forEach(text => {
        if (!text.content) return;
        ctx.save();
        
        // Kích thước chữ dựa trên tỷ lệ thực tế hiển thị
        const exportTextSize = text.size * canvasScale * exportScaleRatio;
        ctx.font = `bold ${exportTextSize}px "Nunito Sans", sans-serif`;
        ctx.fillStyle = text.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.translate(text.x * textPositionRatio, text.y * textPositionRatio);
        ctx.rotate((text.rotation * Math.PI) / 180);
        ctx.scale(text.flipH ? -1 : 1, text.flipV ? -1 : 1);

        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(text.content, 0, 0);
        ctx.restore();
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          NotificationExtension.Fails("Không thể tạo ảnh để tải về.");
          return;
        }

        const url = URL.createObjectURL(blob);
        
        // Tải xuống trực tiếp. Mọi thiết bị (kể cả Mobile Safari/Chrome) đều dùng chung một cách.
        // Hạn chế: Có thể không tải được trong nội bộ Zalo/FB app.
        const link = document.createElement("a");
        link.download = `PhotoCollage_${Date.now()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Giữ delay 2000ms để đảm bảo Safari iOS có đủ thời gian hiển thị thông báo "Bạn có muốn tải về?"
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        NotificationExtension.Success("Đã tải ảnh về máy!");
      }, "image/png", 1.0);
    } catch (error) {
      console.error("Download error:", error);
      NotificationExtension.Fails("Đã có lỗi xảy ra khi tải ảnh.");
    }
  };

  return (
    <div className="photo-collage-container">
      <div className="collage-header">
        <h1 className="collage-title">Chào mừng Kỷ niệm 20 năm Thành lập Công ty TNHH Mô hình Việt</h1>
        <div className="collage-subtitle-container">
          <p className="collage-description">
            Hai thập kỷ vừa qua là một hành trình đầy tự hào, nơi mỗi bước tiến của Mô hình Việt đều mang theo sự cống hiến và tâm huyết của tất cả MHVer. Giờ đây, tại cột mốc 20 năm, chúng ta – Mô hình Việt và các MHVer, hãy tiếp tục cùng nhau vững bước chinh phục hành trình phía trước, cùng kiến tạo nên những giá trị bền vững và từng bước vươn xa hơn trên bản đồ mô hình kiến trúc thế giới!
          </p>
          <p className="collage-subtitle">Thay khung ảnh đại diện và cùng Mô hình Việt lan tỏa tinh thần Vững Bước!</p>
        </div>
      </div>

      {!image ? (
        <div className="upload-box-wrapper" onClick={() => fileInputRef.current?.click()}>
          <div className="upload-box-glow" />
          <div className="upload-box-border" />
          <div className="upload-box-content">
            <div className="upload-icon-container"><IconPhotoPlus size={48} /></div>
            <h3 className="upload-text-main">Nhấn để chọn ảnh</h3>
          </div>
        </div>
      ) : (
        <div 
          className={`editor-container ${editingTextId ? "is-editing-text" : ""}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveTextId(null);
          }}
          onMouseMove={(e) => {
            if (isDraggingText && activeTextId && canvasWrapperRef.current) {
              const rect = canvasWrapperRef.current.getBoundingClientRect();
              const scale = CANVAS_SIZE / rect.width;
              updateActiveText({
                x: Math.max(0, Math.min(CANVAS_SIZE, (e.clientX - rect.left) * scale)),
                y: Math.max(0, Math.min(CANVAS_SIZE, (e.clientY - rect.top) * scale))
              });
            }
          }}
          onTouchMove={(e) => {
            if (isDraggingText && activeTextId && canvasWrapperRef.current) {
              if (e.cancelable) e.preventDefault();
              const touch = e.touches[0];
              const rect = canvasWrapperRef.current.getBoundingClientRect();
              const scale = CANVAS_SIZE / rect.width;
              updateActiveText({
                x: Math.max(0, Math.min(CANVAS_SIZE, (touch.clientX - rect.left) * scale)),
                y: Math.max(0, Math.min(CANVAS_SIZE, (touch.clientY - rect.top) * scale))
              });
            }
          }}
          style={{ touchAction: isDraggingText ? "none" : "auto" }}
          onMouseUp={() => setIsDraggingText(false)}
          onMouseLeave={() => setIsDraggingText(false)}
          onTouchEnd={() => setIsDraggingText(false)}
        >
          <div 
            className="canvas-area"
          >
            <button className="close-btn" onClick={() => setImage(null)}><IconX size={24} /></button>
            <div 
              ref={canvasWrapperRef} 
              className="canvas-wrapper"
              onClick={(e) => { if (e.target === e.currentTarget) setActiveTextId(null); }}
            >
              <TransformWrapper
                ref={transformWrapperRef}
                initialScale={1}
                minScale={0.1}
                maxScale={10}
                limitToBounds={false}
                centerZoomedOut={false}
                alignmentAnimation={{ disabled: true }}
                panning={{ velocityDisabled: true }}
                onTransformed={(p) => setZoom(p.state.scale)}
              >
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                  <NextImage 
                    src={image} alt="UserPhoto" 
                    width={imgDimensions.width} height={imgDimensions.height} unoptimized
                    style={{ 
                      width: "auto", height: "auto", maxWidth: "none", 
                      transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                      transition: "transform 0.3s ease" 
                    }} 
                  />
                </TransformComponent>
              </TransformWrapper>

              <NextImage 
                src={selectedFrame} alt="Frame" 
                width={CANVAS_SIZE} height={CANVAS_SIZE}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }} 
              />

              {texts.map(text => (
                <div 
                  key={text.id}
                  className={`draggable-text-overlay ${activeTextId === text.id ? "active" : ""} ${editingTextId === text.id ? "editing" : ""}`}
                  style={{
                    position: "absolute", 
                    left: `${(text.x / CANVAS_SIZE) * 100}%`, 
                    top: `${(text.y / CANVAS_SIZE) * 100}%`,
                    color: text.color, 
                    fontSize: `calc(${text.size}px * (var(--canvas-scale, 1)))`, 
                    fontWeight: 800,
                    zIndex: 20, userSelect: editingTextId === text.id ? "text" : "none", 
                    transform: `translate(-50%, -50%) rotate(${text.rotation}deg) scale(${text.flipH ? -1 : 1}, ${text.flipV ? -1 : 1})`,
                    textShadow: "2px 2px 8px rgba(0,0,0,0.6)", whiteSpace: "nowrap",
                    fontFamily: "var(--font-nunito), sans-serif",
                    border: activeTextId === text.id ? "2px solid #00a8ff" : "none",
                    borderRadius: "4px", padding: "4px 8px", cursor: editingTextId === text.id ? "text" : "move",
                    touchAction: "none"
                  }}
                  onMouseDown={(e) => { 
                    if (editingTextId === text.id) return;
                    e.stopPropagation(); 
                    setActiveTextId(text.id); 
                    setIsDraggingText(true); 
                  }}
                  onTouchStart={(e) => { 
                    if (editingTextId === text.id) return;
                    e.stopPropagation(); 
                    setActiveTextId(text.id); 
                    setIsDraggingText(true); 
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingTextId(text.id);
                  }}
                >
                  <span
                    contentEditable={editingTextId === text.id}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      updateActiveText({ content: e.currentTarget.innerText });
                      setEditingTextId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur();
                      }
                    }}
                    style={{ outline: "none", display: "inline-block", minWidth: "1ch" }}
                    ref={(el) => {
                      if (el && editingTextId === text.id) {
                        // Focus and select all text if it's the default "Nhập nội dung..."
                        if (text.content === "Nhập nội dung...") {
                          const range = document.createRange();
                          range.selectNodeContents(el);
                          const sel = window.getSelection();
                          if (sel) {
                            sel.removeAllRanges();
                            sel.addRange(range);
                          }
                        }
                        el.focus();
                      }
                    }}
                  >
                    {text.content}
                  </span>
                  {activeTextId === text.id && (
                    <>
                      <div className="handle-line" />
                      <div className="text-handle text-handle-top" />
                      <div className="text-handle text-handle-left" />
                      <div className="text-handle text-handle-right" />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Hàng chọn Khung Hình */}
            <div className="frame-picker-bar">
              <span className="picker-label">Mẫu khung hình:</span>
              <div className="frames-row">
                {frames.map((f) => (
                  <div 
                    key={f.id} 
                    className={`frame-thumb-item ${selectedFrame === f.src ? "active" : ""}`}
                    onClick={() => setSelectedFrame(f.src)}
                    title={f.title}
                  >
                    <img src={f.src} alt={f.title} className="frame-thumb-img" />
                    {selectedFrame === f.src && <div className="frame-active-dot" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="controls-area">
            <div className="control-panel">
              <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
                {!activeTextId ? (
                  <button onClick={addNewText} className="add-text-pill-btn" style={{ margin: 0 }}>A+ Thêm chữ</button>
                ) : (
                  <button onClick={() => setActiveTextId(null)} className="add-text-pill-btn" style={{ margin: 0 }}>
                    <IconChevronLeft size={16} /> Trở lại
                  </button>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="zoom-btn" onClick={() => setRotation(r => r + 50)} title="Xoay ảnh 50°">
                    <IconRotateClockwise size={20} />
                  </button>
                  <button className={`zoom-btn ${flipH ? "active" : ""}`} onClick={() => setFlipH(!flipH)} title="Lật ngang" style={flipH ? { backgroundColor: "rgba(99, 102, 241, 0.4)" } : {}}>
                    <IconFlipHorizontal size={20} />
                  </button>
                  <button className={`zoom-btn ${flipV ? "active" : ""}`} onClick={() => setFlipV(!flipV)} title="Lật dọc" style={flipV ? { backgroundColor: "rgba(99, 102, 241, 0.4)" } : {}}>
                    <IconFlipVertical size={20} />
                  </button>
                </div>
              </div>

              {activeTextId && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[ "#9FADBA", "#294B61", "#6C727E", "#BB8D38"].map(c => (
                      <div 
                        key={c} 
                        onClick={() => updateActiveText({ color: activeText?.color === c ? "#ffffff" : c })} 
                        style={{ width: "16px", height: "16px", background: c, borderRadius: "50%", cursor: "pointer", border: activeText?.color === c ? "2px solid white" : "none" }} 
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "-8px" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>Kích thước chữ:</span>
                    <span style={{ fontSize: "11px", color: "#818cf8", fontWeight: "bold" }}>{activeText?.size}px</span>
                  </div>
                  <input type="range" min="12" max="100" value={activeText?.size || 32} onChange={(e) => updateActiveText({ size: parseInt(e.target.value) })} className="range-slider" style={{ height: "4px" }} />
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button className="zoom-btn" style={{ width: "28px", height: "28px" }} onClick={() => updateActiveText({ rotation: (activeText?.rotation || 0) + 50 })} title="Xoay chữ 50°">
                      <IconRotateClockwise size={15} />
                    </button>
                    <button className={`zoom-btn ${activeText?.flipH ? "active" : ""}`} style={{ width: "28px", height: "28px", backgroundColor: activeText?.flipH ? "rgba(99, 102, 241, 0.4)" : "" }} onClick={() => updateActiveText({ flipH: !activeText?.flipH })} title="Lật ngang chữ">
                      <IconFlipHorizontal size={15} />
                    </button>
                    <button className={`zoom-btn ${activeText?.flipV ? "active" : ""}`} style={{ width: "28px", height: "28px", backgroundColor: activeText?.flipV ? "rgba(99, 102, 241, 0.4)" : "" }} onClick={() => updateActiveText({ flipV: !activeText?.flipV })} title="Lật dọc chữ">
                      <IconFlipVertical size={15} />
                    </button>
                    <button onClick={() => removeActiveText(activeTextId)} style={{ width: "28px", height: "28px", background: "#ef4444", border: "none", color: "white", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Xóa text">
                      <IconTrash size={15} />
                    </button>
                    <button onClick={addNewText} style={{ marginLeft: "auto", background: "none", border: "1px dashed #818cf8", color: "#818cf8", padding: "4px 8px", borderRadius: "5px", cursor: "pointer", fontSize: "10px" }}>+ Thêm tiếp</button>
                  </div>
                </div>
              )}
            </div>

            {!activeTextId && (
              <div className="control-panel">
                {/* <h4 className="panel-title">1. Điều chỉnh kích thước</h4> */}
                <div className="zoom-controls">
                  <button onClick={() => transformWrapperRef.current?.zoomOut(0.1)} className="zoom-btn">
                    <IconCircleMinus size={22} />
                  </button>
                  <input 
                    type="range" min="0.1" max="10" step="0.01" value={zoom}
                    onChange={(e) => {
                      const newScale = parseFloat(e.target.value);
                      const wrapper = transformWrapperRef.current;
                      const canvas = canvasWrapperRef.current;
                      if (wrapper && canvas) {
                        const rect = canvas.getBoundingClientRect();
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const state = wrapper.instance.transformState;
                        const newPosX = centerX - (centerX - state.positionX) * (newScale / state.scale);
                        const newPosY = centerY - (centerY - state.positionY) * (newScale / state.scale);
                        wrapper.setTransform(newPosX, newPosY, newScale, 0);
                      }
                    }}
                    className="range-slider"
                  />
                  <button onClick={() => transformWrapperRef.current?.zoomIn(0.1)} className="zoom-btn">
                    <IconCirclePlus size={22} />
                  </button>
                </div>
                <p style={{ color: "#4b5563", fontSize: "12px", marginTop: "4px", textAlign: "center" }}>
                  Độ phóng đại: {Math.round(zoom * 100)}%
                </p>
              </div>
            )}

            <div className="action-buttons">
              <button onClick={() => fileInputRef.current?.click()} className="btn-secondary"><IconReplace size={20} /> Đổi ảnh</button>
              <button onClick={handleDownload} className="btn-primary"><IconDownload size={20} /> Tải về</button>
            </div>
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
    </div>
  );
}
