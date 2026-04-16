"use client";

import { MultiSelect } from "@mantine/core";
// import { WarehouseItem } from "./index";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
  uniqueZones: string[];
  selectedZones: string[];
  setSelectedZones: (val: string[]) => void;
  uniqueLayer3: string[];
  selectedLayer3: string[];
  setSelectedLayer3: (val: string[]) => void;
  uniqueBuildingTypes: string[];
  selectedBuildingTypes: string[];
  setSelectedBuildingTypes: (val: string[]) => void;
  uniqueLayer2: string[];
  selectedLayer2: string[];
  setSelectedLayer2: (val: string[]) => void;
  uniqueDirections: string[];
  selectedDirections: string[];
  setSelectedDirections: (val: string[]) => void;
  uniqueMainDoorDirections: string[];
  selectedMainDoorDirections: string[];
  setSelectedMainDoorDirections: (val: string[]) => void;
  uniqueBalconyDirections: string[];
  selectedBalconyDirections: string[];
  setSelectedBalconyDirections: (val: string[]) => void;
  sortedBedrooms: string[];
  activeBedroom: string | null;
  setActiveBedroom: (val: string | null) => void;
  sortedBathrooms: string[];
  activeBathroom: string | null;
  setActiveBathroom: (val: string | null) => void;
  uniqueFeature1: string[];
  selectedFeature1: string[];
  setSelectedFeature1: (val: string[]) => void;
  uniqueFeature2: string[];
  selectedFeature2: string[];
  setSelectedFeature2: (val: string[]) => void;
  uniqueFeature3: string[];
  selectedFeature3: string[];
  setSelectedFeature3: (val: string[]) => void;
  uniqueFeature4: string[];
  selectedFeature4: string[];
  setSelectedFeature4: (val: string[]) => void;
  uniqueApartmentType: string[];
  selectedApartmentType: string[];
  setSelectedApartmentType: (val: string[]) => void;
  uniqueApartmentModelCode: string[];
  selectedApartmentModelCode: string[];
  setSelectedApartmentModelCode: (val: string[]) => void;
  uniqueApartmentNum: string[];
  selectedApartmentNum: string[];
  setSelectedApartmentNum: (val: string[]) => void;
  uniqueFloorName: string[];
  selectedFloorName: string[];
  setSelectedFloorName: (val: string[]) => void;
  uniqueFloorGroupCode: string[];
  selectedFloorGroupCode: string[];
  setSelectedFloorGroupCode: (val: string[]) => void;
  uniqueFloorApartmentGroupCode: string[];
  selectedFloorApartmentGroupCode: string[];
  setSelectedFloorApartmentGroupCode: (val: string[]) => void;
}


export default function FilterSidebar({
  uniqueZones,
  selectedZones,
  setSelectedZones,
  uniqueLayer3,
  selectedLayer3,
  setSelectedLayer3,
  uniqueBuildingTypes,
  selectedBuildingTypes,
  setSelectedBuildingTypes,
  uniqueLayer2,
  selectedLayer2,
  setSelectedLayer2,
  uniqueDirections,
  selectedDirections,
  setSelectedDirections,
  uniqueMainDoorDirections,
  selectedMainDoorDirections,
  setSelectedMainDoorDirections,
  uniqueBalconyDirections,
  selectedBalconyDirections,
  setSelectedBalconyDirections,
  sortedBedrooms,
  activeBedroom,
  setActiveBedroom,
  sortedBathrooms,
  activeBathroom,
  setActiveBathroom,
  uniqueFeature1,
  selectedFeature1,
  setSelectedFeature1,
  uniqueFeature2,
  selectedFeature2,
  setSelectedFeature2,
  uniqueFeature3,
  selectedFeature3,
  setSelectedFeature3,
  uniqueFeature4,
  selectedFeature4,
  setSelectedFeature4,
  uniqueApartmentType,
  selectedApartmentType,
  setSelectedApartmentType,
  uniqueApartmentModelCode,
  selectedApartmentModelCode,
  setSelectedApartmentModelCode,
  uniqueApartmentNum,
  selectedApartmentNum,
  setSelectedApartmentNum,
  uniqueFloorName,
  selectedFloorName,
  setSelectedFloorName,
  uniqueFloorGroupCode,
  selectedFloorGroupCode,
  setSelectedFloorGroupCode,
  uniqueFloorApartmentGroupCode,
  selectedFloorApartmentGroupCode,
  setSelectedFloorApartmentGroupCode,
}: FilterSidebarProps) {
  return (
    <div
      className={styles.sidebarContainer}
      style={{
        backgroundColor: "#f7f7f7",
        padding: 20,
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
        borderRadius: "10px",
      }}
    >
      <h1 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>
        Bộ lọc sản phẩm
      </h1>

      <div className={styles.filterListContainer}>
        {uniqueZones.length > 0 && (
          <MultiSelect
            label="Phân khu"
            placeholder="Chọn phân khu"
            data={uniqueZones}
            value={selectedZones}
            onChange={setSelectedZones}
            maxDropdownHeight={200}
            styles={{ input: { maxHeight: "100px", overflowY: "auto" } }}
          />
        )}

        {uniqueLayer3.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <MultiSelect
              label="Khu vực/tòa"
              placeholder="Chọn khu vực/tòa"
              data={uniqueLayer3}
              value={selectedLayer3}
              onChange={setSelectedLayer3}
              maxDropdownHeight={200}
              styles={{ input: { maxHeight: "100px", overflowY: "auto" } }}
            />
          </div>
        )}

        {uniqueBuildingTypes.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <MultiSelect
              label="Loại công trình"
              placeholder="Chọn loại công trình"
              data={uniqueBuildingTypes}
              value={selectedBuildingTypes}
              onChange={setSelectedBuildingTypes}
              maxDropdownHeight={200}
              styles={{ input: { maxHeight: "100px", overflowY: "auto" } }}
            />
          </div>
        )}

        {uniqueLayer2.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <MultiSelect
              label="Vị trí"
              placeholder="Chọn vị trí"
              data={uniqueLayer2}
              value={selectedLayer2}
              onChange={setSelectedLayer2}
              maxDropdownHeight={200}
              styles={{ input: { maxHeight: "100px", overflowY: "auto" } }}
            />
          </div>
        )}

        {uniqueDirections.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Hướng"
              placeholder="Chọn hướng"
              data={uniqueDirections}
              value={selectedDirections}
              onChange={setSelectedDirections}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueMainDoorDirections.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Hướng cửa chính"
              placeholder="Chọn hướng cửa chính"
              data={uniqueMainDoorDirections}
              value={selectedMainDoorDirections}
              onChange={setSelectedMainDoorDirections}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueBalconyDirections.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Hướng ban công"
              placeholder="Chọn hướng ban công"
              data={uniqueBalconyDirections}
              value={selectedBalconyDirections}
              onChange={setSelectedBalconyDirections}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueFeature1.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Đặc điểm nổi bật 1"
              placeholder="Chọn đặc điểm nổi bật 1"
              data={uniqueFeature1}
              value={selectedFeature1}
              onChange={setSelectedFeature1}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueFeature2.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Đặc điểm nổi bật 2"
              placeholder="Chọn đặc điểm nổi bật 2"
              data={uniqueFeature2}
              value={selectedFeature2}
              onChange={setSelectedFeature2}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueFeature3.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Đặc điểm nổi bật 3"
              placeholder="Chọn đặc điểm nổi bật 3"
              data={uniqueFeature3}
              value={selectedFeature3}
              onChange={setSelectedFeature3}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueFeature4.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Đặc điểm nổi bật 4"
              placeholder="Chọn đặc điểm nổi bật 4"
              data={uniqueFeature4}
              value={selectedFeature4}
              onChange={setSelectedFeature4}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueApartmentType.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Loại sản phẩm"
              placeholder="Chọn loại sản phẩm"
              data={uniqueApartmentType}
              value={selectedApartmentType}
              onChange={setSelectedApartmentType}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueApartmentModelCode.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Mã mẫu sản phẩm"
              placeholder="Chọn mã mẫu"
              data={uniqueApartmentModelCode}
              value={selectedApartmentModelCode}
              onChange={setSelectedApartmentModelCode}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueApartmentNum.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Số hiệu sản phẩm"
              placeholder="Chọn số hiệu"
              data={uniqueApartmentNum}
              value={selectedApartmentNum}
              onChange={setSelectedApartmentNum}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueFloorName.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Tầng"
              placeholder="Chọn tầng"
              data={uniqueFloorName}
              value={selectedFloorName}
              onChange={setSelectedFloorName}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueFloorGroupCode.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Nhóm tầng"
              placeholder="Chọn nhóm tầng"
              data={uniqueFloorGroupCode}
              value={selectedFloorGroupCode}
              onChange={setSelectedFloorGroupCode}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}

        {uniqueFloorApartmentGroupCode.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <MultiSelect
              label="Nhóm sản phẩm của tầng"
              placeholder="Chọn nhóm sản phẩm"
              data={uniqueFloorApartmentGroupCode}
              value={selectedFloorApartmentGroupCode}
              onChange={setSelectedFloorApartmentGroupCode}
              maxDropdownHeight={200}
              styles={{
                input: {
                  maxHeight: "100px",
                  overflowY: "auto",
                },
              }}
            />
          </div>
        )}
      </div>

      {sortedBedrooms.length > 0 && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block" }}>
            Phòng ngủ
          </label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {sortedBedrooms.map((num) => {
              const isActive = activeBedroom === String(num);

              return (
                <button
                  key={num}
                  onClick={() => setActiveBedroom(isActive ? null : String(num))}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #762f0b",
                    borderRadius: "20px",
                    backgroundColor: isActive ? "#762f0b" : "#fff",
                    color: isActive ? "#fff" : "#762f0b",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sortedBathrooms.length > 0 && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontWeight: "bold", display: "block" }}>
            Phòng tắm
          </label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {sortedBathrooms.map((num) => {
              const isActive = activeBathroom === String(num);

              return (
                <button
                  key={num}
                  onClick={() => setActiveBathroom(isActive ? null : String(num))}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #762f0b",
                    borderRadius: "20px",
                    backgroundColor: isActive ? "#762f0b" : "#fff",
                    color: isActive ? "#fff" : "#762f0b",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
