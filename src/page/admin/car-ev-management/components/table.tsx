
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, Search, ArrowUpDown, Loader2, Filter, ChevronLeft, ChevronRight, MapPin, CarFront, CircleDot, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { carEVAPI } from "@/apis/car-ev.api";
import { depotAPI } from "@/apis/depot.api";
import { modelAPI } from "@/apis/model-ev.api";
import type { CarEV, CarEVRequest } from "@/@types/car/carEv";
import type { Depot } from "@/@types/car/depot";
import type { Model } from "@/@types/car/model";
import type { CarEvStatus } from "@/@types/enum";

interface CarEVFormData extends CarEVRequest {
    id?: string;
}

const statusOptions = [
    { value: "AVAILABLE", label: "Có sẵn", color: "bg-green-100 text-green-800" },
    { value: "UNAVAILABLE", label: "Không có sẵn", color: "bg-red-100 text-red-800" },
    { value: "RESERVED", label: "Đã đặt", color: "bg-yellow-100 text-yellow-800" },
    { value: "IN_USE", label: "Đang sử dụng", color: "bg-blue-100 text-blue-800" },
    { value: "REPAIRING", label: "Đang sửa chữa", color: "bg-orange-100 text-orange-800" },
];

export default function CarEVTable() {
    const [data, setData] = useState<CarEV[]>([]);
    const [depots, setDepots] = useState<Depot[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<CarEV | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<string>("none");
    const [filters, setFilters] = useState<{
        depotId: string;
        modelId: string;
        status: string;
    }>({
        depotId: "all",
        modelId: "all",
        status: "all",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CarEVFormData>();

    // Watch form values for dependent selects
    const watchedDepotId = watch("depotId");
    const watchedModelId = watch("modelId");

    // Filter and sort data (client-side filtering)
    const filteredAndSortedData = useMemo(() => {
        let filtered = data;

        // Apply search filter (search by license plate)
        if (searchTerm) {
            filtered = filtered.filter((record) =>
                record.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply depot filter
        if (filters.depotId && filters.depotId !== "all") {
            filtered = filtered.filter((record) => record.depot?.id === filters.depotId);
        }

        // Apply model filter
        if (filters.modelId && filters.modelId !== "all") {
            filtered = filtered.filter((record) => record.model?.id === filters.modelId);
        }

        // Apply status filter
        if (filters.status && filters.status !== "all") {
            filtered = filtered.filter((record) => record.status === filters.status);
        }

        // Apply sorting
        if (sortBy && sortBy !== "none") {
            filtered = [...filtered].sort((a, b) => {
                switch (sortBy) {
                    case "licensePlate":
                        return a.licensePlate.localeCompare(b.licensePlate);
                    case "modelName":
                        return (a.model?.modelName || "").localeCompare(b.model?.modelName || "");
                    case "depotName":
                        return (a.depot?.name || "").localeCompare(b.depot?.name || "");
                    case "status":
                        return a.status.localeCompare(b.status);
                    case "batteryHealth":
                        return parseFloat(a.batteryHealthPercentage) - parseFloat(b.batteryHealthPercentage);
                    case "createdAt":
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    }, [data, searchTerm, sortBy, filters]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAndSortedData.slice(startIndex, endIndex);
    }, [filteredAndSortedData, currentPage, itemsPerPage]);

    // Pagination calculations
    const totalItems = filteredAndSortedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Fetch CarEV data (only pagination, no filters)
    const fetchCarEVData = async () => {
        try {
            setLoading(true);
            const response = await carEVAPI.getAll({
                pageNumber: 1,
                pageSize: 1000
            });
            setData(response.data.items || []);
        } catch (error) {
            console.error("Error fetching CarEV data:", error);
            toast.error("Không thể tải dữ liệu xe điện");
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch depot data
    const fetchDepotData = async () => {
        try {
            const response = await depotAPI.getAll(1, 1000);
            setDepots(response.data.data.items || []);
        } catch (error) {
            console.error("Error fetching depot data:", error);
            toast.error("Không thể tải dữ liệu depot");
        }
    };

    // Fetch model data
    const fetchModelData = async () => {
        try {
            const response = await modelAPI.getAll(1, 1000);
            setModels(response.data.data.items || []);
        } catch (error) {
            console.error("Error fetching model data:", error);
            toast.error("Không thể tải dữ liệu model");
        }
    };


    // Create or Update data
    const onSubmit = async (values: CarEVFormData) => {
        try {
            const { id, ...formData } = values;

            if (id) {
                // Update existing record
                await carEVAPI.update(id, formData);
                toast.success("Cập nhật xe điện thành công!");
            } else {
                // Create new record
                await carEVAPI.create(formData);
                toast.success("Thêm xe điện thành công!");
            }

            setOpen(false);
            reset();
            fetchCarEVData();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Không thể lưu xe điện");
        }
    };

    // Helper function to set form values
    const setFormValues = (record: CarEV) => {
        setValue("id", record.id);
        setValue("modelId", record.model?.id || "");
        setValue("depotId", record.depot?.id || "");
        setValue("licensePlate", record.licensePlate);
        setValue("batteryHealthPercentage", record.batteryHealthPercentage);
        setValue("status", record.status);
    };

    // Edit data
    const handleEdit = (record: CarEV) => {
        setSelectedRecord(record);
        reset();
        setTimeout(() => {
            setFormValues(record);
        }, 0);
        setOpen(true);
    };

    // Delete data
    const handleDelete = async () => {
        if (!selectedRecord?.id) return;

        try {
            await carEVAPI.delete(selectedRecord.id);
            toast.success("Xóa xe điện thành công!");
            setDeleteDialogOpen(false);
            setSelectedRecord(null);
            fetchCarEVData();
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Không thể xóa xe điện");
        }
    };

    // Open delete dialog
    const openDeleteDialog = (record: CarEV) => {
        setSelectedRecord(record);
        setDeleteDialogOpen(true);
    };

    // Close dialog
    const closeDialog = () => {
        setOpen(false);
        setSelectedRecord(null);
        reset();
    };

    // Handle depot filter change
    const handleDepotFilterChange = (depotId: string) => {
        setFilters(prev => ({ ...prev, depotId }));
        setCurrentPage(1);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchTerm("");
        setFilters({
            depotId: "all",
            modelId: "all",
            status: "all",
        });
        setSortBy("none");
        setCurrentPage(1);
    };

    // Handle filter changes (reset to page 1)
    const handleModelFilterChange = (modelId: string) => {
        setFilters(prev => ({ ...prev, modelId }));
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (status: string) => {
        setFilters(prev => ({ ...prev, status }));
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Get status badge
    const getStatusBadge = (status: CarEvStatus) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        return (
            <Badge className={statusOption?.color || "bg-gray-100 text-gray-800"}>
                {statusOption?.label || status}
            </Badge>
        );
    };

    // Fetch all data once on mount
    useEffect(() => {
        fetchCarEVData();
        fetchDepotData();
        fetchModelData();
    }, []);

    // Reset to page 1 when search term or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

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
                            placeholder="Tìm kiếm theo biển số xe..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Add Button */}
                    <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Thêm xe điện
                    </Button>
                </div>

                {/* Filter and Sort Row */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
                    {/* Filter Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Lọc theo:</span>

                        {/* Station (Depot) Filter */}
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="p-2 rounded-md bg-gray-100 text-gray-700">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Trạm xe điện
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Select
                                value={filters.depotId}
                                onValueChange={handleDepotFilterChange}
                            >
                                <SelectTrigger className="w-[220px] h-9">
                                    <SelectValue placeholder="Chọn trạm xe điện" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạm xe điện</SelectItem>
                                    {depots.map((depot) => (
                                        <SelectItem key={depot.id} value={depot.id}>
                                            {depot.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Model Filter */}
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="p-2 rounded-md bg-gray-100 text-gray-700">
                                            <CarFront className="h-4 w-4" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Model xe
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Select
                                value={filters.modelId}
                                onValueChange={handleModelFilterChange}
                            >
                                <SelectTrigger className="w-[220px] h-9">
                                    <SelectValue placeholder="Chọn model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả model</SelectItem>
                                    {models.map((model) => (
                                        <SelectItem key={model.id} value={model.id}>
                                            {model.modelName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="p-2 rounded-md bg-gray-100 text-gray-700">
                                            <CircleDot className="h-4 w-4" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Trạng thái
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Select
                                value={filters.status}
                                onValueChange={handleStatusFilterChange}
                            >
                                <SelectTrigger className="w-[220px] h-9">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Sắp xếp theo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Không sắp xếp</SelectItem>
                                    <SelectItem value="licensePlate">Biển số xe</SelectItem>
                                    <SelectItem value="modelName">Tên model</SelectItem>
                                    <SelectItem value="depotName">Tên depot</SelectItem>
                                    <SelectItem value="status">Trạng thái</SelectItem>
                                    <SelectItem value="batteryHealth">Tình trạng pin</SelectItem>
                                    <SelectItem value="createdAt">Ngày tạo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Clear Filters Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                            className="flex items-center gap-2 group text-red-600 hover:text-red-700 border-red-600 hover:bg-red-50 sm:ml-auto"
                        >
                            <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                            Đặt lại bộ lọc
                        </Button>
                    </div>


                </div>
            </div>

            {/* Data table section */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hình ảnh</TableHead>
                            <TableHead>Biển số xe</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>Trạm xe điện</TableHead>
                            <TableHead>Tình trạng pin (%)</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Ngày cập nhật</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="w-[100px]">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Đang tải...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredAndSortedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">
                                    {searchTerm || (filters.depotId && filters.depotId !== "all") || (filters.modelId && filters.modelId !== "all") || (filters.status && filters.status !== "all")
                                        ? "Không tìm thấy kết quả phù hợp"
                                        : "Không có dữ liệu"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        {record.model?.image ? (
                                            <img
                                                src={record.model.image}
                                                alt={record.model.modelName || "Model image"}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                                                Không có ảnh
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {record.licensePlate}
                                    </TableCell>
                                    <TableCell>{record.model?.modelName || "N/A"}</TableCell>
                                    <TableCell>{record.depot?.name || "N/A"}</TableCell>
                                    <TableCell>{record.batteryHealthPercentage}%</TableCell>
                                    <TableCell>
                                        {new Date(record.createdAt).toLocaleString('vi-VN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                            timeZone: 'Asia/Ho_Chi_Minh'
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(record.updatedAt).toLocaleString('vi-VN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                            timeZone: 'Asia/Ho_Chi_Minh'
                                        })}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(record)}
                                                className="flex items-center gap-1"
                                            >
                                                <Edit2 className="h-3 w-3" />
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => openDeleteDialog(record)}
                                                className="flex items-center gap-1"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Xóa
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {!loading && filteredAndSortedData.length > 0 && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{startItem}</span> - {" "}
                        <span className="font-medium">{endItem}</span> của{" "}
                        <span className="font-medium">{totalItems}</span> kết quả
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Trước
                        </Button>
                        <span className="text-sm text-gray-700">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1"
                        >
                            Sau
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

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
                            {selectedRecord ? `Sửa xe điện` : `Thêm xe điện mới`}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRecord
                                ? "Thay đổi thông tin xe điện tại đây. Nhấn lưu khi bạn hoàn thành."
                                : "Thêm mới một xe điện vào hệ thống. Điền đầy đủ các trường bắt buộc."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                        <div className="space-y-4 flex-1 overflow-y-auto">
                            {/* Model Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="modelId">
                                    Model xe <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Select
                                    value={watchedModelId || ""}
                                    onValueChange={(value) => setValue("modelId", value)}
                                    disabled={!!selectedRecord}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn model xe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {models.map((model) => (
                                            <SelectItem key={model.id} value={model.id}>
                                                {model.modelName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.modelId && (
                                    <p className="text-sm text-red-500">
                                        {errors.modelId?.message as string}
                                    </p>
                                )}
                            </div>

                            {/* Depot Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="depotId">
                                    Trạm xe điện <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Select
                                    value={watchedDepotId || ""}
                                    onValueChange={(value) => setValue("depotId", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạm xe điện" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {depots.map((depot) => (
                                            <SelectItem key={depot.id} value={depot.id}>
                                                {depot.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.depotId && (
                                    <p className="text-sm text-red-500">
                                        {errors.depotId?.message as string}
                                    </p>
                                )}
                            </div>

                            {/* License Plate */}
                            <div className="space-y-2">
                                <Label htmlFor="licensePlate">
                                    Biển số xe <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                    id="licensePlate"
                                    placeholder="Nhập biển số xe"
                                    disabled={!!selectedRecord}
                                    {...register("licensePlate", {
                                        required: "Biển số xe là bắt buộc",
                                    })}
                                    className={errors.licensePlate ? "border-red-500" : ""}
                                />
                                {errors.licensePlate && (
                                    <p className="text-sm text-red-500">
                                        {errors.licensePlate?.message as string}
                                    </p>
                                )}
                            </div>

                            {/* Battery Health */}
                            <div className="space-y-2">
                                <Label htmlFor="batteryHealthPercentage">
                                    Tình trạng pin (%) <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                    id="batteryHealthPercentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="Nhập tình trạng pin (0-100)"
                                    {...register("batteryHealthPercentage", {
                                        required: "Tình trạng pin là bắt buộc",
                                        min: { value: 0, message: "Tình trạng pin phải >= 0" },
                                        max: { value: 100, message: "Tình trạng pin phải <= 100" },
                                    })}
                                    className={errors.batteryHealthPercentage ? "border-red-500" : ""}
                                />
                                {errors.batteryHealthPercentage && (
                                    <p className="text-sm text-red-500">
                                        {errors.batteryHealthPercentage?.message as string}
                                    </p>
                                )}
                            </div>

                            {/* Status Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="status">
                                    Trạng thái <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Select
                                    value={watch("status") || ""}
                                    onValueChange={(value) => setValue("status", value as CarEvStatus)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-red-500">
                                        {errors.status?.message as string}
                                    </p>
                                )}
                            </div>
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
                        <DialogTitle>Xóa xe điện</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa xe điện này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
