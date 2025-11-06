/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import CrudTemplate from "@/page/admin/components/crud-template";
import { Badge } from "@/components/ui/badge";
import { CarManufactureAPI } from "@/apis/manufacture.api";
import type { CarManufacture, CarManufactureRequest } from "@/@types/car/carManufacture";
import type { FormItem } from "@/@types/api.interface";
import { uploadFileToCloudinary } from "@/lib/utils/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

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
    {
      key: "IsDeleted",
      title: "Trạng thái",
      dataIndex: "isDeleted",
      render: (value: unknown, _record: CarManufacture) => (
        <Badge variant={!value ? "default" : "secondary"}>
          {!value ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  type LogoUploaderMethods = {
    register: UseFormRegister<CarManufacture>;
    setValue: UseFormSetValue<CarManufacture>;
    getValues: UseFormGetValues<CarManufacture>;
    watch: UseFormWatch<CarManufacture>;
  };

  const LogoUploader: React.FC<{ methods: LogoUploaderMethods }> = ({ methods }) => {
    const field = methods.register("logo");
    const [previewUrl, setPreviewUrl] = React.useState<string>("");
    const [isUploading, setIsUploading] = React.useState<boolean>(false);

    const logoValue = methods.watch("logo");
    React.useEffect(() => {
      const initial = (logoValue as unknown as string) || "";
      setPreviewUrl(initial);
    }, [logoValue]);

    const onFileSelected = async (file?: File) => {
      if (!file) return;
      try {
        setIsUploading(true);
        const url = await uploadFileToCloudinary(file);
        methods.setValue("logo", url, { shouldValidate: true, shouldDirty: true });
        setPreviewUrl(url);
        field.onChange({ target: { name: field.name, value: url } });
      } catch {
        // no-op
      } finally {
        setIsUploading(false);
      }
    };

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const file = e.target.files?.[0];
      void onFileSelected(file);
    };

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      void onFileSelected(file);
    };

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
      e.preventDefault();
    };

    const clearImage = () => {
      setPreviewUrl("");
      methods.setValue("logo", "", { shouldDirty: true, shouldValidate: true });
      field.onChange({ target: { name: field.name, value: "" } });
    };

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Logo</label>
        <input type="hidden" {...field} />

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-accent/20"
          onClick={() => document.getElementById("logo-file-input")?.click()}
        >
          {previewUrl ? (
            <div className="flex flex-col items-center gap-2">
              <img src={previewUrl} alt="Logo preview" className="w-20 h-20 object-contain" />
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => document.getElementById("logo-file-input")?.click()} disabled={isUploading}>
                  {isUploading ? "Đang tải..." : "Thay ảnh"}
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={clearImage} disabled={isUploading}>
                  Xóa
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Kéo và thả ảnh vào đây, hoặc bấm để chọn</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
            </div>
          )}
        </div>
        <Input id="logo-file-input" type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
      </div>
    );
  };

  // Define form fields
  const formItems: FormItem<CarManufacture>[] = [
    {
      name: "name",
      label: "Tên nhà sản xuất xe",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên nhà sản xuất xe",
    },
    {
      name: "logo",
      label: "Logo",
      required: false,
      render: ({ register, setValue, getValues, watch }) => (
        <LogoUploader methods={{ register, setValue, getValues, watch }} />
      ),
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
