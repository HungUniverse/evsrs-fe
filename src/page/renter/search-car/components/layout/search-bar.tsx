import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
function toLocalDatetimeValue(d = new Date()) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

type SearchForm = {
  location: string;
  start: string;
  end: string;
};

type Props = {
  onSearch?: (values: SearchForm) => void;
};
export default function SearchBar({ onSearch }: Props) {
  const [form, setForm] = useState<SearchForm>({
    location: "TP. Hồ Chí Minh",
    start: toLocalDatetimeValue(new Date()),
    end: toLocalDatetimeValue(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search form:", form);

    onSearch?.(form);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 mt-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border flex flex-col md:flex-row md:items-stretch overflow-hidden"
      >
        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r">
          <MapPin className="w-5 h-5 text-emerald-600" />

          <div className="flex-1">
            <label className="text-lg text-slate-400 block mb-1">
              Địa điểm
            </label>
            <Select
              value={form.location}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, location: value }))
              }
            >
              <SelectTrigger className="w-full text-lg font-medium border-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Chọn địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="TP. Hồ Chí Minh">
                    TP. Hồ Chí Minh
                  </SelectItem>
                  <SelectItem className="text-md" value="Hà Nội">
                    Hà Nội
                  </SelectItem>
                  <SelectItem className="text-md" value="Đà Nẵng">
                    Đà Nẵng
                  </SelectItem>
                  <SelectItem className="text-md" value="Cần Thơ">
                    Cần Thơ
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-[1.2] flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r">
          <CalendarDays className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <label className="text-lg text-slate-500 block mb-1">Bắt đầu</label>
            <input
              type="datetime-local"
              className="text-lg w-full font-medium outline-none"
              value={form.start}
              onChange={(e) =>
                setForm((f) => ({ ...f, start: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex-[1.2] flex items-center gap-3 px-4 py-3">
          <CalendarDays className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <label className="text-lg text-slate-500 block mb-1">
              Kết thúc
            </label>
            <input
              type="datetime-local"
              className="text-lg w-full font-medium outline-none"
              value={form.end}
              min={form.start}
              onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
            />
          </div>
        </div>

        <div className="px-10 py-3 md:p-3 flex items-center">
          <Button
            type="submit"
            className="text-base rounded-xl px-8 py-6 gap-2 min-w-[110px]"
          >
            <Search className=" w-6 h-6" />
            Tìm Xe
          </Button>
        </div>
      </form>
    </div>
  );
}
