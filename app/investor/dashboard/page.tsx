"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import InvestorSidebar from "@/components/investor-sidebar"
import { DollarSign, TrendingUp, Wallet, Send } from "lucide-react"

export default function InvestorDashboard() {
  const router = useRouter()
  const [investor, setInvestor] = useState<any>(null)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    const investorData = localStorage.getItem("investor")
    if (!investorData) {
      router.push("/auth/login")
      return
    }
    setInvestor(JSON.parse(investorData))
  }, [router])

  const handleWithdrawalRequest = () => {
    if (!withdrawalAmount || Number.parseFloat(withdrawalAmount) <= 0) {
      return
    }

    const newRequest = {
      id: Date.now(),
      amount: Number.parseFloat(withdrawalAmount),
      status: "pending",
      date: new Date().toLocaleDateString(),
    }

    setRequests([...requests, newRequest])
    setWithdrawalAmount("")
  }

  if (!investor) return null

  return (
    <div className="flex min-h-screen bg-background">
      <InvestorSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {investor.name}</h1>
            <p className="text-muted-foreground">Manage your investments and track your returns</p>
          </div>

          {/* Investment Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Invested Amount</p>
                  <p className="text-2xl font-bold text-foreground">$50,000</p>
                </div>
                <Wallet className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monthly Interest Rate</p>
                  <p className="text-2xl font-bold text-foreground">2.5%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Interest Earned</p>
                  <p className="text-2xl font-bold text-foreground">$5,000</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">$55,000</p>
                </div>
                <Wallet className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="text-foreground font-medium">{investor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="text-foreground font-medium">{investor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="text-foreground font-medium">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-foreground font-medium">January 2024</p>
                </div>
              </div>
            </Card>

            {/* Withdrawal Request Section */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Request Withdrawal</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleWithdrawalRequest}
                  disabled={!withdrawalAmount}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Request
                </Button>
                <p className="text-xs text-muted-foreground">
                  Requests are typically processed within 2-3 business days.
                </p>
              </div>
            </Card>
          </div>

          {/* Withdrawal History */}
          {requests.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Withdrawal History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Date</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Amount</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b border-border">
                        <td className="py-3 px-2 text-foreground">{req.date}</td>
                        <td className="py-3 px-2 text-foreground font-medium">${req.amount.toFixed(2)}</td>
                        <td className="py-3 px-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
