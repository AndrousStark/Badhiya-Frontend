"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, Plus, AlertTriangle, Search, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface Product {
  id: string;
  name: string;
  category: string | null;
  price: number;
  cost_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
}

const getStatus = (p: Product) => {
  if (p.stock_quantity <= 0) return "critical" as const;
  if (p.stock_quantity <= p.low_stock_threshold) return p.stock_quantity <= p.low_stock_threshold / 2 ? "critical" as const : "low" as const;
  return "ok" as const;
};

const statusColors = {
  ok: { bg: "bg-[#E8F5EC]", text: "text-[#1B8C3A]", label: "In Stock" },
  low: { bg: "bg-[#FFF8E1]", text: "text-[#F9A825]", label: "Low Stock" },
  critical: { bg: "bg-[#FDEAEA]", text: "text-[#E53935]", label: "Critical!" },
};

export default function InventoryPage() {
  const { token, businessId } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", category: "", price: "", stockQuantity: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || !businessId) return;
    try {
      const data = await api<Product[]>(`/businesses/${businessId}/inventory/products`, { token });
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Inventory fetch failed:", e); }
    finally { setLoading(false); }
  }, [token, businessId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddProduct = async () => {
    if (!token || !businessId || !addForm.name) return;
    setSubmitting(true);
    try {
      await api(`/businesses/${businessId}/inventory/products`, {
        method: "POST", token,
        body: {
          name: addForm.name,
          category: addForm.category || undefined,
          price: addForm.price ? parseFloat(addForm.price) : undefined,
          stockQuantity: addForm.stockQuantity ? parseInt(addForm.stockQuantity) : undefined,
        },
      });
      setAddForm({ name: "", category: "", price: "", stockQuantity: "" });
      setAddOpen(false);
      await fetchData();
    } catch (e) { console.error("Add product failed:", e); }
    finally { setSubmitting(false); }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const lowCount = products.filter((p) => getStatus(p) !== "ok").length;
  const totalValue = products.reduce((s, p) => s + (p.price || 0) * p.stock_quantity, 0);
  const categories = new Set(products.map((p) => p.category).filter(Boolean));

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Inventory / Stock</h1>
          <p className="text-sm text-[#9CA3AF]">Products aur stock manage karein</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20 cursor-pointer">
                <Plus className="h-4 w-4" /> Add Product
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Naya Product Add Karein</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Product name *" value={addForm.name} onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))} />
                <Input placeholder="Category (e.g. Staples, Dairy)" value={addForm.category} onChange={(e) => setAddForm((p) => ({ ...p, category: e.target.value }))} />
                <Input type="number" placeholder="Price (MRP)" value={addForm.price} onChange={(e) => setAddForm((p) => ({ ...p, price: e.target.value }))} />
                <Input type="number" placeholder="Stock quantity" value={addForm.stockQuantity} onChange={(e) => setAddForm((p) => ({ ...p, stockQuantity: e.target.value }))} />
                <Button className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] hover:from-[#E55D00] hover:to-[#FF6B00] text-white rounded-xl shadow-md shadow-[#FF6B00]/20 h-11 cursor-pointer" onClick={handleAddProduct} disabled={submitting || !addForm.name}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Product Add Karein
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Products" value={`${products.length}`} icon={<Package className="h-5 w-5 text-[#1A56DB]" />} />
        <KpiCard title="Low Stock Alerts" value={`${lowCount}`} changeType={lowCount > 0 ? "down" : "neutral"} change={lowCount > 0 ? "Restock needed" : "All good!"} icon={<AlertTriangle className="h-5 w-5 text-[#E53935]" />} />
        <KpiCard title="Total Stock Value" value={`₹${totalValue.toLocaleString("en-IN")}`} icon={<Package className="h-5 w-5 text-[#1B8C3A]" />} />
        <KpiCard title="Categories" value={`${categories.size}`} icon={<Package className="h-5 w-5 text-[#7C3AED]" />} />
      </div>

      <div className="relative max-w-sm animate-fade-in-up-delay-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
        <Input placeholder="Product search karein..." className="pl-10 rounded-xl bg-white border-[#F0EBE3] focus:ring-2 focus:ring-[#FF6B00]/20" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 py-8 text-center">No products found. Add your first product!</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up-delay-2">
        {filtered.map((product) => {
          const status = getStatus(product);
          const config = statusColors[status];
          return (
            <Card key={product.id} className="border border-[#F0EBE3] shadow-none card-hover bg-white cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <Badge className={`text-[10px] ${config.bg} ${config.text}`}>{config.label}</Badge>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[#1A1A2E]">{product.name}</h3>
                <p className="text-xs text-gray-400">{product.category || "Uncategorized"}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-[#1A1A2E]">{product.stock_quantity}</p>
                    <p className="text-[10px] text-gray-400">in stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1A1A2E]">₹{product.price || 0}</p>
                    <p className="text-[10px] text-gray-400">MRP</p>
                  </div>
                </div>
                {status !== "ok" && (
                  <div className={`mt-3 rounded-lg ${config.bg} p-2 text-center`}>
                    <p className={`text-xs font-medium ${config.text}`}>
                      Stock: {product.stock_quantity} / Threshold: {product.low_stock_threshold}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
