// RawMaterialCreatePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { toast } from "sonner";
import { createRawMaterial } from "@/Services/StockService";

function RawMaterialCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !stockQuantity || !costPerUnit) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createRawMaterial({
        name,
        stock_quantity: parseFloat(stockQuantity),
        cost_per_unit: parseFloat(costPerUnit),
      });
      toast.success("Raw material created successfully");
      navigate("/stock");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create raw material");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg rounded-xl border border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Raw Material</CardTitle>
          <CardDescription className="text-gray-500">
            Fill in the details to add a new raw material.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Name</label>
              <Input
                placeholder="Material name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Stock Quantity</label>
              <Input
                type="number"
                placeholder="e.g. 100"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Cost per Unit</label>
              <Input
                type="number"
                placeholder="e.g. 200"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/stock")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Create Material"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RawMaterialCreatePage;
