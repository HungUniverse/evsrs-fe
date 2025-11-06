
import CrudTemplate from "@/page/admin/components/crud-template";
import { depotAPI } from "@/apis/depot.api";
import type { Depot, DepotRequest } from "@/@types/car/depot";
import type { FormItem, SortOption, FilterOption } from "@/@types/api.interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columns = [
  {
    key: "name",
    title: "Tên trạm",
    dataIndex: "name",
  },
  {
    key: "province",
    title: "Tỉnh/Thành phố",
    dataIndex: "province",
  },
  {
    key: "district",
    title: "Quận/Huyện",
    dataIndex: "district",
  },
  {
    key: "ward",
    title: "Phường/Xã",
    dataIndex: "ward",
  },
  {
    key: "street",
    title: "Đường",
    dataIndex: "street",
  },
  {
    key: "openTime",
    title: "Giờ mở cửa",
    dataIndex: "openTime",
  },
  {
    key: "closeTime",
    title: "Giờ đóng cửa",
    dataIndex: "closeTime",
  },
];

const formItems: FormItem<Depot>[] = [
  {
    name: "name",
    label: "Tên trạm",
    placeholder: "Nhập tên trạm",
    required: true,
    type: "text",
  },
  {
    name: "mapId",
    label: "Map ID",
    placeholder: "Nhập Map ID",
    required: true,
    render: ({ register, watch }) => (
      <div className="space-y-2">
        <Label htmlFor="mapId">
          Map ID
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="mapId"
          type="text"
          placeholder="Nhập Map ID"
          disabled={Boolean(watch("id"))}
          {...register("mapId" as unknown as never, {
            required: "Map ID is required",
          })}
        />
      </div>
    ),
  },
  {
    name: "province",
    label: "Tỉnh/Thành phố",
    placeholder: "Nhập tỉnh/thành phố",
    required: true,
    type: "text",
  },
  {
    name: "district",
    label: "Quận/Huyện",
    placeholder: "Nhập quận/huyện",
    required: true,
    type: "text",
  },
  {
    name: "ward",
    label: "Phường/Xã",
    placeholder: "Nhập phường/xã",
    required: true,
    type: "text",
  },
  {
    name: "street",
    label: "Đường",
    placeholder: "Nhập tên đường",
    required: true,
    type: "text",
  },
  {
    name: "lattitude",
    label: "Vĩ độ",
    placeholder: "Nhập vĩ độ",
    required: true,
    render: ({ register }) => (
      <div className="space-y-2">
        <Label htmlFor="lattitude">
          Vĩ độ
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="lattitude"
          type="number"
          step="any"
          placeholder="Nhập vĩ độ"
          {...register("lattitude" as unknown as never, {
            required: "Vĩ độ là bắt buộc",
          })}
        />
      </div>
    ),
  },
  {
    name: "longitude",
    label: "Kinh độ",
    placeholder: "Nhập kinh độ",
    required: true,
    render: ({ register }) => (
      <div className="space-y-2">
        <Label htmlFor="longitude">
          Kinh độ
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="longitude"
          type="number"
          step="any"
          placeholder="Nhập kinh độ"
          {...register("longitude" as unknown as never, {
            required: "Kinh độ là bắt buộc",
          })}
        />
      </div>
    ),
  },
  {
    name: "openTime",
    label: "Giờ mở cửa",
    placeholder: "HH:MM",
    required: true,
    type: "time",
  },
  {
    name: "closeTime",
    label: "Giờ đóng cửa",
    placeholder: "HH:MM",
    required: true,
    type: "time",
  },
];

// Sort options for depot table
const sortOptions: SortOption<Depot>[] = [
  {
    value: "name-asc",
    label: "Tên trạm (A-Z)",
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    value: "name-desc", 
    label: "Tên trạm (Z-A)",
    sortFn: (a, b) => b.name.localeCompare(a.name),
  },
  {
    value: "province-asc",
    label: "Tỉnh/Thành phố (A-Z)",
    sortFn: (a, b) => a.province.localeCompare(b.province),
  },
  {
    value: "province-desc",
    label: "Tỉnh/Thành phố (Z-A)", 
    sortFn: (a, b) => b.province.localeCompare(a.province),
  },
  {
    value: "district-asc",
    label: "Quận/Huyện (A-Z)",
    sortFn: (a, b) => a.district.localeCompare(b.district),
  },
  {
    value: "district-desc",
    label: "Quận/Huyện (Z-A)",
    sortFn: (a, b) => b.district.localeCompare(a.district),
  },
  {
    value: "openTime-asc",
    label: "Giờ mở cửa (sớm nhất)",
    sortFn: (a, b) => a.openTime.localeCompare(b.openTime),
  },
  {
    value: "openTime-desc",
    label: "Giờ mở cửa (muộn nhất)",
    sortFn: (a, b) => b.openTime.localeCompare(a.openTime),
  },
  {
    value: "createdAt-asc",
    label: "Ngày tạo (cũ nhất)",
    sortFn: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  },
  {
    value: "createdAt-desc",
    label: "Ngày tạo (mới nhất)",
    sortFn: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  },
];

// Filter options for depot table
const filterOptions: FilterOption<Depot>[] = [
  {
    field: "province",
    label: "Tỉnh/Thành phố",
    type: "text",
  },
  {
    field: "district", 
    label: "Quận/Huyện",
    type: "text",
  },
  {
    field: "ward",
    label: "Phường/Xã", 
    type: "text",
  },
];

export default function DepotTable() {
  return (
    <CrudTemplate<Depot, DepotRequest>
      columns={columns}
      api={depotAPI}
      formItems={formItems}
      addButtonText="Thêm trạm mới"
      editButtonText="Sửa"
      deleteButtonText="Xóa"
      deleteConfirmTitle="Xóa trạm"
      deleteConfirmDescription="Bạn có chắc chắn muốn xóa trạm này? Hành động này không thể hoàn tác."
      successMessages={{
        create: "Thêm trạm thành công!",
        update: "Cập nhật trạm thành công!",
        delete: "Xóa trạm thành công!",
      }}
      searchField="name"
      sortOptions={sortOptions}
      filterOptions={filterOptions}
    />
  );
}
