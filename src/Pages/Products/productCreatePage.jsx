import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import { createProduct } from "@/Services/ProductsService";
import getRawMaterials from "@/Services/StockService";

function ProductCreatePage() {
  const navigate = useNavigate();

  const [rawMaterials, setRawMaterials] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    base_price: "",
    raw_materials: [],
  });

  /* ================= FETCH RAW MATERIALS ================= */
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await getRawMaterials();
        setRawMaterials(data || []);
      } catch {
        toast.error("Failed to load raw materials");
      }
    };
    fetchMaterials();
  }, []);

  /* ================= FORM HELPERS ================= */
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addMaterial = () => {
    setForm((prev) => ({
      ...prev,
      raw_materials: [
        ...prev.raw_materials,
        { raw_material_id: "", quantity: "" },
      ],
    }));
  };

  const updateMaterial = (index, key, value) => {
    const updated = [...form.raw_materials];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, raw_materials: updated }));
  };

  const removeMaterial = (index) => {
    const updated = [...form.raw_materials];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, raw_materials: updated }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name) {
      toast.warning("Product name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProduct({
        name: form.name,
        description: form.description,
        base_price: Number(form.base_price),
        raw_materials: form.raw_materials.map((m) => ({
          raw_material_id: m.raw_material_id,
          quantity: Number(m.quantity),
        })),
      });

      toast.success("Product created successfully");
      navigate("/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Create Product
          </h1>
          <p className="text-muted-foreground">
            Define product details and required raw materials
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>

      {/* FORM */}
      <div className="bg-background border rounded-xl p-6 space-y-8">
        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Business Card - Matte"
            />
          </div>

          <div>
            <Label>Base Price</Label>
            <Input
              type="number"
              step="0.01"
              value={form.base_price}
              onChange={(e) => updateField("base_price", e.target.value)}
              placeholder="0.50"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="300gsm premium card"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
        </div>

        {/* RAW MATERIALS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Raw Materials</h3>
            <Button size="sm" variant="outline" onClick={addMaterial}>
              <Plus className="w-4 h-4 mr-1" />
              Add Material
            </Button>
          </div>

          {form.raw_materials.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No raw materials added yet.
            </p>
          )}

          <div className="space-y-3">
            {form.raw_materials.map((material, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_120px_40px] gap-2 items-end"
              >
                <Select
                  value={material.raw_material_id}
                  onValueChange={(value) =>
                    updateMaterial(index, "raw_material_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {rawMaterials.map((rm) => (
                      <SelectItem key={rm.id} value={rm.id}>
                        {rm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Qty"
                  value={material.quantity}
                  onChange={(e) =>
                    updateMaterial(index, "quantity", e.target.value)
                  }
                />

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeMaterial(index)}
                >
                  <Trash className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCreatePage;
