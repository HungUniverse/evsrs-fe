import React, { useState, useEffect } from "react";
import CrudTemplate from "@/page/admin/components/crud-template";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CarManufactureAPI } from "@/apis/manufacture.api";
import { AmenityAPI } from "@/apis/amentities.api";
import { modelAPI } from "@/apis/model-ev.api";
import type { CarManufacture } from "@/@types/car/carManufacture";
import type { Amenity } from "@/@types/car/amentities";
import type { Model, ModelRequest } from "@/@types/car/model";
import type { UseFormRegister } from "react-hook-form";
import { uploadFileToCloudinary } from "@/lib/utils/cloudinary";
import { Loader2 } from "lucide-react";

const ModelTable: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<CarManufacture[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch manufacturers and amenities for dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [manufacturersRes, amenitiesRes] = await Promise.all([
          CarManufactureAPI.getAll(),
          AmenityAPI.getAll()
        ]);
        
        setManufacturers(manufacturersRes.data.data.items || []);
        setAmenities(amenitiesRes.data.data.items || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Define table columns
  const columns = [
    {
      key: "modelName",
      title: "Tên model",
      dataIndex: "modelName",
    },
    {
      key: "manufacturer",
      title: "Nhà sản xuất",
      dataIndex: "manufacturerCarId",
      render: (value: unknown) => {
        const manufacturer = manufacturers.find(m => m.id === value);
        return manufacturer ? manufacturer.name : "Unknown";
      },
    },
    {
      key: "amenities",
      title: "Tiện nghi",
      dataIndex: "amenitiesId",
      render: (value: unknown) => {
        const amenity = amenities.find(a => a.id === value);
        return amenity ? amenity.name : "Unknown";
      },
    },
    {
      key: "batteryCapacity",
      title: "Dung lượng pin (kWh)",
      dataIndex: "batteryCapacityKwh",
    },
    {
      key: "range",
      title: "Tầm hoạt động (km)",
      dataIndex: "rangeKm",
    },
    {
      key: "seats",
      title: "Số ghế",
      dataIndex: "seats",
    },
    {
      key: "price",
      title: "Giá thuê",
      dataIndex: "price",
      render: (value: unknown) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(value as number);
      },
    },
    {
      key: "sale",
      title: "Giảm giá (%)",
      dataIndex: "sale",
      render: (value: unknown) => `${value}%`,
    },
    {
      key: "electricityFee",
      title: "Phí điện",
      dataIndex: "electricityFee",
      render: (value: unknown) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(Number(value) || 0);
      },
    },
    {
      key: "overageFee",
      title: "Phí vượt km",
      dataIndex: "overageFee",
      render: (value: unknown) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(Number(value) || 0);
      },
    },
    {
      key: "image",
      title: "Hình ảnh",
      dataIndex: "image",
      render: (value: unknown) => (
        value ? (
          <img src={value as string} alt="Model" className="w-16 h-10 object-contain" />
        ) : (
          <span className="text-muted-foreground">No image</span>
        )
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value: unknown) => new Date(value as string).toLocaleString(),
    },
    {
      key: "updatedAt",
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (value: unknown) => new Date(value as string).toLocaleString(),
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
  ];

  // Define form fields
  const formItems = [
    {
      name: "modelName",
      label: "Tên model",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên model xe",
    },
    {
      name: "manufacturerCarId",
      label: "Nhà sản xuất",
      required: true,
      render: ({ register }: { register: UseFormRegister<Model> }) => (
        <div className="space-y-2">
          <Label htmlFor="manufacturerCarId">
            Nhà sản xuất <span className="text-red-500 ml-1">*</span>
          </Label>
          <select 
            id="manufacturerCarId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("manufacturerCarId", {
              required: "Nhà sản xuất là bắt buộc"
            })}
          >
            <option value="">Chọn nhà sản xuất</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      name: "amenitiesId",
      label: "Tiện nghi",
      required: true,
      render: ({ register }: { register: UseFormRegister<Model> }) => (
        <div className="space-y-2">
          <Label htmlFor="amenitiesId">
            Tiện nghi <span className="text-red-500 ml-1">*</span>
          </Label>
          <select 
            id="amenitiesId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("amenitiesId", {
              required: "Tiện nghi là bắt buộc"
            })}
          >
            <option value="">Chọn tiện nghi</option>
            {amenities.map((amenity) => (
              <option key={amenity.id} value={amenity.id}>
                {amenity.name}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      name: "batteryCapacityKwh",
      label: "Dung lượng pin (kWh)",
      type: "text" as const,
      required: true,
      placeholder: "Nhập dung lượng pin",
    },
    {
      name: "rangeKm",
      label: "Tầm hoạt động (km)",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tầm hoạt động",
    },
    {
      name: "limiteDailyKm",
      label: "Giới hạn km/ngày",
      type: "text" as const,
      required: true,
      placeholder: "Nhập giới hạn km/ngày",
    },
    {
      name: "seats",
      label: "Số ghế",
      type: "text" as const,
      required: true,
      placeholder: "Nhập số ghế",
    },
    {
      name: "price",
      label: "Giá thuê",
      type: "number" as const,
      required: true,
      placeholder: "Nhập giá thuê",
    },
    {
      name: "sale",
      label: "Giảm giá (%)",
      type: "number" as const,
      required: false,
      placeholder: "Nhập phần trăm giảm giá",
    },
    {
      name: "electricityFee",
      label: "Phí điện",
      type: "number" as const,
      required: true,
      placeholder: "Nhập phí điện",
    },
    {
      name: "overageFee",
      label: "Phí vượt km",
      type: "number" as const,
      required: true,
      placeholder: "Nhập phí vượt km",
    },
    {
      name: "image",
      label: "Hình ảnh",
      required: false,
      render: ({ setValue, getValues }: {
        setValue: (name: keyof Model, value: Model[keyof Model]) => void;
        getValues: (name: keyof Model) => Model[keyof Model];
      }) => {
        const currentUrl = (getValues("image") as string) || "";
        const displayUrl = imagePreview || currentUrl;

        const handleFiles = async (files: FileList | null) => {
          const file = files?.[0];
          if (!file) return;
          try {
            toast.loading("Đang tải ảnh lên...", { id: "image-upload" });
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
            setImageUploading(true);
            const url = await uploadFileToCloudinary(file);
            setValue("image" as keyof Model, url as unknown as Model[keyof Model]);
            setImagePreview(url);
            toast.success("Tải ảnh thành công", { id: "image-upload" });
          } catch (error) {
            console.error(error);
            toast.error("Tải ảnh thất bại", { id: "image-upload" });
          } finally {
            setImageUploading(false);
          }
        };

        return (
          <div className="space-y-2">
            <Label htmlFor="image">Hình ảnh</Label>
            <div
              className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => {
                const input = document.getElementById("imageInput") as HTMLInputElement | null;
                input?.click();
              }}
            >
              <p className="text-sm text-muted-foreground">Kéo & thả ảnh vào đây, hoặc nhấn để chọn</p>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {displayUrl ? (
                <div className="relative mt-2">
                  <img src={displayUrl} alt="Preview" className="h-24 w-auto object-contain" />
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Chưa có ảnh</span>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  // Define filter options
  const filterOptions = [
    {
      field: "manufacturerCarId" as keyof Model,
      label: "Nhà sản xuất",
      type: "select" as const,
      options: manufacturers.map((manufacturer) => ({
        value: String(manufacturer.id),
        label: manufacturer.name,
      })),
    },
  ];

  // Define sort options
  const sortOptions = [
    {
      value: "name-asc",
      label: "Tên model A-Z",
      sortFn: (a: Model, b: Model) => (a.modelName || "").localeCompare(b.modelName || ""),
    },
    {
      value: "name-desc",
      label: "Tên model Z-A",
      sortFn: (a: Model, b: Model) => (b.modelName || "").localeCompare(a.modelName || ""),
    },
    {
      value: "price-asc",
      label: "Giá thấp đến cao",
      sortFn: (a: Model, b: Model) => (a.price || 0) - (b.price || 0),
    },
    {
      value: "price-desc",
      label: "Giá cao đến thấp",
      sortFn: (a: Model, b: Model) => (b.price || 0) - (a.price || 0),
    },
    {
      value: "range-asc",
      label: "Tầm hoạt động (thấp đến cao)",
      sortFn: (a: Model, b: Model) => parseInt(a.rangeKm || "0") - parseInt(b.rangeKm || "0"),
    },
    {
      value: "range-desc",
      label: "Tầm hoạt động (cao đến thấp)",
      sortFn: (a: Model, b: Model) => parseInt(b.rangeKm || "0") - parseInt(a.rangeKm || "0"),
    },
    {
      value: "created-asc",
      label: "Ngày tạo (cũ nhất)",
      sortFn: (a: Model, b: Model) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
    },
    {
      value: "created-desc",
      label: "Ngày tạo (mới nhất)",
      sortFn: (a: Model, b: Model) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    },
  ];

  return (
    <div className="container mx-auto space-y-4">
      <CrudTemplate<Model, ModelRequest>
        api={modelAPI}
        columns={columns}
        formItems={formItems}
        addButtonText="Thêm model xe"
        editButtonText=""
        deleteButtonText=""
        deleteConfirmTitle="Xóa model xe"
        deleteConfirmDescription="Bạn có chắc chắn muốn xóa model xe này? Thao tác này không thể hoàn tác và sẽ ảnh hưởng đến tất cả các xe liên quan."
        successMessages={{
          create: "Model xe đã được tạo thành công!",
          update: "Model xe đã được cập nhật thành công!",
          delete: "Model xe đã được xóa thành công!",
        }}
        searchField="modelName"
        sortOptions={sortOptions}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default ModelTable;