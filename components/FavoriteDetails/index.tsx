"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./FavoriteDetails.module.css";
import {
  IconBath,
  IconBed,
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
  price: string;
  building_type: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  desc?: string;
  favorite_id: string;
}

interface HomeImage {
  url: string;
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

  // map unit_code -> danh sách ảnh
  const [imageMap, setImageMap] = useState<
    Record<string, string[]>
  >({});

  // chặn fetch ảnh nhiều lần
  const fetchedImagesRef = useRef(false);

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

        // reset để fetch ảnh lại khi project đổi
        fetchedImagesRef.current = false;
      } catch (error) {
        console.error("Lỗi khi lấy favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [projectId]);

  /* =======================
     FETCH IMAGES (LOGIC FIX)
  ======================= */
  useEffect(() => {
    if (
      !projectId ||
      favorites.length === 0 ||
      fetchedImagesRef.current
    )
      return;

    fetchedImagesRef.current = true;

    const fetchImages = async () => {
      const map: Record<string, string[]> = {};

      // ❗ không Promise.all → tránh race condition
      for (const item of favorites) {
        try {
          const res: HomeImage[] = await Getlisthome({
            project_id: projectId,
            unit_code: item.unit_code,
          });

          map[item.unit_code] =
            res?.map((img) => img.url) || [];
        } catch (error) {
          console.error(
            "Lỗi lấy ảnh:",
            item.unit_code,
            error
          );
          map[item.unit_code] = [];
        }
      }

      setImageMap(map);
    };

    fetchImages();
  }, [projectId, favorites]);

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
                    {/* IMAGE LEFT */}
                    <Image
                      src={
                        imageMap[item.unit_code]?.[0] ||
                        "/no-image.png"
                      }
                      alt={item.unit_code}
                      width={120}
                      height={1}
                      style={{
                        width: 120,
                        height: "auto",
                        borderRadius: 12,
                        objectFit: "contain",
                        flexShrink: 0,
                      }}
                    />

                    <div className={styles.cardInfo}>
                      <div className={styles.cardTitle}>
                        {item.unit_code}
                      </div>
                      <div className={styles.price}>
                        {item.price}
                      </div>
                      <div className={styles.sub}>
                        {item.building_type}
                      </div>

                      <div className={styles.meta}>
                        <span className={styles.type1}>
                          <IconBed size={14} />{" "}
                          {item.bedrooms}
                        </span>
                        <span className={styles.type1}>
                          <IconBath size={14} />{" "}
                          {item.bathrooms}
                        </span>
                        <span className={styles.status}>
                          {item.status}
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
                    imageMap[previewItem.unit_code]?.[0] ||
                    "/no-image.png"
                  }
                  alt={previewItem.unit_code}
                  className={styles.mainImage}
                  fit="cover"
                  radius={16}
                />

                <div className={styles.subImages}>
                  <Image
                    src={
                      imageMap[
                        previewItem.unit_code
                      ]?.[1] || "/no-image.png"
                    }
                    alt={`${previewItem.unit_code} - ảnh phụ 1`}
                    fit="cover"
                    radius={12}
                    width={300}
                    height={50}
                  />

                  <Image
                    src={
                      imageMap[
                        previewItem.unit_code
                      ]?.[2] || "/no-image.png"
                    }
                    alt={`${previewItem.unit_code} - ảnh phụ 2`}
                    fit="cover"
                    radius={12}
                    width={120}
                    height={90}
                  />
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
                      {previewItem.building_type},{" "}
                      {previewItem.location}
                    </div>
                  </div>

                  <div className={styles.rightInfo}>
                    <span className={styles.badge}>
                      {previewItem.status}
                    </span>
                    <div className={styles.priceDetail}>
                      Giá niêm yết{" "}
                      <b>{previewItem.price}</b>
                    </div>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.type}>
                    <IconBed size={14} />{" "}
                    {previewItem.bedrooms}
                  </span>
                  <span className={styles.type}>
                    <IconBath size={14} />{" "}
                    {previewItem.bathrooms}
                  </span>
                  <span className={styles.type}>
                    {previewItem.building_type}
                  </span>
                </div>

                <div className={styles.desc}>
                  {previewItem.desc ||
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
