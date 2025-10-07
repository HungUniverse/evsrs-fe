import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PartiesInfo from './components/PartiesInfo';
import InspectionDetails from './components/InspectionDetails';
import PaymentContract from './components/PaymentContract';
import { mockContracts } from '@/mockdata/mock-contract';
import type { Contract } from '@/@types/contract';

const HandoverInspection: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (orderId) {
          const foundContract = mockContracts.find(c => c.orderId === orderId);
          if (foundContract) {
            setContract(foundContract);
          } else {
            setError('Không tìm thấy hợp đồng');
          }
        } else {
          // Default to first contract if no ID provided
          setContract(mockContracts[0]);
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu hợp đồng');
        console.error('Error fetching contract:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu biên bản...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Không thể tải biên bản</h3>
          <p className="text-gray-600 mb-4">{error || 'Biên bản không tồn tại'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header giống hệt như trong ảnh */}
      <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
            <h2 className="text-xl font-bold uppercase">Độc lập – Tự do – Hạnh phúc</h2>
            <div className="text-lg">---oOo---</div>
            <div className="text-sm text-gray-600 text-right">
              ............., Ngày ...... tháng ...... năm ......
            </div>
          </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold uppercase text-gray-800">BIÊN BẢN GIAO & NHẬN XE</h3>
          <div className="text-lg font-medium">
            ---Số: ....../BBGN---
          </div>
        </div>
      </div>

      {/* Component 1: Thông tin các bên và xe (phần 1, 2, 3) */}
      <PartiesInfo contract={contract} />

      {/* Component 2: Chi tiết kiểm tra (phần 4, 5, 6) */}
      <InspectionDetails contract={contract} />

      {/* Component 3: Thanh toán và cam kết (phần 7, 8) */}
      <PaymentContract contract={contract} />

      {/* Footer với chữ ký giống như trong ảnh */}
      <div className="grid grid-cols-2 gap-8 mt-12">
        <div className="text-center">
          <div className="font-semibold text-gray-800 mb-2">ĐẠI DIỆN BÊN A</div>
          <div className="text-sm text-gray-600 mb-2">(Bên giao xe)</div>
          <div className="text-sm text-gray-600">(Ký, ghi rõ họ tên, đóng dấu nếu có)</div>
          <div className="border-b border-gray-300 h-16 mt-2"></div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-800 mb-2">ĐẠI DIỆN BÊN B</div>
          <div className="text-sm text-gray-600 mb-2">(Bên thuê)</div>
          <div className="text-sm text-gray-600">(Ký, ghi rõ họ tên)</div>
          <div className="border-b border-gray-300 h-16 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default HandoverInspection;
