# CrudTemplate Component

Một component React có thể tái sử dụng để thực hiện các thao tác CRUD (Create, Read, Update, Delete) với các tính năng tìm kiếm, lọc và sắp xếp.

## Mục lục
- [Tính năng](#tính-năng)
- [Cài đặt](#cài-đặt)
- [Cách sử dụng](#cách-sử-dụng)
- [API Reference](#api-reference)
- [Ví dụ](#ví-dụ)
- [Customization](#customization)

## Tính năng

- ✅ **CRUD Operations**: Create, Read, Update, Delete
- 🔍 **Tìm kiếm**: Tìm kiếm theo một trường cụ thể
- 🎯 **Lọc dữ liệu**: Lọc theo nhiều trường với nhiều loại input
- 📊 **Sắp xếp**: Sắp xếp dữ liệu theo nhiều tiêu chí
- 📝 **Form Validation**: Validation tự động với react-hook-form
- 🎨 **UI Components**: Sử dụng shadcn/ui components
- 🔔 **Toast Notifications**: Thông báo thành công/lỗi với Sonner
- 🌐 **Generic Types**: Hỗ trợ TypeScript với generic types

## Cài đặt

Component này đã được tích hợp sẵn trong project. Chỉ cần import và sử dụng:

```tsx
import CrudTemplate from "@/page/admin/components/crud-template";
```

## Cách sử dụng

### Bước 1: Định nghĩa Type cho dữ liệu

```tsx
interface CarEv {
  id: string;
  modelId: string;
  depotId: string;
  color: string;
  plateNumber: string;
  // ... các trường khác
}
```

### Bước 2: Tạo API interface

```tsx
import { CrudAPI } from "@/@types/api.interface";

const carEvApi: CrudAPI<CarEv> = {
  getAll: async () => {
    return await carEvAPI.getAll();
  },
  getById: async (id: string) => {
    return await carEvAPI.getById(id);
  },
  create: async (data) => {
    return await carEvAPI.create(data);
  },
  update: async (id: string, data) => {
    return await carEvAPI.update(id, data);
  },
  delete: async (id: string) => {
    return await carEvAPI.delete(id);
  },
};
```

### Bước 3: Định nghĩa form items

```tsx
import { FormItem } from "@/@types/api.interface";

const formItems: FormItem<CarEv>[] = [
  {
    name: "plateNumber",
    label: "Biển số xe",
    type: "text",
    required: true,
    placeholder: "VD: 30A-12345",
  },
  {
    name: "modelId",
    label: "Model",
    required: true,
    render: (register) => (
      <Select {...register("modelId")}>
        {/* your select options */}
      </Select>
    ),
  },
  // ... các trường khác
];
```

### Bước 4: Định nghĩa columns cho bảng

```tsx
import { Column } from "@/page/admin/components/crud-template";

const columns: Column<CarEv>[] = [
  {
    key: "plateNumber",
    title: "Biển số",
    dataIndex: "plateNumber",
  },
  {
    key: "color",
    title: "Màu sắc",
    dataIndex: "color",
    render: (value) => <Badge>{value}</Badge>,
  },
  // ... các cột khác
];
```

### Bước 5: Sử dụng component

```tsx
import CrudTemplate from "@/page/admin/components/crud-template";

const MyPage = () => {
  return (
    <CrudTemplate
      columns={columns}
      api={carEvApi}
      formItems={formItems}
      addButtonText="Thêm xe mới"
      editButtonText="Sửa"
      deleteButtonText="Xóa"
      searchField="plateNumber"
    />
  );
};
```

## API Reference

### Props

| Prop | Type | Required | Default | Mô tả |
|------|------|----------|---------|-------|
| `columns` | `Column<T>[]` | ✅ | - | Cấu hình các cột hiển thị trong bảng |
| `api` | `CrudAPI<T, TRequest>` | ✅ | - | API interface để thực hiện CRUD operations |
| `formItems` | `FormItem<T>[]` | ✅ | - | Cấu hình các trường trong form |
| `addButtonText` | `string` | ❌ | "Add Item" | Text hiển thị trên nút thêm mới |
| `editButtonText` | `string` | ❌ | "Edit" | Text hiển thị trên nút sửa |
| `deleteButtonText` | `string` | ❌ | "Delete" | Text hiển thị trên nút xóa |
| `deleteConfirmTitle` | `string` | ❌ | "Delete Item" | Tiêu đề dialog xác nhận xóa |
| `deleteConfirmDescription` | `string` | ❌ | "Are you sure..." | Mô tả dialog xác nhận xóa |
| `successMessages` | `object` | ❌ | `{create: "Item created...", update: "Item updated...", delete: "Item deleted..."}` | Thông báo thành công |
| `searchField` | `string` | ❌ | "name" | Trường để tìm kiếm |
| `sortOptions` | `SortOption<T>[]` | ❌ | `[]` | Các tùy chọn sắp xếp |
| `filterOptions` | `FilterOption<T>[]` | ❌ | `[]` | Các tùy chọn lọc |

### Types

#### `Column<T>`
```tsx
interface Column<T> {
  key: string;              // Unique key cho cột
  title: string;            // Tiêu đề hiển thị
  dataIndex: string;        // Trường dữ liệu trong object
  render?: (value: unknown, record: T) => React.ReactNode; // Custom render
}
```

#### `CrudAPI<T, TRequest>`
```tsx
interface CrudAPI<T, TRequest = Partial<T>> {
  getAll: (pageNumber?: number, pageSize?: number) => Promise<AxiosResponse<ListBaseResponse<T>>>;
  getById: (id: string) => Promise<T>;
  create: (data: TRequest) => Promise<T>;
  update: (id: string, data: TRequest) => Promise<T>;
  delete: (id: string) => Promise<void>;
}
```

#### `FormItem<T>`
```tsx
interface FormItem<T extends FieldValues> {
  name: string;             // Field name (required)
  label: string;            // Label hiển thị
  type?: "text" | "number" | "email" | "password" | "date";
  required?: boolean;       // Có bắt buộc hay không
  placeholder?: string;     // Placeholder text
  render?: (register: UseFormRegister<T>) => React.ReactNode; // Custom render
}
```

#### `SortOption<T>`
```tsx
interface SortOption<T> {
  value: string;            // Unique value
  label: string;            // Label hiển thị
  sortFn: (a: T, b: T) => number; // Sort function
}
```

#### `FilterOption<T>`
```tsx
interface FilterOption<T> {
  field: keyof T;           // Field để lọc
  label: string;            // Label hiển thị
  type: "select" | "text";  // Loại input
  options?: Array<{ value: string; label: string }>; // Options cho select
}
```

## Ví dụ

### Ví dụ cơ bản

```tsx
import CrudTemplate from "@/page/admin/components/crud-template";
import { carEvApi } from "@/apis/car-ev.api";
import type { CarEv } from "@/@types/car/carEv";

const CarEvManagement = () => {
  const columns: Column<CarEv>[] = [
    { key: "id", title: "ID", dataIndex: "id" },
    { key: "plateNumber", title: "Biển số", dataIndex: "plateNumber" },
    { key: "color", title: "Màu sắc", dataIndex: "color" },
  ];

  const formItems: FormItem<CarEv>[] = [
    {
      name: "plateNumber",
      label: "Biển số xe",
      type: "text",
      required: true,
    },
    {
      name: "color",
      label: "Màu sắc",
      type: "text",
      required: true,
    },
  ];

  return (
    <CrudTemplate
      columns={columns}
      api={carEvApi}
      formItems={formItems}
    />
  );
};
```

### Ví dụ với Custom Render

```tsx
const columns: Column<CarEv>[] = [
  {
    key: "status",
    title: "Trạng thái",
    dataIndex: "status",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value}
      </Badge>
    ),
  },
];
```

### Ví dụ với Custom Form Field

```tsx
const formItems: FormItem<CarEv>[] = [
  {
    name: "modelId",
    label: "Model",
    required: true,
    render: (register) => (
      <Select {...register("modelId")}>
        <SelectContent>
          <SelectItem value="1">Model A</SelectItem>
          <SelectItem value="2">Model B</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
];
```

### Ví dụ với Sorting

```tsx
const sortOptions: SortOption<CarEv>[] = [
  {
    value: "plateNumber-asc",
    label: "Biển số A-Z",
    sortFn: (a, b) => (a.plateNumber || "").localeCompare(b.plateNumber || ""),
  },
  {
    value: "plateNumber-desc",
    label: "Biển số Z-A",
    sortFn: (a, b) => (b.plateNumber || "").localeCompare(a.plateNumber || ""),
  },
];

<CrudTemplate
  columns={columns}
  api={carEvApi}
  formItems={formItems}
  sortOptions={sortOptions}
/>
```

### Ví dụ với Filtering

```tsx
const filterOptions: FilterOption<CarEv>[] = [
  {
    field: "color",
    label: "Màu sắc",
    type: "select",
    options: [
      { value: "Đỏ", label: "Đỏ" },
      { value: "Xanh", label: "Xanh" },
      { value: "Trắng", label: "Trắng" },
    ],
  },
  {
    field: "depotId",
    label: "Depot",
    type: "text",
  },
];

<CrudTemplate
  columns={columns}
  api={carEvApi}
  formItems={formItems}
  filterOptions={filterOptions}
/>
```

### Ví dụ với tất cả tính năng

```tsx
const MyPage = () => {
  return (
    <CrudTemplate
      columns={columns}
      api={carEvApi}
      formItems={formItems}
      addButtonText="Thêm xe mới"
      editButtonText="Chỉnh sửa"
      deleteButtonText="Xóa bỏ"
      searchField="plateNumber"
      sortOptions={sortOptions}
      filterOptions={filterOptions}
      successMessages={{
        create: "Đã thêm xe thành công!",
        update: "Đã cập nhật xe thành công!",
        delete: "Đã xóa xe thành công!",
      }}
      deleteConfirmTitle="Xác nhận xóa"
      deleteConfirmDescription="Bạn có chắc chắn muốn xóa xe này? Hành động này không thể hoàn tác."
    />
  );
};
```

## Customization

### Custom Form Validation

```tsx
import { useForm } from "react-hook-form";

const formItems: FormItem<CarEv>[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    // Validation sẽ tự động được thêm bởi react-hook-form
  },
];
```

### Custom API với Error Handling

```tsx
const carEvApi: CrudAPI<CarEv> = {
  getAll: async () => {
    try {
      const response = await axios.get("/api/cars");
      return response;
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
  },
  // ... other methods
};
```

### Thêm Custom Actions

Bạn có thể mở rộng component để thêm custom actions bằng cách:

1. Thêm cột mới với custom render cho action buttons
2. Sử dụng `onClick` để xử lý logic tùy chỉnh

```tsx
const columns: Column<CarEv>[] = [
  // ... existing columns
  {
    key: "customAction",
    title: "Actions",
    dataIndex: "id",
    render: (_, record) => (
      <Button onClick={() => handleCustomAction(record)}>
        Custom Action
      </Button>
    ),
  },
];
```

## Lưu ý

1. **ID Field**: Component yêu cầu record phải có field `id` để thực hiện update/delete
2. **Response Structure**: API response phải có cấu trúc:
   ```tsx
   {
     data: {
       data: {
         items: T[]
       }
     }
   }
   ```
3. **Form Validation**: Sử dụng react-hook-form để validation, tất cả các field có `required: true` sẽ được validate tự động
4. **TypeScript**: Component sử dụng generic types, đảm bảo type safety khi sử dụng

## Troubleshooting

### Lỗi: "Failed to fetch data"
- Kiểm tra API endpoint có hoạt động không
- Kiểm tra response structure có đúng format không

### Lỗi: Validation không hoạt động
- Đảm bảo `required` field được set đúng trong formItems
- Kiểm tra type của form field

### Lỗi: Delete không hoạt động
- Kiểm tra record có field `id` không
- Kiểm tra API delete method có return đúng không

## Liên quan

- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Sonner Toast](https://sonner.emilkowal.ski/)

