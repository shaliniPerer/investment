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

  // Interest rate table
  const planInterestMap: any = {
    "3": 5,
    "6": 7,
    "12": 9,
    "24": 12,
  }

  useEffect(() => {
    const investorData = localStorage.getItem("investor")
    if (!investorData) {
      router.push("/auth/login")
      return
    }
    setInvestor(JSON.parse(investorData))
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    const fetchInvestor = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/investor/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          router.push("/auth/login")
          return
        }

        const data = await res.json()
        setInvestor(data)
      } catch (err) {
        console.error("Fetch investor error:", err)
        router.push("/auth/login")
      }
    }

    fetchInvestor()
  }, [router])

  const handleWithdrawalRequest = () => {
    if (!withdrawalAmount || Number.parseFloat(withdrawalAmount) <= 0) return

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

  const investedAmount = Number(investor.amount)
  const annualInterest = planInterestMap?.[investor.plan] || 0
  const monthlyInterestRate = annualInterest / 12
  const interestEarnedYearly = (investedAmount * annualInterest) / 100
  const totalValue = investedAmount + interestEarnedYearly

  return (
    <div className="flex min-h-screen bg-background">
      <InvestorSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {investor.fullName}
            </h1>
            <p className="text-muted-foreground">Manage your investments and track your returns</p>
          </div>

          {/* Investment Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Invested Amount</p>
                  <p className="text-2xl font-bold text-foreground">
                    LKR {investedAmount.toLocaleString()}
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monthly Interest Rate</p>
                  <p className="text-2xl font-bold text-foreground">{monthlyInterestRate.toFixed(2)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Interest Earned (Annual)</p>
                  <p className="text-2xl font-bold text-foreground">
                    LKR {interestEarnedYearly.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Value After 1 Year</p>
                  <p className="text-2xl font-bold text-foreground">
                    LKR {totalValue.toLocaleString()}
                  </p>
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
                <p><strong>Full Name:</strong> {investor.fullName}</p>
                <p><strong>NIC:</strong> {investor.nic}</p>
                <p><strong>Address:</strong> {investor.address}</p>
                <p><strong>District:</strong> {investor.district}</p>
                <p><strong>Province:</strong> {investor.province}</p>
                <p><strong>Postal Code:</strong> {investor.postalCode}</p>
                <p><strong>Phone:</strong> {investor.phone}</p>
                <p><strong>Email:</strong> {investor.email}</p>
                <p><strong>Investment Plan:</strong> {investor.plan} Months</p>
                <p><strong>Invested Amount:</strong> LKR {investedAmount.toLocaleString()}</p>
                <p><strong>Bank Name:</strong> {investor.bankName}</p>
                <p><strong>Account No:</strong> {investor.accountNo}</p>
                <p><strong>Branch Name:</strong> {investor.branchName}</p>
              </div>
            </Card>

            {/* Withdrawal Request Section */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Request Withdrawal</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Amount (LKR)</label>
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
                        <td className="py-3 px-2 text-foreground font-medium">
                          LKR {req.amount.toLocaleString()}
                        </td>
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
