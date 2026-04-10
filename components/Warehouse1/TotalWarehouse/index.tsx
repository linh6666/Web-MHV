"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Group,
  Card,
  Text,
  SimpleGrid,
  Loader,
  ActionIcon,
  Autocomplete,
  Divider,
} from "@mantine/core";
import { createWarehouse } from "../../../api/apiFilterWarehouse";
import styles from "./TotalWarehouse.module.css";
import WarehouseDetail from "../WarehouseDetail";
import { IconFilter2, IconSearch, IconX } from "@tabler/icons-react";
import { Pagination } from "antd";
import FilterSidebar from "./FilterSidebar";

interface TotalWarehouseProps {
  projectId: string;
  target?: string;
}

export interface WarehouseItem {
  id: string;
  unit_code: string;
  layer6: string;
  describe: string;
  layer2: string;
  view: string;
  layer3: string;
  color: string;
  zone: string;
  status_unit: string;
  building_type: string;
  describe_vi: string;
  main_door_direction: string;
  balcony_direction: string;
  bedroom: string | number;
  bathroom: string | number;
  direction: string;
  price: number;
  feature_1: string;
  feature_2: string;
  feature_3: string;
  feature_4: string;
  apartment_type: string;
  apartment_model_code: string;
  apartment_num: string;
  floor_name: string;
  floor_group_code: string;
  floor_apartment_group_code: string;
}

export default function TotalWarehouse({ projectId, target }: TotalWarehouseProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectName = searchParams.get("name") || "";

  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [searchText, setSearchText] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<{ value: string }[]>([]);
  const [filteredItems, setFilteredItems] = useState<WarehouseItem[]>([]);
  const [selectedBuildingTypes, setSelectedBuildingTypes] = useState<string[]>([]);
  const [selectedMainDoorDirections, setSelectedMainDoorDirections] = useState<string[]>([]);
  const [selectedBalconyDirections, setSelectedBalconyDirections] = useState<string[]>([]);
  const [selectedDirections, setSelectedDirections] = useState<string[]>([]);
  const [selectedFeature1, setSelectedFeature1] = useState<string[]>([]);
  const [selectedFeature2, setSelectedFeature2] = useState<string[]>([]);
  const [selectedFeature3, setSelectedFeature3] = useState<string[]>([]);
  const [selectedFeature4, setSelectedFeature4] = useState<string[]>([]);
  const [selectedApartmentType, setSelectedApartmentType] = useState<string[]>([]);
  const [selectedApartmentModelCode, setSelectedApartmentModelCode] = useState<string[]>([]);
  const [selectedApartmentNum, setSelectedApartmentNum] = useState<string[]>([]);
  const [selectedFloorName, setSelectedFloorName] = useState<string[]>([]);
  const [selectedFloorGroupCode, setSelectedFloorGroupCode] = useState<string[]>([]);
  const [selectedFloorApartmentGroupCode, setSelectedFloorApartmentGroupCode] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [activeBedroom, setActiveBedroom] = useState<string | null>(null);
  const [activeBathroom, setActiveBathroom] = useState<string | null>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);


  const normalize = (value?: string) => value?.trim().toLowerCase();

  const suggestionMeta = useMemo(() => {
    const map = new Map<
      string,
      {
        zone?: string;
        building_type?: string;
        bedroom?: number | string;
        bathroom?: number | string;
        direction?: string;
        main_door_direction?: string;
        balcony_direction?: string;
        status_unit?: string;
      }
    >();
    for (const i of items) {
      map.set(i.unit_code, {
        zone: i.zone,
        building_type: i.building_type,
        bedroom: i.bedroom,
        bathroom: i.bathroom,
        direction: i.direction,
        main_door_direction: i.main_door_direction,
        balcony_direction: i.balcony_direction,
        status_unit: i.status_unit,
      });
    }
    return map;
  }, [items]);

 useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);

      const body = {
        project_id: projectId,
        filters: [{ label: "type_info", values: ["bh"] }],
      };

      const res = await createWarehouse(projectId as string, body);
      const warehouseList: WarehouseItem[] = Array.isArray(res) ? res : res.data || [];

      // Lọc dữ liệu: loại bỏ skip và lọc theo target nếu có
      const finalList = warehouseList.filter((item) => {
        // Loại bỏ các item có status_unit = "skip"
        if (item.status_unit?.trim().toLowerCase() === "skip") return false;

        // Nếu có target, chỉ giữ các item mà zone khớp target
        if (target && item.zone) {
          return normalize(item.zone) === normalize(target);
        }

        // Nếu không có target, giữ tất cả (trừ skip)
        return !target;
      });

      setItems(finalList);
      setFilteredItems(finalList);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch warehouse data:", error);
      setItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [projectId, target]);


useEffect(() => {
  let filtered = items;

  // Filter theo trạng thái
  if (selectedStatuses.length > 0) {
    filtered = filtered.filter((item) => item && selectedStatuses.includes(item.status_unit));
  }

  // Filter theo phòng ngủ
  if (activeBedroom) {
    filtered = filtered.filter((item) => item && String(item.bedroom) === activeBedroom);
  }

  // Filter theo phòng tắm
  if (activeBathroom) {
    filtered = filtered.filter((item) => item && String(item.bathroom) === activeBathroom);
  }

  // Filter theo phân khu
  if (selectedZones.length > 0) {
    filtered = filtered.filter((item) => item && selectedZones.includes(item.zone));
  }

  // Filter theo loại building
  if (selectedBuildingTypes.length > 0) {
    filtered = filtered.filter(
      (item) =>
        item && selectedBuildingTypes.includes(item.building_type)
    );
  }
  // Filter theo hướng 
   if (selectedDirections.length > 0) {
    filtered = filtered.filter(
      (item) =>
        item && selectedDirections.includes(item.direction)
    );
  }

  // Filter theo hướng cửa chính
  if (selectedMainDoorDirections.length > 0) {
    filtered = filtered.filter(
      (item) =>
        item && selectedMainDoorDirections.includes(item.main_door_direction)
    );
  }

  // Filter theo hướng ban công
  if (selectedBalconyDirections.length > 0) {
    filtered = filtered.filter(
      (item) =>
        item && selectedBalconyDirections.includes(item.balcony_direction)
    );
  }

  // Filter theo các feature
  if (selectedFeature1.length > 0) {
    filtered = filtered.filter((item) => item && selectedFeature1.includes(item.feature_1));
  }
  if (selectedFeature2.length > 0) {
    filtered = filtered.filter((item) => item && selectedFeature2.includes(item.feature_2));
  }
  if (selectedFeature3.length > 0) {
    filtered = filtered.filter((item) => item && selectedFeature3.includes(item.feature_3));
  }
  if (selectedFeature4.length > 0) {
    filtered = filtered.filter((item) => item && selectedFeature4.includes(item.feature_4));
  }

  // Filter theo các trường mới
  if (selectedApartmentType.length > 0) {
    filtered = filtered.filter((item) => item && selectedApartmentType.includes(item.apartment_type));
  }
  if (selectedApartmentModelCode.length > 0) {
    filtered = filtered.filter((item) => item && selectedApartmentModelCode.includes(item.apartment_model_code));
  }
  if (selectedApartmentNum.length > 0) {
    filtered = filtered.filter((item) => item && selectedApartmentNum.includes(item.apartment_num));
  }
  if (selectedFloorName.length > 0) {
    filtered = filtered.filter((item) => item && selectedFloorName.includes(item.floor_name));
  }
  if (selectedFloorGroupCode.length > 0) {
    filtered = filtered.filter((item) => item && selectedFloorGroupCode.includes(item.floor_group_code));
  }
  if (selectedFloorApartmentGroupCode.length > 0) {
    filtered = filtered.filter((item) => item && selectedFloorApartmentGroupCode.includes(item.floor_apartment_group_code));
  }

  setFilteredItems(filtered);
  setCurrentPage(1);
}, [
  items,
  selectedStatuses,
  activeBedroom,
  activeBathroom,
  selectedZones,
  selectedBuildingTypes,
  selectedMainDoorDirections,
  selectedBalconyDirections,
  selectedDirections,
  selectedFeature1,
  selectedFeature2,
  selectedFeature3,
  selectedFeature4,
  selectedApartmentType,
  selectedApartmentModelCode,
  selectedApartmentNum,
  selectedFloorName,
  selectedFloorGroupCode,
  selectedFloorApartmentGroupCode,
]);

  const allActiveFilters = useMemo(() => {
    const filters: { label: string; type: string; value: string }[] = [];

    selectedZones.forEach((v) => filters.push({ label: v, type: "zone", value: v }));
    selectedBuildingTypes.forEach((v) => filters.push({ label: v, type: "buildingType", value: v }));
    selectedDirections.forEach((v) => filters.push({ label: `Hướng ${v}`, type: "direction", value: v }));
    selectedMainDoorDirections.forEach((v) => filters.push({ label: `Hướng cửa ${v}`, type: "mainDoor", value: v }));
    selectedBalconyDirections.forEach((v) => filters.push({ label: `Hướng ban công ${v}`, type: "balcony", value: v }));
    selectedFeature1.forEach((v) => filters.push({ label: v, type: "feature1", value: v }));
    selectedFeature2.forEach((v) => filters.push({ label: v, type: "feature2", value: v }));
    selectedFeature3.forEach((v) => filters.push({ label: v, type: "feature3", value: v }));
    selectedFeature4.forEach((v) => filters.push({ label: v, type: "feature4", value: v }));
    selectedApartmentType.forEach((v) => filters.push({ label: v, type: "apartmentType", value: v }));
    selectedApartmentModelCode.forEach((v) =>
      filters.push({ label: v, type: "apartmentModelCode", value: v })
    );
    selectedApartmentNum.forEach((v) => filters.push({ label: v, type: "apartmentNum", value: v }));
    selectedFloorName.forEach((v) => filters.push({ label: `Tầng ${v}`, type: "floorName", value: v }));
    selectedFloorGroupCode.forEach((v) => filters.push({ label: `Nhóm tầng ${v}`, type: "floorGroupCode", value: v }));
    selectedFloorApartmentGroupCode.forEach((v) =>
      filters.push({ label: v, type: "floorApartmentGroupCode", value: v })
    );

    selectedStatuses.forEach((v) => {
      filters.push({ label: v, type: "status", value: v });
    });

    if (activeBedroom) {
      filters.push({ label: `${activeBedroom} phòng ngủ`, type: "bedroom", value: activeBedroom });
    }

    if (activeBathroom) {
      filters.push({ label: `${activeBathroom} phòng tắm`, type: "bathroom", value: activeBathroom });
    }

    return filters;
  }, [
    selectedZones,
    selectedBuildingTypes,
    selectedDirections,
    selectedMainDoorDirections,
    selectedBalconyDirections,
    selectedFeature1,
    selectedFeature2,
    selectedFeature3,
    selectedFeature4,
    selectedApartmentType,
    selectedApartmentModelCode,
    selectedApartmentNum,
    selectedFloorName,
    selectedFloorGroupCode,
    selectedFloorApartmentGroupCode,
    activeBedroom,
    activeBathroom,
  ]);

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case "zone":
        setSelectedZones(selectedZones.filter((v) => v !== value));
        break;
      case "buildingType":
        setSelectedBuildingTypes(selectedBuildingTypes.filter((v) => v !== value));
        break;
      case "direction":
        setSelectedDirections(selectedDirections.filter((v) => v !== value));
        break;
      case "mainDoor":
        setSelectedMainDoorDirections(selectedMainDoorDirections.filter((v) => v !== value));
        break;
      case "balcony":
        setSelectedBalconyDirections(selectedBalconyDirections.filter((v) => v !== value));
        break;
      case "feature1":
        setSelectedFeature1(selectedFeature1.filter((v) => v !== value));
        break;
      case "feature2":
        setSelectedFeature2(selectedFeature2.filter((v) => v !== value));
        break;
      case "feature3":
        setSelectedFeature3(selectedFeature3.filter((v) => v !== value));
        break;
      case "feature4":
        setSelectedFeature4(selectedFeature4.filter((v) => v !== value));
        break;
      case "apartmentType":
        setSelectedApartmentType(selectedApartmentType.filter((v) => v !== value));
        break;
      case "apartmentModelCode":
        setSelectedApartmentModelCode(selectedApartmentModelCode.filter((v) => v !== value));
        break;
      case "apartmentNum":
        setSelectedApartmentNum(selectedApartmentNum.filter((v) => v !== value));
        break;
      case "floorName":
        setSelectedFloorName(selectedFloorName.filter((v) => v !== value));
        break;
      case "floorGroupCode":
        setSelectedFloorGroupCode(selectedFloorGroupCode.filter((v) => v !== value));
        break;
      case "floorApartmentGroupCode":
        setSelectedFloorApartmentGroupCode(selectedFloorApartmentGroupCode.filter((v) => v !== value));
        break;
      case "status":
        setSelectedStatuses(selectedStatuses.filter((v) => v !== value));
        break;
      case "bedroom":
        setActiveBedroom(null);
        break;
      case "bathroom":
        setActiveBathroom(null);
        break;
    }
  };



  const toggleFilterSidebar = () => {
    setShowFilterSidebar((prev) => {
      if (prev) {
        setSelectedBuildingTypes([]);
      }
      return !prev;
    });
  };
  



  const handleInputChange = (value: string) => {
    setSearchText(value);
    if (!value || value.trim().length < 1) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions = items
      .filter((item) =>
        `
        ${item.unit_code ?? ""}
        ${item.zone ?? ""}
        ${item.layer3 ?? ""}
        ${item.building_type ?? ""}
        ${item.layer2 ?? ""}
        ${item.bedroom ?? ""}
        ${item.bathroom ?? ""}
        ${item.direction ?? ""}
        ${item.main_door_direction ?? ""}
        ${item.balcony_direction ?? ""}
        ${item.status_unit ?? ""}
      `
          .toLowerCase()
          .includes(value.toLowerCase())
      )
      .slice(0, 10)
      .map((item) => ({
        value: item.unit_code,
        zone: item.zone,
        layer3: item.layer3,
        building_type: item.building_type,
        layer2: item.layer2,
        bedroom: item.bedroom,
        bathroom: item.bathroom,
        direction: item.direction,
        main_door_direction: item.main_door_direction,
        balcony_direction: item.balcony_direction,
        status_unit: item.status_unit,
      }));
    setSearchSuggestions(suggestions);
  };

  const handleSearch = () => {
    const filtered = items.filter((item) =>
      `
        ${item.unit_code ?? ""}
        ${item.zone ?? ""}
        ${item.layer3 ?? ""}
        ${item.building_type ?? ""}
        ${item.layer2 ?? ""}
        ${item.bedroom ?? ""}
        ${item.bathroom ?? ""}
        ${item.direction ?? ""}
        ${item.main_door_direction ?? ""}
        ${item.balcony_direction ?? ""}
        ${item.status_unit ?? ""}
      `
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  };



  // Lọc theo phòng tắm
  // const handleFilterBathroom = (num: string | number) => {
  //   const filtered = items.filter((item) => item.bathroom === num);
  //   setFilteredItems(filtered);
  //   setCurrentPage(1);
  // };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
const uniqueBuildingTypes = Array.from(
  new Set(
    items
      .map((item) => item.building_type)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueDirections = Array.from(
  new Set(
    items
      .map((item) => item.direction)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueMainDoorDirections = Array.from(
  new Set(
    items
      .map((item) => item.main_door_direction)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueBalconyDirections = Array.from(
  new Set(
    items
      .map((item) => item.balcony_direction)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFeature1 = Array.from(
  new Set(
    items
      .map((item) => item.feature_1)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFeature2 = Array.from(
  new Set(
    items
      .map((item) => item.feature_2)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFeature3 = Array.from(
  new Set(
    items
      .map((item) => item.feature_3)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFeature4 = Array.from(
  new Set(
    items
      .map((item) => item.feature_4)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueApartmentType = Array.from(
  new Set(
    items
      .map((item) => item.apartment_type)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueApartmentModelCode = Array.from(
  new Set(
    items
      .map((item) => item.apartment_model_code)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueApartmentNum = Array.from(
  new Set(
    items
      .map((item) => item.apartment_num)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFloorName = Array.from(
  new Set(
    items
      .map((item) => item.floor_name)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFloorGroupCode = Array.from(
  new Set(
    items
      .map((item) => item.floor_group_code)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueZones = Array.from(
  new Set(
    items
      .map((item) => item.zone)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFloorApartmentGroupCode = Array.from(
  new Set(
    items
      .map((item) => item.floor_apartment_group_code)
      .filter((type) => type !== undefined && type !== null && type !== "skip")
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));


// Lấy danh sách phòng ngủ duy nhất, ép về string và bỏ "Skip"
const uniqueBedrooms: string[] = Array.from(
  new Set(
    items
      .map((item) => item.bedroom)
      .filter(
        (num): num is string | number =>
          num !== undefined &&
          num !== null &&
          String(num).toLowerCase() !== "skip" // loại bỏ "Skip" bất kể viết hoa/thường
      )
      .map((num) => String(num))
  )
);

const uniqueBathrooms: string[] = Array.from(
  new Set(
    items
      .map((item) => item.bathroom)
      .filter(
        (num): num is string | number =>
          num !== undefined &&
          num !== null &&
          String(num).toLowerCase() !== "skip"
      )
      .map((num) => String(num))
  )
);

const sortedBedrooms = [...uniqueBedrooms].sort((a, b) => {
  const isNumA = !isNaN(Number(a));
  const isNumB = !isNaN(Number(b));

  if (isNumA && isNumB) {
    return Number(a) - Number(b);
  }
  if (isNumA) return -1;
  if (isNumB) return 1;
  return a.localeCompare(b);
});

const sortedBathrooms = [...uniqueBathrooms].sort((a, b) => {
  const isNumA = !isNaN(Number(a));
  const isNumB = !isNaN(Number(b));

  if (isNumA && isNumB) {
    return Number(a) - Number(b);
  }
  if (isNumA) return -1;
  if (isNumB) return 1;
  return a.localeCompare(b);
});





  if (loading) {
    return <Loader style={{ marginTop: 50, display: "block" }} />;
  }

  if (selectedItem) {
    return (
      <WarehouseDetail
        item={selectedItem}
        projectId={projectId}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  return (
    <div style={{ display: "flex" }}>
      {showFilterSidebar && (
        <FilterSidebar
          uniqueZones={uniqueZones}
          selectedZones={selectedZones}
          setSelectedZones={setSelectedZones}
          uniqueBuildingTypes={uniqueBuildingTypes}
          selectedBuildingTypes={selectedBuildingTypes}
          setSelectedBuildingTypes={setSelectedBuildingTypes}
          uniqueDirections={uniqueDirections}
          selectedDirections={selectedDirections}
          setSelectedDirections={setSelectedDirections}
          uniqueMainDoorDirections={uniqueMainDoorDirections}
          selectedMainDoorDirections={selectedMainDoorDirections}
          setSelectedMainDoorDirections={setSelectedMainDoorDirections}
          uniqueBalconyDirections={uniqueBalconyDirections}
          selectedBalconyDirections={selectedBalconyDirections}
          setSelectedBalconyDirections={setSelectedBalconyDirections}
          uniqueFeature1={uniqueFeature1}
          selectedFeature1={selectedFeature1}
          setSelectedFeature1={setSelectedFeature1}
          uniqueFeature2={uniqueFeature2}
          selectedFeature2={selectedFeature2}
          setSelectedFeature2={setSelectedFeature2}
          uniqueFeature3={uniqueFeature3}
          selectedFeature3={selectedFeature3}
          setSelectedFeature3={setSelectedFeature3}
          uniqueFeature4={uniqueFeature4}
          selectedFeature4={selectedFeature4}
          setSelectedFeature4={setSelectedFeature4}
          uniqueApartmentType={uniqueApartmentType}
          selectedApartmentType={selectedApartmentType}
          setSelectedApartmentType={setSelectedApartmentType}
          uniqueApartmentModelCode={uniqueApartmentModelCode}
          selectedApartmentModelCode={selectedApartmentModelCode}
          setSelectedApartmentModelCode={setSelectedApartmentModelCode}
          uniqueApartmentNum={uniqueApartmentNum}
          selectedApartmentNum={selectedApartmentNum}
          setSelectedApartmentNum={setSelectedApartmentNum}
          uniqueFloorName={uniqueFloorName}
          selectedFloorName={selectedFloorName}
          setSelectedFloorName={setSelectedFloorName}
          uniqueFloorGroupCode={uniqueFloorGroupCode}
          selectedFloorGroupCode={selectedFloorGroupCode}
          setSelectedFloorGroupCode={setSelectedFloorGroupCode}
          uniqueFloorApartmentGroupCode={uniqueFloorApartmentGroupCode}
          selectedFloorApartmentGroupCode={selectedFloorApartmentGroupCode}
          setSelectedFloorApartmentGroupCode={setSelectedFloorApartmentGroupCode}
          sortedBedrooms={sortedBedrooms}
          activeBedroom={activeBedroom}
          setActiveBedroom={setActiveBedroom}
          sortedBathrooms={sortedBathrooms}
          activeBathroom={activeBathroom}
          setActiveBathroom={setActiveBathroom}
        />
      )}

      <div style={{ flex: 1, padding: 20 }}>
        {/* Header */}
        <div>
          <Group gap="md">
            <ActionIcon
              variant="outline"
              radius="md"
              size="lg"
              styles={{
                root: { borderColor: "#762f0b", color: "#762f0b" },
                icon: { color: "#762f0b" },
              }}
              onClick={toggleFilterSidebar}
            >
              <IconFilter2 size={20} />
            </ActionIcon>

            {/* Autocomplete search */}
            <Autocomplete
              placeholder="Tìm kiếm...."
              value={searchText}
              data={searchSuggestions}
              onChange={handleInputChange}
                    filter={({ options }) => options}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              leftSection={
                <IconSearch
                  onClick={handleSearch}
                  size={16}
                  color="#762f0b"
                  style={{ cursor: "pointer" }}
                />
              }
           renderOption={({ option }) => {
  const meta = suggestionMeta.get(option.value);

  // Gom các trường có dữ liệu thành mảng, bỏ qua null/undefined
  const details = [
    meta?.zone,
    meta?.building_type,
    meta?.bedroom ? `${meta.bedroom} PN` : null,
    meta?.bathroom ? `${meta.bathroom} WC` : null,
    meta?.direction,
    meta?.main_door_direction,
    meta?.balcony_direction,
    meta?.status_unit,
  ].filter(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <strong>{option.value}</strong>
      {details.length > 0 && (
        <span style={{ fontSize: "12px", color: "#666" }}>
          {details.join(" • ")}
        </span>
      )}
    </div>
  );
}}

              styles={{
                input: { paddingLeft: 36 },
              }}
              style={{ width: 300 }}
            />
            <h1
              style={{
                cursor: "pointer",
                color: "#1c7ed6",
                fontSize: "16px",
                margin: 0,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
              }}
              onClick={() =>
                router.push(
                  `/quan-ly-ban-hang/tong-mat-bang/${projectId}?name=${encodeURIComponent(
                    projectName || ""
                  )}`
                )
              }
            >
              ← Quay lại
            </h1>
          </Group>

          {/* Status buttons */}
          <Group gap="md" style={{ marginTop: 16 }}>
            <button
              style={{
                backgroundColor: selectedStatuses.includes("Quan tâm") ? "#b8893c" : "#c99945",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 500,
                transition: "all 0.3s ease",
                opacity: selectedStatuses.includes("Quan tâm") ? 1 : (selectedStatuses.length === 0 ? 0.7 : 0.4),
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onClick={() => {
                const status = "Quan tâm";
                if (selectedStatuses.includes(status)) {
                  setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
                } else {
                  setSelectedStatuses([...selectedStatuses, status]);
                }
              }}
            >
              Quan tâm
            </button>

            <button
              style={{
                backgroundColor: selectedStatuses.includes("Đang bán") ? "#2f566d" : "#3d6985",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 500,
                transition: "all 0.3s ease",
                opacity: selectedStatuses.includes("Đang bán") ? 1 : (selectedStatuses.length === 0 ? 0.7 : 0.4),
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onClick={() => {
                const status = "Đang bán";
                if (selectedStatuses.includes(status)) {
                  setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
                } else {
                  setSelectedStatuses([...selectedStatuses, status]);
                }
              }}
            >
              Đang bán
            </button>

            <button
              style={{
                backgroundColor: selectedStatuses.includes("Đã đặt cọc") ? "#cc5c34" : "#e56a3e",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 500,
                transition: "all 0.3s ease",
                opacity: selectedStatuses.includes("Đã đặt cọc") ? 1 : (selectedStatuses.length === 0 ? 0.7 : 0.4),
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onClick={() => {
                const status = "Đã đặt cọc";
                if (selectedStatuses.includes(status)) {
                  setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
                } else {
                  setSelectedStatuses([...selectedStatuses, status]);
                }
              }}
            >
              Đã đặt cọc
            </button>

            <button
              style={{
                backgroundColor: selectedStatuses.includes("Đã bán") ? "#b32f1f" : "#d73a24",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 500,
                transition: "all 0.3s ease",
                opacity: selectedStatuses.includes("Đã bán") ? 1 : (selectedStatuses.length === 0 ? 0.7 : 0.4),
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onClick={() => {
                const status = "Đã bán";
                if (selectedStatuses.includes(status)) {
                  setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
                } else {
                  setSelectedStatuses([...selectedStatuses, status]);
                }
              }}
            >
              Đã bán
            </button>
          </Group>

          {/* <Divider size="xs" style={{ marginTop: 16 }} /> */}

          {/* Tags row */}
          {allActiveFilters.length > 0 && (
            <Group gap="xs" style={{ marginTop: 12, flexWrap: "wrap" }}>
              {allActiveFilters.map((filter, index) => (
                <div
                  key={`${filter.type}-${filter.value}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "3px 10px",
                    border: "1px solid #762f0b",
                    borderRadius: "20px",
                    fontSize: "14px",
                    color: "#762f0b",
                    backgroundColor: "#fff",
                  }}
                >
                  <span>{filter.label}</span>
                  <IconX
                    size={14}
                    style={{ cursor: "pointer" }}
                    onClick={() => removeFilter(filter.type, filter.value)}
                  />
                </div>
              ))}
            </Group>
          )}
          <Divider size="xs" style={{ marginTop: 16, marginBottom: 16 }} />
        </div>
        

        {/* List cards */}
<div className={styles.container}>
  {currentItems.filter(item => item.status_unit?.trim().toLowerCase() !== "skip").length === 0 ? (
    <Text ta="center" style={{ marginTop: 20, fontSize: "14px", color: "#888" }}>
      Không có dữ liệu
    </Text>
  ) : (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: showFilterSidebar ? 4 : 5 }}
      spacing="xl"
    >
      {currentItems
      // Lọc status_unit = skip
        .map((item) => {
          // Hàm xử lý giá trị "skip" thành "Không có"
          const renderValue = (value?: string) => {
            if (!value || value.trim().toLowerCase() === "skip") return "Không có";
            return value;
          };

          // Xác định màu nền theo trạng thái
          let backgroundColor;
          switch (item.status_unit) {
            case "Quan tâm":
              backgroundColor = "#b8893c"; // Tùy chỉnh màu này theo nhu cầu
              break;
            case "Đang bán":
              backgroundColor = "#3d6985"; // Tùy chỉnh màu này theo nhu cầu
              break;
            case "Đã đặt cọc":
              backgroundColor = "#cc5c34"; // Tùy chỉnh màu này theo nhu cầu
              break;
            case "Đã bán":
              backgroundColor = "#b32f1f"; // Tùy chỉnh màu này theo nhu cầu
              break;
            default:
              backgroundColor = "#fff"; // Màu nền mặc định
          }

          return (
            <Card
              key={item.id}
              shadow="md"
              radius="lg"
              className={styles.card}
              style={{ cursor: "pointer", backgroundColor }} // Áp dụng màu nền đã xác định
              onClick={() => setSelectedItem(item)}
            >
              {/* Mã căn hộ */}
              <Text fw={700} mb={8} style={{ fontSize: "15px" }} ta="center">
                {item.unit_code}
              </Text>

              {/* Phân khu hoặc Tòa */}
              <Text style={{ fontSize: "15px" }}>
                {item.zone ? `Phân khu: ${item.zone}` : `Tòa: ${item.layer3}`}
              </Text>

              {/* Loại công trình hoặc Vị trí */}
              <Text style={{ fontSize: "15px" }}>
                {item.building_type ? `Loại công trình: ${item.building_type}` : `Vị trí: ${item.layer2}`}
              </Text>

              {/* Phòng ngủ và phòng tắm */}
    {item.bedroom && (
  <Text style={{ fontSize: "15px" }}>
    Phòng ngủ:{" "}
    {typeof item.bedroom === "string" &&
    item.bedroom.trim().toLowerCase() === "skip"
      ? "Không có"
      : item.bedroom}
  </Text>
)}
{item.bathroom &&
  (typeof item.bathroom !== "string" ||
    item.bathroom.trim().toLowerCase() !== "skip") && (
    <Text style={{ fontSize: "15px" }}>
      Phòng tắm: {item.bathroom}
    </Text>
)}
              {/* Hướng, cửa chính, ban công */}
              {item.direction && item.direction.trim() !== "" && (
                <Text style={{ fontSize: "15px" }}>
                  Hướng: {renderValue(item.direction)}
                </Text>
              )}
              {item.main_door_direction && item.main_door_direction.trim() !== "" && (
                <Text style={{ fontSize: "15px" }}>
                  Hướng cửa chính: {renderValue(item.main_door_direction)}
                </Text>
              )}
              {item.balcony_direction && item.balcony_direction.trim() !== "" && (
                <Text style={{ fontSize: "15px" }}>
                  Hướng ban công: {renderValue(item.balcony_direction)}
                </Text>
              )}

              {/* Trạng thái căn hộ */}
              <Text style={{ fontSize: "15px" }}>Trạng thái: {item.status_unit}</Text>
            </Card>
          );
        })}
    </SimpleGrid>
  )}
</div>

        {/* Pagination */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff",
            padding: "10px 0",
            zIndex: 10,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filteredItems.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}
