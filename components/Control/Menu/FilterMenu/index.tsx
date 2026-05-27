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
  const [direction, setDirection] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [phanKhuOptions, setPhanKhuOptions] = useState<string[]>([]);
  const [resultOpened, setResultOpened] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<string[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [floorOptions, setFloorOptions] = useState<string[]>([]);
  const [selectedFloors, setSelectedFloors] = useState<string[]>([]);
  const [tenCanOptions, setTenCanOptions] = useState<string[]>([]);
  const [selectedTenCan, setSelectedTenCan] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [customSearchQuery, setCustomSearchQuery] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Results states
  const [searchResults, setSearchResults] = useState<NodeAttributeItem[]>([]);
  const [originalData, setOriginalData] = useState<NodeAttributeItem[]>([]);

  // Fetch data from API on mount
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
          setOriginalData(data.data);

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

  // Update search value display when filters change
  useEffect(() => {
    const activeFilters: string[] = [];

    if (activePhanKhu) activeFilters.push(activePhanKhu);
    if (selectedStatus.length > 0) activeFilters.push(...selectedStatus);
    if (selectedBedrooms.length > 0) activeFilters.push(...selectedBedrooms);
    if (selectedFloors.length > 0) activeFilters.push(...selectedFloors);
    if (selectedTenCan.length > 0) activeFilters.push(...selectedTenCan);
    if (direction) activeFilters.push(direction);

    setSearchValue(activeFilters.join(', '));
    setCustomSearchQuery('');
  }, [activePhanKhu, selectedStatus, selectedBedrooms, selectedFloors, selectedTenCan, direction]);

  // Helper to compute filtered data based on current selections, optionally excluding a specific field
  const getFilteredData = (excludeField?: string, customQueryOverride?: string) => {
    const filters: { label: string; values: string[] }[] = [];
    if (activePhanKhu && excludeField !== 'layer2') filters.push({ label: 'layer2', values: [activePhanKhu] });
    if (selectedStatus.length && excludeField !== 'status_unit') filters.push({ label: 'status_unit', values: selectedStatus });
    if (selectedBedrooms.length && excludeField !== 'building_type') filters.push({ label: 'building_type', values: selectedBedrooms });
    if (selectedTenCan.length && excludeField !== 'layer3') filters.push({ label: 'layer3', values: selectedTenCan });
    if (selectedFloors.length && excludeField !== 'num_floor') filters.push({ label: 'num_floor', values: selectedFloors });
    if (direction && excludeField !== 'feature_2') filters.push({ label: 'feature_2', values: [direction] });

    const queryToUse = customQueryOverride !== undefined ? customQueryOverride : customSearchQuery;

    return originalData.filter(item => {
      const matchChips = filters.every(f => {
        const fieldVal = item[f.label as keyof NodeAttributeItem];
        if (fieldVal === undefined || fieldVal === null || fieldVal === '') return false;
        const values = String(fieldVal).split(';').map((v: string) => v.trim()).filter(Boolean);
        return f.values.some(v => values.includes(v));
      });

      if (!matchChips) return false;

      if (queryToUse.trim()) {
        let q = queryToUse.toLowerCase().trim();
        let floorRequired = false;
        let floorNum = "";

        // Regex support "tầng X" or "X tầng"
        const floorRegex1 = /tầng\s*(\d+)/i;
        const floorRegex2 = /(\d+)\s*tầng/i;

        const m1 = q.match(floorRegex1);
        const m2 = q.match(floorRegex2);

        if (m1) {
          floorRequired = true;
          floorNum = m1[1];
          q = q.replace(floorRegex1, "").trim();
        } else if (m2) {
          floorRequired = true;
          floorNum = m2[1];
          q = q.replace(floorRegex2, "").trim();
        }

        if (floorRequired) {
          // Compare exactly with num_floor
          const itemFloor = item.num_floor != null ? String(item.num_floor).trim() : "";
          if (itemFloor !== floorNum) {
            return false;
          }
          if (!q) {
            return true;
          }
        }

        const matchesQuery =
          (item.unit_code && item.unit_code.toLowerCase().includes(q)) ||
          (item.layer2 && item.layer2.toLowerCase().includes(q)) ||
          (item.layer3 && item.layer3.toLowerCase().includes(q)) ||
          (item.building_type && item.building_type.toLowerCase().includes(q)) ||
          (item.feature_2 && item.feature_2.toLowerCase().includes(q));

        return !!matchesQuery;
      }

      return true;
    });
  };

  // Get unique unit codes or names matching custom search query as suggestions
  const getSuggestions = () => {
    if (!customSearchQuery.trim()) return [];
    const q = customSearchQuery.toLowerCase().trim();
    const matches: string[] = [];

    originalData.forEach(item => {
      if (item.unit_code && item.unit_code.toLowerCase().includes(q)) {
        matches.push(item.unit_code);
      }
      if (item.layer3 && item.layer3.toLowerCase().includes(q)) {
        matches.push(item.layer3);
      }
    });

    return Array.from(new Set(matches)).slice(0, 8);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchValue(suggestion);
    setCustomSearchQuery(suggestion);
    setShowSuggestions(false);

    if (!project_id) return;
    const filteredResults = getFilteredData(undefined, suggestion);
    setSearchResults(filteredResults);
    setResultOpened(true);
  };

  // Check if a filter option is available based on other selected filters
  const isOptionAvailable = (field: string, value: string) => {
    // If there is no data yet, treat everything as available
    if (!originalData.length) return true;
    // If no filters have been selected yet, show all options as available (bright)
    const anyFilterSelected = selectedStatus.length > 0 || selectedBedrooms.length > 0 || selectedFloors.length > 0 || activePhanKhu !== '' || direction !== '' || selectedTenCan.length > 0;
    if (!anyFilterSelected) return true;

    const filtered = getFilteredData(field);
    return filtered.some(item => {
      const fieldVal = item[field as keyof NodeAttributeItem];
      if (fieldVal === undefined || fieldVal === null || fieldVal === '') return false;
      const values = String(fieldVal).split(';').map((v: string) => v.trim()).filter(Boolean);
      return values.includes(value);
    });
  };

  // Search: compute filtered results from originalData
  const handleSearch = () => {
    if (!project_id) return;

    const filteredResults = getFilteredData();
    setSearchResults(filteredResults);
    setResultOpened(true);
  };

  // Reset all filters to initial state
  const handleReset = () => {
    setActivePhanKhu('');
    setSelectedStatus([]);
    setSelectedBedrooms([]);
    setSelectedFloors([]);
    setSelectedTenCan([]);
    setDirection('');
    setSearchValue('');
    setCustomSearchQuery('');
    setResultOpened(false);
    setSearchResults([]);
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
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCustomSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
                setShowSuggestions(false);
              }
            }}
          />
          {showSuggestions && customSearchQuery.trim() && (
            <div className={styles.suggestionsDropdown}>
              {getSuggestions().length > 0 ? (
                getSuggestions().map((suggestion) => (
                  <div
                    key={suggestion}
                    className={styles.suggestionItem}
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))
              ) : (
                <div className={styles.noSuggestions}>Không tìm thấy gợi ý</div>
              )}
            </div>
          )}
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
                  style={{
                    opacity: isOptionAvailable('layer2', pk) ? 1 : 0.5,
                    cursor: isOptionAvailable('layer2', pk) ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => {
                     const isSelected = activePhanKhu === pk;
                     if (!isOptionAvailable('layer2', pk) && !isSelected) return;
                     setActivePhanKhu(isSelected ? '' : pk);
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
                    style={{
                      opacity: isOptionAvailable('building_type', bedroom) ? 1 : 0.5,
                      cursor: isOptionAvailable('building_type', bedroom) ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                       const isSelected = selectedBedrooms.includes(bedroom);
                       if (!isOptionAvailable('building_type', bedroom) && !isSelected) return;
                       setSelectedBedrooms(isSelected ? [] : [bedroom]);
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
                    style={{
                      opacity: isOptionAvailable('layer3', name) ? 1 : 0.5,
                      cursor: isOptionAvailable('layer3', name) ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                       const isSelected = selectedTenCan.includes(name);
                       if (!isOptionAvailable('layer3', name) && !isSelected) return;
                       setSelectedTenCan(isSelected ? [] : [name]);
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
                    style={{
                      opacity: isOptionAvailable('num_floor', String(floor)) ? 1 : 0.5,
                      cursor: isOptionAvailable('num_floor', String(floor)) ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                      const isSelected = selectedFloors.includes(floor);
                      if (!isOptionAvailable('num_floor', String(floor)) && !isSelected) return;
                      setSelectedFloors(isSelected ? [] : [floor]);
                    }}
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
                      opacity: isOptionAvailable('status_unit', status) ? 1 : 0.5,
                      cursor: isOptionAvailable('status_unit', status) ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                      const isSelected = selectedStatus.includes(status);
                      if (!isOptionAvailable('status_unit', status) && !isSelected) return;
                      setSelectedStatus(isSelected ? [] : [status]);
                    }}
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
                dir === '' ? (
                  <div key={idx} className={styles.diamondCell} style={{ border: 'none', background: 'transparent' }} />
                ) : (
                  <div
                    key={dir}
                    className={`${styles.diamondCell} ${direction === dir ? styles.active : ''}`}
                    style={{
                      opacity: isOptionAvailable('feature_2', dir) ? 1 : 0.5,
                      cursor: isOptionAvailable('feature_2', dir) ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                       const isSelected = direction === dir;
                       if (!isOptionAvailable('feature_2', dir) && !isSelected) return;
                       setDirection(isSelected ? '' : dir);
                     }}
                  >
                    <span>{dir}</span>
                  </div>
                )
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
