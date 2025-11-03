/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CrudAPI, FormItem, SortOption, FilterOption } from "@/@types/api.interface";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit2, Trash2, Plus, Search, ArrowUpDown, Loader2, Filter, RotateCcw } from "lucide-react";

// Types
interface BaseRecord extends FieldValues {
    id?: string | number;
    [key: string]: unknown;
}

interface Column<T = BaseRecord> {
    key: string;
    title: string;
    dataIndex: string;
    render?: (value: unknown, record: T) => React.ReactNode;
}

interface CrudTemplateProps<T extends FieldValues = BaseRecord, TRequest = Partial<T>> {
    columns: Column<T>[];
    api: CrudAPI<T, TRequest>;
    formItems: FormItem<T>[];
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
    searchField?: string; // Field to search by (default: 'name')
    sortOptions?: SortOption<T>[];
    filterOptions?: FilterOption<T>[];
}

const CrudTemplate = <T extends FieldValues = BaseRecord, TRequest = Partial<T>>({
    columns,
    api,
    formItems,
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
    searchField = "name",
    sortOptions = [],
    filterOptions = [],
}: CrudTemplateProps<T, TRequest>) => {
    const [data, setData] = useState<T[]>([]);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<string>("none");
    const [filters, setFilters] = useState<Record<string, string>>({});

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<T>();

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filtered = data;

        // Apply search filter
        if (searchTerm) {
            filtered = data.filter((record) => {
                const searchValue = record[searchField];
                if (typeof searchValue === 'string') {
                    return searchValue.toLowerCase().includes(searchTerm.toLowerCase());
                }
                return false;
            });
        }

        // Apply additional filters
        Object.entries(filters).forEach(([field, value]) => {
            if (value && value !== "all") {
                filtered = filtered.filter((record) => {
                    const fieldValue = record[field];
                    const filterValue = value;
                    
                    // Convert both to strings for comparison
                    const fieldStr = String(fieldValue);
                    const filterStr = String(filterValue);
                    
                    // Use exact match for numeric IDs, substring match for text
                    if (!isNaN(Number(fieldValue)) && !isNaN(Number(value))) {
                        // Exact match for numeric values
                        return fieldStr === filterStr;
                    } else {
                        // Substring match for text values
                        return fieldStr.toLowerCase().includes(filterStr.toLowerCase());
                    }
                });
            }
        });

        // Apply sorting
        if (sortBy && sortBy !== "none" && sortOptions.length > 0) {
            const sortOption = sortOptions.find(option => option.value === sortBy);
            if (sortOption) {
                filtered = [...filtered].sort(sortOption.sortFn as (a: BaseRecord, b: BaseRecord) => number);
            }
        }

        return filtered;
    }, [data, searchTerm, sortBy, searchField, sortOptions, filters]);

    //Read data from API
    const fetchData = async () => {
        try {
            setLoading(true);
            console.log("Fetching data from API...");
            const response = await api.getAll();
            console.log(response.data);

            // Handle response structure - ListBaseResponse has data.items
            let responseData: T[];
            if (response.data && response.data.data && response.data.data.items) {
                // ListBaseResponse structure: { data: { items: [], totalCount: number } }
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
    const onSubmit = async (values: T) => {
        try {
            let response;
            const { id, ...formData } = values;

            if (id) {
                // Update existing record
                response = await api.update(String(id), formData as TRequest);
                toast.success(successMessages.update);
            } else {
                // Create new record
                response = await api.create(formData as TRequest);
                toast.success(successMessages.create);
            }

            console.log(response);
            setOpen(false);
            reset();
            fetchData();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to save item");
        }
    };

    // Helper function to set form values
    const setFormValues = (record: T) => {
        Object.keys(record).forEach((key) => {
            const value = record[key as keyof T];
            setValue(key as any, value as any);
        });
    };

    //Edit data
    const handleEdit = (record: T) => {
        setSelectedRecord(record);

        // Reset form first to clear any previous data
        reset();

        // Set form values after a short delay to ensure form is reset
        setTimeout(() => {
            setFormValues(record);
        }, 0);

        setOpen(true);
    };

    //Delete data
    const handleDelete = async () => {
        if (!selectedRecord?.id) return;

        try {
            await api.delete(String(selectedRecord.id));
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
    const openDeleteDialog = (record: T) => {
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
    const renderFormItem = (item: FormItem<T>) => {
        if (item.render) {
            return item.render({ register, setValue, getValues });
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
                    {...register(item.name as any, {
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
            {/* Search, Filter, Sort Controls and Add Button */}
            <div className="space-y-4">
                {/* Top Row: Search and Add Button */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder={`Tìm kiếm theo ${searchField}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Add Button */}
                    <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {addButtonText}
                    </Button>
                </div>

                {/* Filter and Sort Row */}
                {(filterOptions.length > 0 || sortOptions.length > 0) && (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
                        {/* Filter Controls */}
                        {filterOptions.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <Filter className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">Lọc theo:</span>
                                {filterOptions.map((filter) => (
                                    <div key={String(filter.field)} className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{filter.label}:</span>
                                        {filter.type === "select" && filter.options ? (
                                            <Select 
                                                value={filters[String(filter.field)] || "all"} 
                                                onValueChange={(value) => 
                                                    setFilters(prev => ({ ...prev, [String(filter.field)]: value }))
                                                }
                                            >
                                                <SelectTrigger className="w-[150px]">
                                                    <SelectValue placeholder={`Chọn ${filter.label.toLowerCase()}`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Tất cả</SelectItem>
                                                    {filter.options.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input
                                                placeholder={`Nhập ${filter.label.toLowerCase()}`}
                                                value={filters[String(filter.field)] || ""}
                                                onChange={(e) => 
                                                    setFilters(prev => ({ ...prev, [String(filter.field)]: e.target.value }))
                                                }
                                                className="w-[150px]"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sort Dropdown */}
                        {sortOptions.length > 0 && (
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Sắp xếp theo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Không sắp xếp</SelectItem>
                                        {sortOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Reset Filters Button - always visible (disabled when nothing active) */}
                        {(() => {
                            const hasActive = Boolean(
                                searchTerm || sortBy !== "none" || Object.values(filters).some(v => v && v !== "all")
                            );
                            return (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setSearchTerm(""); setSortBy("none"); setFilters({}); }}
                                    disabled={!hasActive}
                                    className="group text-red-600 hover:text-red-700 border-red-600 hover:bg-red-50 sm:ml-auto"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-180" />
                                    Đặt lại bộ lọc
                                </Button>
                            );
                        })()}
                    </div>
                )}
            </div>
            {/* Data table section */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key}>{column.title}</TableHead>
                            ))}
                            <TableHead className="w-[100px]">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Đang tải dữ liệu...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredAndSortedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                                    {searchTerm ? "Không tìm thấy kết quả phù hợp" : "No data available"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedData.map((record, index) => (
                                <TableRow key={String(record.id || record.Id || `row-${index}`)}>
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
            <Dialog open={open} onOpenChange={(openState) => {
                if (!openState) {
                    closeDialog();
                } else {
                    setOpen(openState);
                }
            }}>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle>
                            {selectedRecord ? `Sửa` : `Thêm mới`}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRecord
                                ? "Thay đổi thông tin của item tại đây. Nhấn lưu khi bạn hoàn thành."
                                : "Thêm mới một item vào hệ thống. Điền đầy đủ các trường bắt buộc."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                        <div className="space-y-4 flex-1 overflow-y-auto">
                            {formItems.map(renderFormItem)}
                        </div>
                        <DialogFooter className="flex-shrink-0 mt-4">
                            <Button type="button" variant="outline" onClick={closeDialog}>
                                Hủy
                            </Button>
                            <Button type="submit">
                                {selectedRecord ? "Cập nhật" : "Thêm mới"}
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
