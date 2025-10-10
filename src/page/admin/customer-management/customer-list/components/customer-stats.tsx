// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useCustomerStore } from "@/lib/zustand/use-customer-store";

// export function CustomerStats() {
//   const customers = useCustomerStore((s) => s.customers);
//   const totalCustomers = customers.length;
//   const verifiedCustomers = customers.filter(customer => customer.verificationStatus === "Verified").length;
//   const pendingCustomers = customers.filter(customer => customer.verificationStatus === "Pending").length;
//   const bannedCustomers = customers.filter(customer => customer.isActive === false).length;

//   // Since Customer interface doesn't have totalSpent, we'll use totalRentals as a proxy for activity
//   const totalRentals = customers.reduce((sum, customer) => sum + customer.totalRentals, 0);
//   const averageRentals = totalRentals / totalCustomers;

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             className="h-4 w-4 text-muted-foreground"
//           >
//             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//             <circle cx="9" cy="7" r="4" />
//           </svg>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold" style={{color: '#00D166'}}>{totalCustomers}</div>
//           <p className="text-xs text-muted-foreground">
//             {verifiedCustomers} đã xác thực
//           </p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Chờ xác thực</CardTitle>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             className="h-4 w-4 text-muted-foreground"
//           >
//             <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
//           </svg>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold" style={{color: '#00D166'}}>{pendingCustomers}</div>
//           <p className="text-xs text-muted-foreground">
//             {Math.round((pendingCustomers / totalCustomers) * 100)}% tổng số
//           </p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Tổng lượt thuê</CardTitle>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             className="h-4 w-4 text-muted-foreground"
//           >
//             <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//           </svg>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold" style={{color: '#00D166'}}>{totalRentals}</div>
//           <p className="text-xs text-muted-foreground">
//             Trung bình: {averageRentals.toFixed(1)} lượt/khách
//           </p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Tình trạng tài khoản</CardTitle>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             className="h-4 w-4 text-muted-foreground"
//           >
//             <path d="M9 12l2 2 4-4" />
//             <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
//             <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
//             <path d="M13 12h3l2 4v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2l2-4h3" />
//           </svg>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold" style={{color: '#00D166'}}>{totalCustomers - bannedCustomers}</div>
//           <p className="text-xs text-muted-foreground">
//             {bannedCustomers} bị khóa
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
