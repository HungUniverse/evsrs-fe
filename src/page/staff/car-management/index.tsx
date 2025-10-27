import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { carEVAPI } from "@/apis/car-ev.api";
import { CarManufactureAPI } from "@/apis/manufacture.api";
import { UserFullAPI } from "@/apis/user.api";
import type { CarEV } from "@/@types/car/carEv";
import type { CarManufacture } from "@/@types/car/carManufacture";
import StatCard from "./components/stat-card";
import FilterCarDepot from "./components/filter-car-depot";
import { CarTable } from "./components/car-table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ViewCarDialog from "./components/view-car";

export default function CarManagementPage() {
  const { user } = useAuthStore();
  const [cars, setCars] = useState<CarEV[]>([]);
  const [manufacturers, setManufacturers] = useState<CarManufacture[]>([]);
  const [loading, setLoading] = useState(true);
  const [depotId, setDepotId] = useState<string>("");

  const [searchLicensePlate, setSearchLicensePlate] = useState("");
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [depotName, setDepotName] = useState("");

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarEV | undefined>();

  useEffect(() => {
    const fetchDepot = async () => {
      const userId = user?.userId || user?.id;
      if (!userId) {
        console.log("No user ID available. User object:", user);
        return;
      }

      try {
        console.log("Fetching depot for user:", userId);
        const userData = await UserFullAPI.getById(userId);
        console.log("User data received:", userData);

        if (userData?.depotId) {
          console.log("Setting depotId:", userData.depotId);
          setDepotId(userData.depotId);
        } else {
          console.log("No depotId found in userData");
        }

        if (userData?.depot?.name) {
          setDepotName(userData.depot.name);
        }
      } catch (error) {
        console.error("Error fetching depot:", error);
        toast.error("Không thể tải thông tin trạm");
      }
    };

    fetchDepot();
  }, [user?.id, user?.userId, user]);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await CarManufactureAPI.getAll(1, 100);
        setManufacturers(response.data.data.items || []);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
        toast.error("Không thể tải danh sách hãng xe");
      }
    };

    fetchManufacturers();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      if (!depotId) {
        console.log("No depotId, skipping car fetch");
        return;
      }

      console.log("Fetching cars for depotId:", depotId);
      setLoading(true);
      try {
        const response = await carEVAPI.getCarByDepotId(depotId);
        console.log("Cars response received:", response);
        setCars(response?.items || []);
      } catch (error) {
        console.error("Error fetching cars:", error);
        toast.error("Không thể tải danh sách xe");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [depotId]);
  const manufacturerMap = useMemo(() => {
    const map = new Map<string, CarManufacture>();
    manufacturers.forEach((m) => map.set(m.id, m));
    return map;
  }, [manufacturers]);

  const filteredCars = useMemo(() => {
    if (!Array.isArray(cars)) return [];

    return cars.filter((car) => {
      const matchLicensePlate =
        searchLicensePlate === "" ||
        car.licensePlate
          ?.toLowerCase()
          .includes(searchLicensePlate.toLowerCase());

      const matchManufacturer =
        selectedManufacturerId === "all" ||
        car.model?.manufacturerCarId === selectedManufacturerId;

      const matchStatus =
        selectedStatus === "all" || car.status === selectedStatus;

      return matchLicensePlate && matchManufacturer && matchStatus;
    });
  }, [cars, searchLicensePlate, selectedManufacturerId, selectedStatus]);

  const stats = useMemo(() => {
    if (!Array.isArray(cars)) {
      return {
        totalCars: 0,
        availableCars: 0,
        inUseCars: 0,
        reservedCars: 0,
        fixingCars: 0,
        unavailableCars: 0,
      };
    }

    const totalCars = cars.length;
    const availableCars = cars.filter((c) => c.status === "AVAILABLE").length;
    const inUseCars = cars.filter((c) => c.status === "IN_USE").length;
    const reservedCars = cars.filter((c) => c.status === "RESERVED").length;
    const fixingCars = cars.filter((c) => c.status === "REPAIRING").length;
    const unavailableCars = cars.filter(
      (c) => c.status === "UNAVAILABLE"
    ).length;

    return {
      totalCars,
      availableCars,
      inUseCars,
      reservedCars,
      fixingCars,
      unavailableCars,
    };
  }, [cars]);

  const handleReset = () => {
    setSearchLicensePlate("");
    setSelectedManufacturerId("all");
    setSelectedStatus("all");
  };

  const handleView = (car: CarEV) => {
    setSelectedCar(car);
    setViewDialogOpen(true);
  };

  const handleEdit = (car: CarEV) => {
    setSelectedCar(car);
    setEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý đội xe trong trạm
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi tình trạng các xe trong trạm của bạn
          </p>
        </div>

        {/* Statistics Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : (
          <StatCard
            totalCars={stats.totalCars}
            availableCars={stats.availableCars}
            inUseCars={stats.inUseCars}
            reservedCars={stats.reservedCars}
            fixingCars={stats.fixingCars}
            unavailableCars={stats.unavailableCars}
          />
        )}

        {/* Filters */}
        <FilterCarDepot
          searchTerm={searchLicensePlate}
          onSearchTermChange={setSearchLicensePlate}
          selectManufacturer={selectedManufacturerId}
          onManufacturerChange={setSelectedManufacturerId}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onReset={handleReset}
          manufacturers={manufacturers}
          manufacturerMap={manufacturerMap}
          depotName={depotName}
        />

        {/* Car Table */}
        <CarTable
          cars={filteredCars}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          manufacturerMap={manufacturerMap}
        />

        {/* View Dialog - Placeholder */}
        <ViewCarDialog
          viewDialogOpen={viewDialogOpen}
          setViewDialogOpen={setViewDialogOpen}
          selectedCar={selectedCar}
        />

        {/* Edit Dialog - Placeholder */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Cập nhật xe</h2>
              <p className="text-gray-600">
                Chức năng cập nhật đang được phát triển
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
