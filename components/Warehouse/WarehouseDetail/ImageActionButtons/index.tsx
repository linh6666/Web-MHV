"use client";

import { useState, useEffect } from "react";
import { IconHeart } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { createFavorite } from "../../../../api/apicreateFavorites";
import { deleteFavorites } from "../../../../api/apiDeteleFavorites";
import { getListFavorites } from "../../../../api/apiGetListFavorites";

interface ImageActionButtonsProps {
  unitCode: string;
  projectId: string;
}

interface FavoriteItem {
  id?: string;
  favorite_id?: string;
  unit_code: string;
}

export default function ImageActionButtons({
  unitCode,
  projectId,
}: ImageActionButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // Thêm trạng thái kiểm tra ban đầu
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  // Kiểm tra trạng thái yêu thích khi load trang
  useEffect(() => {
    // Thử lấy kết quả từ cache local (nếu có) để hiển thị tức thì
    const cacheKey = `fav_${projectId}_${unitCode}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached === "true") {
      setIsFavorite(true);
    }

    const checkFavoriteStatus = async () => {
      if (!projectId || !unitCode) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await getListFavorites(projectId);

        const favorites: FavoriteItem[] = response.data || [];

        const favoriteItem = favorites.find(
          (item) =>
            String(item.unit_code).trim() === String(unitCode).trim()
        );

        if (favoriteItem) {
          setIsFavorite(true);
          setFavoriteId(
            favoriteItem.id || favoriteItem.favorite_id || null
          );
          localStorage.setItem(cacheKey, "true"); // Update cache
        } else {
          setIsFavorite(false);
          setFavoriteId(null);
          localStorage.removeItem(cacheKey); // Clear cache if not found
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
      } finally {
        setIsChecking(false); // Hoàn tất kiểm tra
      }
    };

    checkFavoriteStatus();
  }, [projectId, unitCode]);

  const handleFavorite = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (isFavorite) {
        // --- ĐANG YÊU THÍCH -> XÓA ---
        let idToDelete = favoriteId;

        if (!idToDelete) {
          const res = await getListFavorites(projectId);
          const list: FavoriteItem[] = res.data || [];

          const item = list.find(
            (i) =>
              String(i.unit_code).trim() === String(unitCode).trim()
          );

          idToDelete = item?.id || item?.favorite_id || null;
        }

        if (idToDelete) {
          await deleteFavorites(idToDelete);
          setIsFavorite(false);
          setFavoriteId(null);
          localStorage.removeItem(`fav_${projectId}_${unitCode}`); // Xóa cache
        } else {
          setIsFavorite(false);
          localStorage.removeItem(`fav_${projectId}_${unitCode}`); // Xóa cache
        }
      } else {
        // --- CHƯA YÊU THÍCH -> THÊM ---
        const response = await createFavorite({
          unit_code: unitCode,
          project_id: projectId,
        });

        setIsFavorite(true);

        const newId =
          response?.data?.id ||
          response?.id ||
          response?.data?.favorite_id ||
          response?.favorite_id ||
          null;

        if (newId) {
          setFavoriteId(newId);
        } else {
          const reloadResponse = await getListFavorites(projectId);
          const list: FavoriteItem[] = reloadResponse.data || [];

          const item = list.find(
            (i) =>
              String(i.unit_code).trim() === String(unitCode).trim()
          );

          setFavoriteId(item?.id || item?.favorite_id || null);
        }
        // Cập nhật cache
        localStorage.setItem(`fav_${projectId}_${unitCode}`, "true");
      }
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response?.status === 409
      ) {
        setIsFavorite(true);
        localStorage.setItem(`fav_${projectId}_${unitCode}`, "true");

        const reloadResponse = await getListFavorites(projectId);
        const list: FavoriteItem[] = reloadResponse.data || [];

        const item = list.find(
          (i) =>
            String(i.unit_code).trim() === String(unitCode).trim()
        );

        setFavoriteId(item?.id || item?.favorite_id || null);
      } else {
        console.error("Lỗi thao tác yêu thích:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <button
        onClick={handleFavorite}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 10px",
          borderRadius: "999px",
          fontSize: "14px",
          fontWeight: 500,
          border: isFavorite
            ? "1px solid #ff4d4f"
            : "1px solid #e5e7eb",
          backgroundColor: isFavorite ? "#fff5f5" : "#ffffff",
          color: isFavorite ? "#ff4d4f" : "#294b61",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading || (isChecking && !isFavorite) ? 0.8 : 1,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isFavorite) {
            e.currentTarget.style.boxShadow =
              "0 6px 18px rgba(0,0,0,0.18)";
            e.currentTarget.style.transform =
              "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.12)";
          e.currentTarget.style.transform =
            "translateY(0)";
        }}
      >
        <IconHeart
          size={18}
          color={isFavorite ? "#ff4d4f" : "#294b61"}
          fill={isFavorite ? "#ff4d4f" : "none"}
          style={{ transition: "fill 0.2s ease, color 0.2s ease" }}
        />
        {loading
          ? "Đang xử lý..."
          : isFavorite
          ? "Đã yêu thích"
          : "Yêu thích"}
      </button>
    </div>
  );
}
