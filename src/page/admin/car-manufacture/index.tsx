import React from "react";
import CrudTemplate from "@/page/admin/components/crud-template";
import { Badge } from "@/components/ui/badge";

const CarManufacturePage: React.FC = () => {
  // Define table columns
  const columns = [
    {
      key: "Name",
      title: "Manufacturer Name",
      dataIndex: "name",
    },
    {
      key: "Logo",
      title: "Logo",
      dataIndex: "logo",
      render: (value: unknown) => (
        value ? (
          <img src={value as string} alt="Logo" className="w-8 h-8 object-contain" />
        ) : (
          <span className="text-muted-foreground">No logo</span>
        )
      ),
    },
    {
      key: "IsDeleted",
      title: "Is Deleted",
      dataIndex: "isDeleted",
      render: (value: unknown) => (
        <Badge variant={!value ? "default" : "secondary"}>
          {!value ? "Not Deleted" : "Deleted"}
        </Badge>
      ),
    },
    {
      key: "CreatedAt",
      title: "Created At",
      dataIndex: "createdAt",
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "UpdatedAt",
      title: "Updated At",
      dataIndex: "updatedAt",
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
  ];

  // Define form fields
  const formItems = [
    {
      name: "Name",
      label: "Manufacturer Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter manufacturer name",
    },
    {
      name: "Logo",
      label: "Logo URL",
      type: "text" as const,
      required: false,
      placeholder: "Enter logo URL (optional)",
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <CrudTemplate
        title="Car Manufacturer Management"
        apiURL="/api/CarManufacture"
        columns={columns}
        formItems={formItems}
        addButtonText="Add Manufacturer"
        editButtonText="Edit"
        deleteButtonText="Delete"
        deleteConfirmTitle="Delete Manufacturer"
        deleteConfirmDescription="Are you sure you want to delete this manufacturer? This action cannot be undone and will affect all associated car models."
        successMessages={{
          create: "Manufacturer created successfully!",
          update: "Manufacturer updated successfully!",
          delete: "Manufacturer deleted successfully!",
        }}
      />
    </div>
  );
};

export default CarManufacturePage;
