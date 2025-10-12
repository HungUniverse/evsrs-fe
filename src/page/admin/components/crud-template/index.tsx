import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/lib/axios/axios";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Trash2, Plus } from "lucide-react";

// Types
interface BaseRecord {
    id?: string | number;
    [key: string]: unknown;
}

interface Column {
    key: string;
    title: string;
    dataIndex: string;
    render?: (value: unknown, record: BaseRecord) => React.ReactNode;
}

interface FormItem {
    name: string;
    label: string;
    type?: "text" | "number" | "email" | "password" | "date";
    required?: boolean;
    placeholder?: string;
    render?: () => React.ReactNode;
}

interface CrudTemplateProps {
    columns: Column[];
    apiURL: string;
    formItems: FormItem[];
    title?: string;
    addButtonText?: string;
    editButtonText?: string;
    deleteButtonText?: string;
    deleteConfirmTitle?: string;
    deleteConfirmDescription?: string;
    successMessages?: {
        create?: string;
        update?: string;
        delete?: string;
    };
}

const CrudTemplate: React.FC<CrudTemplateProps> = ({
    columns,
    apiURL,
    formItems,
    title = "Manage Data",
    addButtonText = "Add Item",
    editButtonText = "Edit",
    deleteButtonText = "Delete",
    deleteConfirmTitle = "Delete Item",
    deleteConfirmDescription = "Are you sure you want to delete this item? This action cannot be undone.",
    successMessages = {
        create: "Item created successfully!",
        update: "Item updated successfully!",
        delete: "Item deleted successfully!",
    },
}) => {
    const [data, setData] = useState<BaseRecord[]>([]);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BaseRecord | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BaseRecord>();

    //Read data from API
    const fetchData = async () => {
        try {
            setLoading(true);
            console.log("Fetching data from API...");
            const response = await api.get(apiURL);
            console.log(response.data);

            // Handle different response structures
            let responseData;
            if (response.data && response.data.data && response.data.data.items) {
                // PaginationResponse structure: { data: { items: [], totalCount: number } }
                responseData = response.data.data.items;
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                // Direct array in data property
                responseData = response.data.data;
            } else if (Array.isArray(response.data)) {
                // Direct array response
                responseData = response.data;
            } else {
                // Fallback to empty array
                responseData = [];
            }

            setData(responseData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data");
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    //Create or Update data
    const onSubmit = async (values: BaseRecord) => {
        try {
            let response;
            const { id, ...formData } = values;

            if (id) {
                // Update existing record
                response = await api.put(`${apiURL}/${id}`, formData);
                toast.success(successMessages.update);
            } else {
                // Create new record
                response = await api.post(apiURL, formData);
                toast.success(successMessages.create);
            }

            console.log(response.data);
            setOpen(false);
            reset();
            fetchData();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to save item");
        }
    };

    //Edit data
    const handleEdit = (record: BaseRecord) => {
        setSelectedRecord(record);
        setOpen(true);

        // Set form values
        Object.keys(record).forEach((key) => {
            setValue(key, record[key]);
        });
    };

    //Delete data
    const handleDelete = async () => {
        if (!selectedRecord?.id) return;

        try {
            await api.delete(`${apiURL}/${selectedRecord.id}`);
            toast.success(successMessages.delete);
            setDeleteDialogOpen(false);
            setSelectedRecord(null);
            fetchData();
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    //Open delete dialog
    const openDeleteDialog = (record: BaseRecord) => {
        setSelectedRecord(record);
        setDeleteDialogOpen(true);
    };

    //Close dialog
    const closeDialog = () => {
        setOpen(false);
        setSelectedRecord(null);
        reset();
    };

    //Fetch data when component mounts
    useEffect(() => {
        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    //Render form item
    const renderFormItem = (item: FormItem) => {
        if (item.render) {
            return item.render();
        }

        return (
            <div key={item.name} className="space-y-2">
                <Label htmlFor={item.name}>
                    {item.label}
                    {item.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                    id={item.name}
                    type={item.type || "text"}
                    placeholder={item.placeholder}
                    {...register(item.name, {
                        required: item.required ? `${item.label} is required` : false,
                    })}
                    className={errors[item.name] ? "border-red-500" : ""}
                />
                {errors[item.name] && (
                    <p className="text-sm text-red-500">
                        {errors[item.name]?.message as string}
                    </p>
                )}
            </div>
        );
    };

    //Render table
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {addButtonText}
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key}>{column.title}</TableHead>
                            ))}
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((record, index) => (
                                <TableRow key={record.id || record.Id || index}>
                                    {columns.map((column) => (
                                        <TableCell key={column.key}>
                                            {column.render
                                                ? column.render(record[column.dataIndex], record)
                                                : String(record[column.dataIndex] || '')}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(record)}
                                                className="flex items-center gap-1"
                                            >
                                                <Edit2 className="h-3 w-3" />
                                                {editButtonText}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => openDeleteDialog(record)}
                                                className="flex items-center gap-1"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                {deleteButtonText}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedRecord ? `Edit Item` : `Create New Item`}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRecord
                                ? "Make changes to the item here. Click save when you're done."
                                : "Add a new item to the system. Fill in all required fields."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
                            {formItems.map(renderFormItem)}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeDialog}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {selectedRecord ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{deleteConfirmTitle}</DialogTitle>
                        <DialogDescription>
                            {deleteConfirmDescription}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CrudTemplate;
