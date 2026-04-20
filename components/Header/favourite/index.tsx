"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProjectList.module.css";
import { getListProject } from "../../../api/apigetlistProjectBasic";

interface Project {
  id: string;
  name: string;
  address?: string | null;
  overview_image?: {
    url: string;
  } | null;
  url?: string | null;
  investor?: string | null;
  project_template_id?: string;
  rank?: number;
  template?: string | null;
  timeout_minutes?: number;
  rank_name?: string | null;
  type?: string | null;
  link?: string;
}


export default function ProjectList() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [fetched, setFetched] = useState(false); // phân biệt chưa fetch và rỗng

  const fetchProjects = useCallback(async () => {
    try {
      const res = await getListProject({
        token: "",
        skip: 0,
        limit: 100,
      });

      if (res && res.data) {
        setProjects(res.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách project:", error);
    } finally {
      setFetched(true);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  /**
   * Điều hướng sang trang chi tiết
   * Truyền id + name qua query params
   */
  const handleNavigate = (id: string, name: string) => {
    router.push(
      `/chi-tiet-yeu-thich?id=${id}&name=${encodeURIComponent(name)}`
    );
  };

  return (
    <div className={styles.wrapper}>
      {projects.length > 0 ? (
        projects.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imagePlaceholder}>
              {item.url || item.overview_image?.url ? (
                <img
                  src={item.url || item.overview_image?.url || ""}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-project.png";
                  }}
                />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
            </div>


            <div className={styles.content}>
              <div className={styles.text}>
                <h3 className={styles.title}>{item.name}</h3>

                {item.address && (
                  <p className={styles.address}>
                    <strong>Địa chỉ:</strong> {item.address}
                  </p>
                )}

                <div className={styles.buttonWrapper}>
                  <button
                    className={styles.button}
                    onClick={() =>
                      handleNavigate(item.id, item.name)
                    }
                  >
                    Truy cập
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : fetched ? (
        <div className={styles.empty}>
          <p>Không có dữ liệu dự án nào để hiển thị.</p>
        </div>
      ) : null}
    </div>
  );
}
