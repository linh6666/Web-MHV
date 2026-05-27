import React, { useState, useEffect } from 'react';
import styles from './FilterMenu.module.css';
import { IconSearch, IconX, IconLoader2 } from '@tabler/icons-react';
import { Text as MantineText, } from '@mantine/core';
import { createNodeAttribute } from "../../../../api/apifilter4";
import { NotificationExtension } from "../../../../extension/NotificationExtension";
import SearchResultModal from './SearchResultModal';

interface FilterMenuProps {
  onClose: () => void;
  project_id: string | null;
}

interface NodeAttributeItem {
  building_type?: string;
  layer4?: string;
  leaf_id?: string;
  layer2?: string;
  layer3?: string;
  zone?: string;
  status_unit?: string;
  id?: number | string;
  unit_code?: string;
  direction?: string;
  feature_2?: string;
  bedroom?: string | number;
  bathroom?: string | number;
  num_floor?: string | number;
}

interface ApiResponse {
  data?: NodeAttributeItem[];
  message?: string;
}

const FIXED_STATUS_OPTIONS = ['ĐÃ BÁN', 'ĐÃ ĐẶT CỌC', 'ĐANG BÁN', 'QUAN TÂM'];

export default function FilterMenu({ onClose, project_id }: FilterMenuProps) {
  // State for filters
  const [activePhanKhu, setActivePhanKhu] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [direction, setDirection] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [phanKhuOptions, setPhanKhuOptions] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<string[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [floorOptions, setFloorOptions] = useState<string[]>([]);
  const [selectedFloors, setSelectedFloors] = useState<string[]>([]);
  const [tenCanOptions, setTenCanOptions] = useState<string[]>([]);
  const [selectedTenCan, setSelectedTenCan] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  // Results states
  const [searchResults, setSearchResults] = useState<NodeAttributeItem[]>([]);
  const [resultOpened, setResultOpened] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      if (!project_id) return;

      setLoading(true);
      try {
        const body = {
          project_id,
          filters: [
            { label: "layer1", values: ["ct"] },
          ],
        };

        const data: ApiResponse = await createNodeAttribute(body);

        // ✅ Kiểm tra nếu API có message
        if (data?.message) {
          NotificationExtension.Success(data.message);
        }

        if (data?.data && Array.isArray(data.data)) {

          const allPhases: string[] = data.data.flatMap(
            (item: NodeAttributeItem) =>
              String(item.layer2 || "")
                .split(";")
                .map((z) => z.trim())
                .filter(Boolean)
          );




          const allBedrooms: string[] = data.data.flatMap(
            (item: NodeAttributeItem) =>
              String(item.building_type || "")
                .split(";")
                .map((z) => z.trim())
                .filter(Boolean)
          );

          const allTenCan: string[] = data.data.flatMap(
            (item: NodeAttributeItem) =>
              String(item.layer3 || "")
                .split(";")
                .map((z) => z.trim())
                .filter(Boolean)
          );

          const allFloors: string[] = data.data.flatMap(
            (item: NodeAttributeItem) =>
              String(item.num_floor || "")
                .split(";")
                .map((z) => z.trim())
                .filter(Boolean)
          );

          const filteredPhases = allPhases.filter((phase) => phase.toLowerCase() !== "skip");
          const filteredBedrooms = allBedrooms.filter((bedroom) => bedroom.toLowerCase() !== "skip");
          const filteredTenCan = allTenCan.filter((ten) => ten.toLowerCase() !== "skip");
          const filteredFloors = allFloors.filter((floor) => floor.toLowerCase() !== "skip");

          const uniquePhases = Array.from(new Set(filteredPhases)).sort((a, b) => a.localeCompare(b, "vi"));
          const uniqueBedrooms = Array.from(new Set(filteredBedrooms)).sort((a, b) => a.localeCompare(b, "vi"));
          const uniqueTenCan = Array.from(new Set(filteredTenCan)).sort((a, b) => a.localeCompare(b, "vi"));
          const uniqueFloors = Array.from(new Set(filteredFloors)).sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b, "vi");
          });

          setPhanKhuOptions(uniquePhases);
          setBedroomOptions(uniqueBedrooms);
          setTenCanOptions(uniqueTenCan);
          setFloorOptions(uniqueFloors);
        } else {
          console.warn("⚠️ Dữ liệu trả về không đúng định dạng:", data);
          NotificationExtension.Fails("Dữ liệu trả về không hợp lệ từ API!");
        }
      } catch (error: unknown) {
        console.error("❌ Lỗi khi gọi API:", error);


        let apiMessage = "Gọi API thất bại!";
        if (error && typeof error === "object") {
          const errObj = error as {
            response?: { data?: { detail?: string; message?: string } };
            message?: string;
          };
          apiMessage =
            errObj.response?.data?.detail ||
            errObj.response?.data?.message ||
            errObj.message ||
            apiMessage;
        }

        NotificationExtension.Fails(apiMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [project_id]);


  useEffect(() => {
    const activeFilters: string[] = [];

    if (activePhanKhu) activeFilters.push(activePhanKhu);
    if (selectedTypes.length > 0) activeFilters.push(...selectedTypes);
    if (selectedStatus.length > 0) activeFilters.push(...selectedStatus);
    if (selectedBedrooms.length > 0) activeFilters.push(...selectedBedrooms);
    if (selectedFloors.length > 0) activeFilters.push(...selectedFloors);
    if (selectedTenCan.length > 0) activeFilters.push(...selectedTenCan);
    if (direction) activeFilters.push(direction);

    setSearchValue(activeFilters.join(', '));
  }, [activePhanKhu, selectedTypes, selectedStatus, selectedBedrooms, selectedFloors, selectedTenCan, direction]);

  const handleSearch = async () => {
    if (!project_id) return;

    setResultOpened(true);

    try {
      const filters = [
        { label: "layer1", values: ["ct"] },
      ];

      if (activePhanKhu) filters.push({ label: "layer2", values: [activePhanKhu] });
      if (selectedTypes.length > 0) filters.push({ label: "building_type", values: selectedTypes });
      if (selectedStatus.length > 0) filters.push({ label: "status_unit", values: selectedStatus });
      if (selectedBedrooms.length > 0) filters.push({ label: "building_type", values: selectedBedrooms });
      if (selectedTenCan.length > 0) filters.push({ label: "layer3", values: selectedTenCan });
      if (selectedFloors.length > 0) filters.push({ label: "num_floor", values: selectedFloors });
      if (direction) {
        console.log('🧭 Direction:', direction);

        filters.push({
          label: "feature_2",
          values: [direction],
        });
      }

      const body = {
        project_id,
        filters: filters
      };

      const data = await createNodeAttribute(body);

      if (data?.data && Array.isArray(data.data)) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("❌ Search error:", error);
      NotificationExtension.Fails("Tìm kiếm thất bại!");
      setSearchResults([]);
    }
  };

  const handleReset = () => {
    setActivePhanKhu('');
    setSelectedTypes([]);
    setSelectedStatus([]);
    setSelectedBedrooms([]);
    setSelectedTenCan([]);
    setDirection('');
    setSelectedFloors([]);
    setSearchValue('');
    setSearchResults([]);
    setResultOpened(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.searchInputWrapper}>
          <IconSearch size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className={styles.searchInput}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <IconX size={18} />
        </button>
      </div>

      <div className={styles.filterScroll}>
        {/* Phân khu */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Dự án</div>
          <div className={styles.chipGroup}>
            {loading ? (
              <div className={styles.loadingWrapper}>
                <IconLoader2 size={18} className={styles.spinner} />
                <span>Đang tải...</span>
              </div>
            ) : phanKhuOptions.length > 0 ? (
              phanKhuOptions.map(pk => (
                <div
                  key={pk}
                  className={`${styles.chip} ${activePhanKhu === pk ? styles.active : ''}`}
                  onClick={() => {
                    setActivePhanKhu(activePhanKhu === pk ? '' : pk);
                    setSelectedBedrooms([]);
                  }}
                >
                  {pk}
                </div>
              ))
            ) : (
              <div className={styles.emptyText}>Không có dữ liệu phân khu</div>
            )}
          </div>
        </div>

        <div className={styles.quantityGroup}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Loại công trình</div>
            <div className={styles.chipGroup}>
              {loading ? (
                <MantineText size="xs" c="dimmed">Đang tải loại công trình...</MantineText>
              ) : bedroomOptions.length > 0 ? (
                bedroomOptions.map(bedroom => (
                  <div
                    key={bedroom}
                    className={`${styles.chip} ${selectedBedrooms.includes(bedroom) ? styles.active : ''}`}
                    onClick={() => {
                      setSelectedBedrooms(prev => prev.includes(bedroom) ? [] : [bedroom]);
                      setActivePhanKhu('');
                    }}
                  >
                    {bedroom}
                  </div>
                ))
              ) : (
                <MantineText size="xs" c="dimmed">Không có dữ liệu phòng ngủ</MantineText>
              )}
            </div>
          </div>

          {/* Tên căn */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Tên công trình</div>
            <div className={styles.chipGroup}>
              {loading ? (
                <MantineText size="xs" c="dimmed">Đang tải tên căn...</MantineText>
              ) : tenCanOptions.length > 0 ? (
                tenCanOptions.map(name => (
                  <div
                    key={name}
                    className={`${styles.chip} ${selectedTenCan.includes(name) ? styles.active : ''}`}
                    onClick={() => {
                      setSelectedTenCan(prev => prev.includes(name) ? [] : [name]);
                      setActivePhanKhu('');
                    }}
                  >
                    {name}
                  </div>
                ))
              ) : (
                <MantineText size="xs" c="dimmed">Không có dữ liệu tên căn</MantineText>
              )}
            </div>
          </div>
        </div>

        <div className={styles.quantityGroup}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Số Tầng</div>
            <div className={styles.chipGroup}>
              {loading ? (
                <MantineText size="xs" c="dimmed">Đang tải số tầng...</MantineText>
              ) : floorOptions.length > 0 ? (
                floorOptions.map(floor => (
                  <div
                    key={floor}
                    className={`${styles.chip} ${selectedFloors.includes(floor) ? styles.active : ''}`}
                    onClick={() => setSelectedFloors(prev => prev.includes(floor) ? [] : [floor])}
                  >
                    {floor}
                  </div>
                ))
              ) : (
                <MantineText size="xs" c="dimmed">Không có dữ liệu số tầng</MantineText>
              )}
            </div>
          </div>
        </div>

        <div className={styles.gridSection}>
          {/* Numbers Sections */}
          <div className={styles.quantityGroup}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Trạng Thái</div>
              <div className={styles.chipGroup}>
                {FIXED_STATUS_OPTIONS.map(status => (
                  <div
                    key={status}
                    className={`${styles.chip} ${selectedStatus.includes(status) ? styles.active : ''}`}
                    style={{
                      backgroundColor: (() => {
                        switch (status) {
                          case "QUAN TÂM":
                            return "#b8893c";
                          case "ĐANG BÁN":
                            return "#3d6985";
                          case "ĐÃ ĐẶT CỌC":
                            return "#cc5c34";
                          case "ĐÃ BÁN":
                            return "#b32f1f";
                          default:
                            return "gray";
                        }
                      })(),
                      color: "white",
                    }}
                    onClick={() => setSelectedStatus(prev => prev.includes(status) ? [] : [status])}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compass */}
          <div className={styles.compassSection}>
            <div className={styles.sectionTitle}>Hướng</div>
            <div className={styles.diamondGrid}>
              {['B', 'ĐB', 'Đ', 'TB', '', 'ĐN', 'T', 'TN', 'N'].map((dir, idx) => (
                // Middle cell is empty or decorative
                dir === '' ? <div key={idx} className={styles.diamondCell} style={{ border: 'none', background: 'transparent' }} /> :
                  <div
                    key={dir}
                    className={`${styles.diamondCell} ${direction === dir ? styles.active : ''}`}
                    onClick={() => setDirection(direction === dir ? '' : dir)}
                  >
                    <span>{dir}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* Footer */}
      <div className={styles.footer}>
        <button className={`${styles.actionBtn} ${styles.btnReset}`} onClick={handleReset}>Làm mới</button>
        <button className={`${styles.actionBtn} ${styles.btnSearch}`} onClick={handleSearch}>Tìm kiếm</button>
      </div>

      <SearchResultModal
        opened={resultOpened}
        onClose={() => setResultOpened(false)}
        results={searchResults}
        projectId={project_id}
      />
    </div>
  );
}
