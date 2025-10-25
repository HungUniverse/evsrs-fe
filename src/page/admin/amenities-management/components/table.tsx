import React from "react";
import CrudTemplate from "@/page/admin/components/crud-template";
import type { CrudAPI } from "@/@types/api.interface";
import { Badge } from "@/components/ui/badge";
import { AmenityAPI } from "@/apis/amentities.api";
import type { Amenity, AmenityRequest } from "@/@types/car/amentities";

const AmenitiesTable: React.FC = () => {
  const columns = [
    {
      key: "name",
      title: "Tên tiện ích",
      dataIndex: "name",
    },
    {
      key: "icon",
      title: "Biểu tượng (URL/Tên)",
      dataIndex: "icon",
      render: (value: unknown) => (value ? String(value) : "-")
    },
    {
      key: "isDeleted",
      title: "Trạng thái",
      dataIndex: "isDeleted",
      render: (value: unknown) => (
        <Badge variant={!value ? "default" : "secondary"}>
          {!value ? "Hoạt động" : "Đã xóa"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value: unknown) => (value ? new Date(String(value)).toLocaleString() : "")
    },
    {
      key: "updatedAt",
      title: "Cập nhật",
      dataIndex: "updatedAt",
      render: (value: unknown) => (value ? new Date(String(value)).toLocaleString() : "")
    },
  ];

  const formItems = [
    {
      name: "name",
      label: "Tên tiện ích",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên tiện ích",
    },
    {
      name: "icon",
      label: "Biểu tượng (URL/Tên)",
      type: "text" as const,
      required: false,
      placeholder: "Nhập URL hoặc tên icon",
    },
  ];

  const sortOptions = [
    {
      value: "name-asc",
      label: "Tên A-Z",
      sortFn: (a: Amenity, b: Amenity) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      value: "name-desc",
      label: "Tên Z-A",
      sortFn: (a: Amenity, b: Amenity) => (b.name || "").localeCompare(a.name || ""),
    },
    {
      value: "created-desc",
      label: "Ngày tạo (mới nhất)",
      sortFn: (a: Amenity, b: Amenity) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    },
    {
      value: "created-asc",
      label: "Ngày tạo (cũ nhất)",
      sortFn: (a: Amenity, b: Amenity) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
    },
  ];

  const amenityCrudApi: CrudAPI<Amenity, AmenityRequest> = {
    getAll: AmenityAPI.getAll,
    getById: AmenityAPI.getById,
    create: AmenityAPI.create,
    update: AmenityAPI.update,
    delete: async (id: string) => {
      await AmenityAPI.delete(id);
    },
  };

  return (
    <div className="container mx-auto space-y-4">
      <CrudTemplate<Amenity, AmenityRequest>
        api={amenityCrudApi}
        columns={columns}
        formItems={formItems}
        addButtonText="Thêm tiện ích"
        editButtonText="Sửa"
        deleteButtonText="Xóa"
        deleteConfirmTitle="Xóa tiện ích"
        deleteConfirmDescription="Bạn có chắc chắn muốn xóa tiện ích này? Thao tác này không thể hoàn tác."
        successMessages={{
          create: "Tiện ích đã được tạo thành công!",
          update: "Tiện ích đã được cập nhật thành công!",
          delete: "Tiện ích đã được xóa thành công!",
        }}
        searchField="name"
        sortOptions={sortOptions}
      />
    </div>
  );
};

export default AmenitiesTable;
