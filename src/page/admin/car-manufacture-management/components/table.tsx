/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import CrudTemplate from "@/page/admin/components/crud-template";
import { Badge } from "@/components/ui/badge";
import { CarManufactureAPI } from "@/apis/manufacture.api";
import type { CarManufacture, CarManufactureRequest } from "@/@types/car/carManufacture";

const CarManufacturePage: React.FC = () => {
  // Define table columns
  const columns = [
    {
      key: "Name",
      title: "Tên nhà sản xuất xe",
      dataIndex: "name",
    },
    {
      key: "Logo",
      title: "Logo",
      dataIndex: "logo",
      render: (value: unknown, _record: CarManufacture) => (
        value ? (
          <img src={value as string} alt="Logo" className="w-8 h-8 object-contain" />
        ) : (
          <span className="text-muted-foreground">No logo</span>
        )
      ),
    },
    {
      key: "IsDeleted",
      title: "Đã xóa",
      dataIndex: "isDeleted",
      render: (value: unknown, _record: CarManufacture) => (
        <Badge variant={!value ? "default" : "secondary"}>
          {!value ? "Not Deleted" : "Deleted"}
        </Badge>
      ),
    },
    {
      key: "CreatedAt",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value: unknown, _record: CarManufacture) => new Date(value as string).toLocaleString(),
    },
    {
      key: "UpdatedAt",
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (value: unknown, _record: CarManufacture) => new Date(value as string).toLocaleString(),
    },
  ];

  // Define form fields
  const formItems = [
    {
      name: "name",
      label: "Tên nhà sản xuất xe",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên nhà sản xuất xe",
    },
    {
      name: "logo",
      label: "URL Logo",
      type: "text" as const,
      required: false,
      placeholder: "Nhập URL logo (tùy chọn)",
    },
  ];

  // Define sort options
  const sortOptions = [
    {
      value: "name-asc",
      label: "Tên A-Z",
      sortFn: (a: CarManufacture, b: CarManufacture) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      value: "name-desc",
      label: "Tên Z-A",
      sortFn: (a: CarManufacture, b: CarManufacture) => (b.name || "").localeCompare(a.name || ""),
    },
    {
      value: "created-asc",
      label: "Ngày tạo (cũ nhất)",
      sortFn: (a: CarManufacture, b: CarManufacture) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
    },
    {
      value: "created-desc",
      label: "Ngày tạo (mới nhất)",
      sortFn: (a: CarManufacture, b: CarManufacture) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    },
    {
      value: "updated-asc",
      label: "Ngày cập nhật (cũ nhất)",
      sortFn: (a: CarManufacture, b: CarManufacture) => new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime(),
    },
    {
      value: "updated-desc",
      label: "Ngày cập nhật (mới nhất)",
      sortFn: (a: CarManufacture, b: CarManufacture) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
    },
  ];

  return (
    <div className="container mx-auto space-y-4">
      <CrudTemplate<CarManufacture, CarManufactureRequest>
        api={CarManufactureAPI}
        columns={columns}
        formItems={formItems}
        addButtonText="Thêm nhà sản xuất xe"
        editButtonText="Sửa"
        deleteButtonText="Xóa"
        deleteConfirmTitle="Xóa nhà sản xuất xe"
        deleteConfirmDescription="Bạn có chắc chắn muốn xóa nhà sản xuất xe này? Thao tác này không thể hoàn tác và sẽ ảnh hưởng đến tất cả các xe liên quan."
        successMessages={{
          create: "Nhà sản xuất xe đã được tạo thành công!",
          update: "Nhà sản xuất xe đã được cập nhật thành công!",
          delete: "Nhà sản xuất xe đã được xóa thành công!",
        }}
        searchField="name"
        sortOptions={sortOptions}
      />
    </div>
  );
};

export default CarManufacturePage;
