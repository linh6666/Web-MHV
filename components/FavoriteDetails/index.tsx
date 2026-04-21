"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./FavoriteDetails.module.css";
import {
  IconHeartFilled,
} from "@tabler/icons-react";
import { getListFavorites } from "../../api/apiGetListFavorites";
import { deleteFavorites } from "../../api/apiDeteleFavorites";
import { Getlisthome } from "../../api/apiGetListHome";
import { Image } from "@mantine/core";

/* =======================
   TYPE
======================= */
interface FavoriteItem {
  id: string;
  unit_code: string;
  status_unit: string;
  unit_name: string;
  leaf_id: string;
  node_attribute_id?: string;
  unit_id?: string;
  price: string;
  building_type: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  describe_vi?: string;
  favorite_id: string;
}

interface HomeImage {
  url: string;
  file_name?: string;
  file_type?: string;
}

export default function FavoriteDetails() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const projectId = searchParams.get("id");

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [previewItem, setPreviewItem] =
    useState<FavoriteItem | null>(null);

  const [activeItem, setActiveItem] =
    useState<FavoriteItem | null>(null);

  // map (id/leaf_id/unit_code) -> danh sách ảnh
  const [imageMap, setImageMap] = useState<
    Record<string, string[]>
  >({});

  /* =======================
     FETCH FAVORITES
  ======================= */
  useEffect(() => {
    if (!projectId) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);

        const res = await getListFavorites(projectId);
        const data: FavoriteItem[] = res.data || [];

        setFavorites(data);

        if (data.length > 0) {
          setActiveItem(data[0]);
          setPreviewItem(data[0]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [projectId]);

  /* =======================
     FETCH ALL IMAGES (INCREMENTAL & SEQUENTIAL)
  ======================= */
  useEffect(() => {
    if (!projectId || favorites.length === 0) return;

    const fetchImagesSequentially = async () => {
      for (const item of favorites) {
        // Ưu tiên lấy ID theo thứ tự chính xác nhất của API
        const id = item.leaf_id || item.node_attribute_id || item.unit_id || item.unit_code;
        
        // Nếu đã có ảnh trong imageMap thì bỏ qua
        if (!id || imageMap[id]) continue;

        try {
          const res: HomeImage[] = await Getlisthome({
            project_id: projectId,
            leaf_id: item.leaf_id || item.node_attribute_id || item.unit_id,
            unit_code: (item.leaf_id || item.node_attribute_id || item.unit_id) ? undefined : item.unit_code,
          });

          const validImages = (res || [])
            .filter((img) => {
              const url = img.url || "";
              const fileName = img.file_name || "";
              const fileType = img.file_type || "";
              return (
                fileType.startsWith("image/") ||
                url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
                fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)
              );
            })
            .map((img) => img.url)
            .filter((url) => !!url && !url.includes("undefined"));

          // Cập nhật ngay lập tức cho từng căn để người dùng thấy ảnh hiện ra dần dần
          setImageMap((prev) => ({ ...prev, [id]: validImages }));
        } catch (err) {
          console.error("Lỗi lấy ảnh cho căn:", id, err);
          setImageMap((prev) => ({ ...prev, [id]: [] }));
        }
      }
    };

    fetchImagesSequentially();
  }, [projectId, favorites, imageMap]);

  /* =======================
     HELPERS
  ======================= */
  const getStatusColor = (status?: string) => {
    if (!status) return "#3d6985";
    const s = status.trim().toLowerCase();
    switch (s) {
      case "quan tâm":
        return "#b8893c";
      case "đang bán":
        return "#3d6985";
      case "đã đặt cọc":
        return "#cc5c34";
      case "đã bán":
        return "#b32f1f";
      default:
        return "#3d6985";
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.title}>
          Dự án {name}
        </div>
        <button className={styles.historyBtn}>
          Lịch sử đơn hàng
        </button>
      </div>

      <div className={styles.container}>
        {/* ================= LEFT ================= */}
        <div className={styles.left}>
          <div className={styles.sectionTitle}>
            Yêu thích ({favorites.length})
          </div>

          <div className={styles.cardList}>
            {loading ? (
              <div>Đang tải...</div>
            ) : favorites.length === 0 ? (
              <div>Không có dự án yêu thích</div>
            ) : (
              favorites.map((item) => {
                const isActive =
                  activeItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    className={`${styles.card} ${
                      isActive ? styles.active : ""
                    }`}
                    onClick={() => {
                      setActiveItem(item);
                      setPreviewItem(item);
                    }}
                  >
                    <Image
                      src={
                        imageMap[item.leaf_id || ""]?.[0] ||
                        imageMap[item.node_attribute_id || ""]?.[0] ||
                        imageMap[item.unit_id || ""]?.[0] ||
                        imageMap[item.unit_code]?.[0] ||
                        "/no-image.png"
                      }
                      alt={item.unit_code}
                      className={styles.cardImage}
                    />

                    <div className={styles.cardInfo}>
                      <div className={styles.cardTitle}>
                        {item.unit_code}
                      </div>
                      <div className={styles.price}>
                        {item.price}
                      </div>
                      <div className={styles.sub}>
                        {item.unit_name}
                      </div>

                      <div className={styles.meta}>
                        {/* <span className={styles.type1}>
                          <IconBed size={14} />{" "}
                          {item.bedrooms}
                        </span>
                        <span className={styles.type1}>
                          <IconBath size={14} />{" "}
                          {item.bathrooms}
                        </span> */}
                        <span 
                          className={styles.status}
                          style={{ backgroundColor: getStatusColor(item.status_unit) }}
                        >
                          {item.status_unit}
                        </span>
                      </div>
                    </div>

                    {/* DELETE */}
                    <div
                      className={styles.heart}
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (!item.favorite_id) return;

                        const ok =
                          window.confirm(
                            "Bạn có muốn loại bỏ yêu thích này không?"
                          );
                        if (!ok) return;

                        await deleteFavorites(
                          item.favorite_id
                        );

                        setFavorites((prev) => {
                          const next = prev.filter(
                            (f) =>
                              f.favorite_id !==
                              item.favorite_id
                          );

                          setActiveItem(next[0] || null);
                          setPreviewItem(next[0] || null);

                          return next;
                        });
                      }}
                    >
                      <IconHeartFilled
                        color="red"
                        size={20}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className={styles.right}>
          {previewItem ? (
            <>
              {/* GALLERY */}
              <div className={styles.gallery}>
                <Image
                  src={
                    imageMap[previewItem.leaf_id || ""]?.[0] ||
                    imageMap[previewItem.node_attribute_id || ""]?.[0] ||
                    imageMap[previewItem.unit_id || ""]?.[0] ||
                    imageMap[previewItem.unit_code]?.[0] ||
                    "/no-image.png"
                  }
                  alt={previewItem.unit_code}
                  className={styles.mainImage}
                  fit="cover"
                  radius={16}
                />

                <div className={styles.subImages}>
                  {(
                    imageMap[previewItem.leaf_id || ""] || 
                    imageMap[previewItem.node_attribute_id || ""] || 
                    imageMap[previewItem.unit_id || ""] || 
                    imageMap[previewItem.unit_code] || 
                    []
                  )
                    .slice(1)
                    .map((url, idx) => (
                      <Image
                        key={idx}
                        src={url || "/no-image.png"}
                        alt={`${previewItem.unit_code || "Căn hộ"} - ảnh phụ ${idx + 1}`}
                        fit="cover"
                        radius={12}
                        className={styles.subImageItem}
                      />
                    ))}
                </div>
              </div>

              {/* DETAIL */}
              <div className={styles.detail}>
                <div className={styles.topRow}>
                  <div>
                    <h2 className={styles.title}>
                      {previewItem.unit_code}
                    </h2>
                    <div className={styles.location}>
                      {previewItem.unit_name},{" "}
                      {previewItem.location}
                    </div>
                  </div>

                  <div className={styles.rightInfo}>
                    <span 
                      className={styles.badge}
                      style={{ backgroundColor: getStatusColor(previewItem.status_unit) }}
                    >
                      {previewItem.status_unit}
                    </span>
                    {/* <div className={styles.priceDetail}>
                      Giá niêm yết{" "}
                      <b>{previewItem.price}</b>
                    </div> */}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  {/* <span className={styles.type}>
                    <IconBed size={14} />{" "}
                    {previewItem.bedrooms}
                  </span>
                  <span className={styles.type}>
                    <IconBath size={14} />{" "}
                    {previewItem.bathrooms}
                  </span> */}
                  <span className={styles.type}>
                    {previewItem.building_type}
                  </span>
                </div>

                <div className={styles.desc}>
                  {previewItem.describe_vi ||
                    "Chưa có mô tả cho dự án này."}
                </div>

                <div className={styles.actions}>
                  <button className={styles.contact}>
                    Liên hệ
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>Chưa có dữ liệu</div>
          )}
        </div>
      </div>
    </div>
  );
}
