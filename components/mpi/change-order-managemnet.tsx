"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { changeOrderApi } from "@/lib/change-order"
import { Plus, Search, Loader2, FileEdit } from "lucide-react"
import { ChangeOrder } from "@/types/mpi"

export default function ChangeOrderManagement() {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchChangeOrders()
  }, [])

  const fetchChangeOrders = async () => {
    try {
      setIsLoading(true)
      setError("")
      const orders = await changeOrderApi.findAll()
      setChangeOrders(orders)
    } catch (err) {
      console.error("Error fetching change orders:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch change orders")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = changeOrders.filter(
    (order) =>
      order.internalOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.assemblyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.description && order.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const formatEnumValue = (value: string) => {
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const getOrderTypeColor = (orderType: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-red-100 text-red-800",
      "bg-gray-100 text-gray-800",
    ]
    const orderTypes = ["LEADED_SN_PB_CLEAN", "ROHS_PB_FREE_CLEAN", "MEDICAL", "DEFENSE"]
    const index = orderTypes.indexOf(orderType) || 0
    return colors[index % colors.length]
  }

  const getLocationColor = (location: string) => {
    const colors = ["bg-emerald-100 text-emerald-800", "bg-cyan-100 text-cyan-800", "bg-indigo-100 text-indigo-800"]
    const locations = ["MILPITAS", "OVERSEAS", "CLASS_III"]
    const index = locations.indexOf(location) || 0
    return colors[index % colors.length]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading change orders...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Change Order Management</h1>
          <p className="text-gray-600">Manage manufacturing change orders and ECOs</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/mpi/change-order/create")}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Change Order
        </Button>
      </div>

      {/* Statistics Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <FileEdit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[hsl(var(--primary))]">{changeOrders.length}</div>
          <p className="text-xs text-muted-foreground">All change orders</p>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by order number, customer, assembly, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileEdit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No change orders found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search criteria." : "Get started by creating your first change order."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Assembly</TableHead>
                    <TableHead>Order Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Required By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.internalOrderNumber}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.assemblyNumber}</div>
                          <div className="text-sm text-gray-500">Rev {order.revision}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getOrderTypeColor(order.orderType)}>{formatEnumValue(order.orderType)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLocationColor(order.location)}>{formatEnumValue(order.location)}</Badge>
                      </TableCell>
                      <TableCell>
                        {order.requiredBy ? new Date(order.requiredBy).toLocaleDateString() : "Not specified"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.markComplete ? "default" : "secondary"}>
                          {order.markComplete ? "Completed" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
