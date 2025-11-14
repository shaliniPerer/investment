"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AdminSidebar from "@/components/admin-sidebar"
import { Check, X, Users } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [withdrawalRequests, setWithdrawalRequests] = useState([
    { id: 1, investorName: "John Doe", amount: 5000, status: "pending", email: "john@example.com" },
    { id: 2, investorName: "Jane Smith", amount: 10000, status: "pending", email: "jane@example.com" },
    { id: 3, investorName: "Bob Johnson", amount: 7500, status: "pending", email: "bob@example.com" },
  ])

  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/auth/admin-login")
      return
    }
    setAdmin(JSON.parse(adminData))
  }, [router])

  const handleApprove = (id: number) => {
    setWithdrawalRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req)))
  }

  const handleReject = (id: number) => {
    setWithdrawalRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)))
  }

  if (!admin) return null

  const investors = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 111-1111",
      bankAccount: "****1234",
      invested: "$50,000",
      rate: "2.5%",
      earned: "$5,000",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 222-2222",
      bankAccount: "****5678",
      invested: "$75,000",
      rate: "2.5%",
      earned: "$7,500",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1 (555) 333-3333",
      bankAccount: "****9012",
      invested: "$100,000",
      rate: "2.5%",
      earned: "$10,000",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage investors and process withdrawal requests</p>
          </div>

          {/* Admin Profile Card */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Admin Profile
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Admin Name</p>
                <p className="text-foreground font-medium">{admin.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="text-foreground font-medium">{admin.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <p className="text-foreground font-medium">+1 (555) 999-9999</p>
              </div>
            </div>
          </Card>

          {/* Investors Table */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">All Investors</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Phone</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Bank Account</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Invested</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Rate</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {investors.map((investor) => (
                    <tr key={investor.id} className="border-b border-border hover:bg-secondary/50 transition">
                      <td className="py-3 px-2 text-foreground">{investor.name}</td>
                      <td className="py-3 px-2 text-foreground">{investor.email}</td>
                      <td className="py-3 px-2 text-foreground">{investor.phone}</td>
                      <td className="py-3 px-2 text-foreground">{investor.bankAccount}</td>
                      <td className="py-3 px-2 text-foreground font-medium">{investor.invested}</td>
                      <td className="py-3 px-2 text-foreground">{investor.rate}</td>
                      <td className="py-3 px-2 text-foreground font-medium text-primary">{investor.earned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Withdrawal Requests */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Withdrawal Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Investor Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((request) => (
                    <tr key={request.id} className="border-b border-border hover:bg-secondary/50 transition">
                      <td className="py-3 px-2 text-foreground">{request.investorName}</td>
                      <td className="py-3 px-2 text-foreground">{request.email}</td>
                      <td className="py-3 px-2 text-foreground font-medium">${request.amount.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                              : request.status === "approved"
                                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                : "bg-red-500/20 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {request.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(request.id)}
                              className="gap-1"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(request.id)}
                              className="gap-1 text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
