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
import { createWarehouse } from "../../../api/apiFilterWarehousebasic";
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
  leaf_id?: string;
  unit_code: string;
  layer6: string;
  layer7?: string;
  layer8?: string;
  describe: string;
  layer2: string;
  view: string;
  layer3: string;
  layer4?: string;
  layer5?: string;
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
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [activeBedroom, setActiveBedroom] = useState<string | null>(null);
  const [activeBathroom, setActiveBathroom] = useState<string | null>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
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
  const [selectedLayer3, setSelectedLayer3] = useState<string[]>([]);
  const [selectedLayer2, setSelectedLayer2] = useState<string[]>([]);


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

        const res = await createWarehouse(body);
        const warehouseList: WarehouseItem[] = Array.isArray(res) ? res : res.data || [];

        const finalList = target
          ? warehouseList.filter((item) => {
              if (item.zone) {
                return normalize(item.zone) === normalize(target);
              }
              if (item.layer3) {
                if (normalize(item.layer3) === normalize(target)) return true;
              }
              if (item.layer4) {
                if (normalize(item.layer4) === normalize(target)) return true;
              }
              if (item.layer5) {
                if (normalize(item.layer5) === normalize(target)) return true;
              }
              if (item.layer6) {
                if (normalize(item.layer6) === normalize(target)) return true;
              }
              return false;
            })
          : warehouseList;

        // Map leaf_id sang id nếu không có id
        const mappedList = finalList.map((item) => ({
          ...item,
          id: item.id || item.leaf_id || Math.random().toString(),
        }));

        setItems(mappedList);
        setFilteredItems(mappedList);
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

  // Filter theo phân khu (zone)
  if (selectedZones.length > 0) {
    filtered = filtered.filter((item) => item && selectedZones.includes(item.zone));
  }

  // Filter theo tòa (layer3) — chỉ áp dụng cho item không có zone hợp lệ
  if (selectedLayer3.length > 0) {
    filtered = filtered.filter(
      (item) => item && !isValid(item.zone) && selectedLayer3.includes(item.layer3)
    );
  }

  // Filter theo loại building
  if (selectedBuildingTypes.length > 0) {
    filtered = filtered.filter(
      (item) =>
        item && selectedBuildingTypes.includes(item.building_type)
    );
  }

  // Filter theo vị trí (layer2) — chỉ áp dụng cho item không có building_type hợp lệ
  if (selectedLayer2.length > 0) {
    filtered = filtered.filter(
      (item) => item && !isValid(item.building_type) && selectedLayer2.includes(item.layer2)
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

  // Filter theo các trường đặc điểm nổi bật
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

  // Filter theo các trường mới khác
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
  selectedLayer3,
  selectedBuildingTypes,
  selectedLayer2,
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
]);

  const allActiveFilters = useMemo(() => {
    const filters: { label: string; type: string; value: string }[] = [];

    selectedZones.forEach((v) => filters.push({ label: `Phân khu: ${v}`, type: "zone", value: v }));
    selectedLayer3.forEach((v) => filters.push({ label: `Tòa: ${v}`, type: "layer3", value: v }));
    selectedBuildingTypes.forEach((v) => filters.push({ label: `Loại CT: ${v}`, type: "buildingType", value: v }));
    selectedLayer2.forEach((v) => filters.push({ label: `Vị trí: ${v}`, type: "layer2", value: v }));
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
    selectedLayer3,
    selectedBuildingTypes,
    selectedLayer2,
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
      case "layer3":
        setSelectedLayer3(selectedLayer3.filter((v) => v !== value));
        break;
      case "buildingType":
        setSelectedBuildingTypes(selectedBuildingTypes.filter((v) => v !== value));
        break;
      case "layer2":
        setSelectedLayer2(selectedLayer2.filter((v) => v !== value));
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
const isValid = (v: string | undefined | null) =>
  v !== undefined && v !== null && v.trim() !== "" && v.trim().toLowerCase() !== "skip";

const uniqueBuildingTypes = Array.from(
  new Set(items.map((item) => item.building_type).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueDirections = Array.from(
  new Set(items.map((item) => item.direction).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueMainDoorDirections = Array.from(
  new Set(items.map((item) => item.main_door_direction).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueBalconyDirections = Array.from(
  new Set(items.map((item) => item.balcony_direction).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFeature1 = Array.from(
  new Set(items.map((item) => item.feature_1).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFeature2 = Array.from(
  new Set(items.map((item) => item.feature_2).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFeature3 = Array.from(
  new Set(items.map((item) => item.feature_3).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFeature4 = Array.from(
  new Set(items.map((item) => item.feature_4).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueApartmentType = Array.from(
  new Set(items.map((item) => item.apartment_type).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueApartmentModelCode = Array.from(
  new Set(items.map((item) => item.apartment_model_code).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueApartmentNum = Array.from(
  new Set(items.map((item) => item.apartment_num).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFloorName = Array.from(
  new Set(items.map((item) => item.floor_name).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFloorGroupCode = Array.from(
  new Set(items.map((item) => item.floor_group_code).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueZones = Array.from(
  new Set(items.map((item) => item.zone).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const uniqueFloorApartmentGroupCode = Array.from(
  new Set(items.map((item) => item.floor_apartment_group_code).filter(isValid))
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

// layer3 chỉ lấy từ items không có zone hợp lệ (khớp với logic hiển thị card)
const uniqueLayer3 = Array.from(
  new Set(
    items
      .filter((item) => !isValid(item.zone))
      .map((item) => item.layer3)
      .filter(isValid)
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

// layer2 chỉ lấy từ items không có building_type hợp lệ (khớp với logic hiển thị card)
const uniqueLayer2 = Array.from(
  new Set(
    items
      .filter((item) => !isValid(item.building_type))
      .map((item) => item.layer2)
      .filter(isValid)
  )
).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

// Danh sách status hợp lệ (không null/empty/skip)
const uniqueStatuses = Array.from(
  new Set(items.map((item) => item.status_unit).filter(isValid))
);

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
          uniqueLayer3={uniqueLayer3}
          selectedLayer3={selectedLayer3}
          setSelectedLayer3={setSelectedLayer3}
          uniqueBuildingTypes={uniqueBuildingTypes}
          selectedBuildingTypes={selectedBuildingTypes}
          setSelectedBuildingTypes={setSelectedBuildingTypes}
          uniqueLayer2={uniqueLayer2}
          selectedLayer2={selectedLayer2}
          setSelectedLayer2={setSelectedLayer2}
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
  ].filter((val) => val && String(val).trim().toLowerCase() !== "skip");

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
                marginLeft: "auto", // Đẩy về bên phải
              }}
              onClick={() =>
                router.push(
                  `/thong-tin-san-pham/tong-mat-bang/${projectId}?name=${encodeURIComponent(
                    projectName || ""
                  )}`
                )
              }
            >
              ← Quay lại
            </h1>
          </Group>

          {/* Status buttons */}
          {uniqueStatuses.length > 0 && (
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
                display: uniqueStatuses.includes("Quan tâm") ? undefined : "none",
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
                display: uniqueStatuses.includes("Đang bán") ? undefined : "none",
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
                display: uniqueStatuses.includes("Đã đặt cọc") ? undefined : "none",
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
                display: uniqueStatuses.includes("Đã bán") ? undefined : "none",
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
          )}

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
          {currentItems.length === 0 ? (
            <Text ta="center" style={{ marginTop: 20, fontSize: "14px", color: "#888" }}>
              Không có dữ liệu
            </Text>
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: showFilterSidebar ? 4 : 5 }}
              spacing="xl"
            >
              {currentItems.map((item) => (
                <Card
                  key={item.id}
                  shadow="md"
                  radius="lg"
                  className={styles.card}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedItem(item)}
                >
                  <Text fw={700} mb={8} style={{ fontSize: "13px" }} ta="center">
                    {item.zone}
                  </Text>
                  {/* {item.zone && item.zone.trim().toLowerCase() !== "skip" ? (
                    <Text style={{ fontSize: "15px" }}>Phân khu: {item.zone}</Text>
                  ) : item.layer3 && item.layer3.trim().toLowerCase() !== "skip" ? (
                    <Text style={{ fontSize: "15px" }}>Tòa: {item.layer3}</Text>
                  ) : null} */}

                  {item.building_type && item.building_type.trim().toLowerCase() !== "skip" ? (
                    <Text style={{ fontSize: "15px" }}>Loại công trình: {item.building_type}</Text>
                  ) : item.layer2 && item.layer2.trim().toLowerCase() !== "skip" ? (
                    <Text style={{ fontSize: "15px" }}>Vị trí: {item.layer2}</Text>
                  ) : null}

                  {item.bedroom != null &&
                    item.bedroom !== "" &&
                    String(item.bedroom).trim().toLowerCase() !== "skip" && (
                      <Text style={{ fontSize: "13px" }}>Phòng ngủ: {item.bedroom}</Text>
                    )}

                  {item.bathroom != null &&
                    item.bathroom !== "" &&
                    String(item.bathroom).trim().toLowerCase() !== "skip" && (
                      <Text style={{ fontSize: "13px" }}>Phòng tắm: {item.bathroom}</Text>
                    )}

                  {item.direction &&
                    item.direction.trim() !== "" &&
                    item.direction.trim().toLowerCase() !== "skip" && (
                      <Text style={{ fontSize: "15px" }}>Hướng: {item.direction}</Text>
                    )}

                  {item.main_door_direction &&
                    item.main_door_direction.trim() !== "" &&
                    item.main_door_direction.trim().toLowerCase() !== "skip" && (
                      <Text style={{ fontSize: "15px" }}>
                        Hướng cửa chính: {item.main_door_direction}
                      </Text>
                    )}
                    

                  {item.balcony_direction &&
                    item.balcony_direction.trim() !== "" &&
                    item.balcony_direction.trim().toLowerCase() !== "skip" && (
                      <Text style={{ fontSize: "15px" }}>
                        Hướng ban công: {item.balcony_direction}
                      </Text>
                    )}

                  {item.status_unit && item.status_unit.trim().toLowerCase() !== "skip" && (
                    <Text style={{ fontSize: "13px" }}>Trạng thái: {item.status_unit}</Text>
                  )}
                </Card>
              ))}
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
