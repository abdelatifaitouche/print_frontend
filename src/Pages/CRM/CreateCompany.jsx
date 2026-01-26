import React, { useState } from "react";
import { Check, Building2, Mail, Phone, MapPin } from "lucide-react";
import { createCompany } from "@/Services/CompanyService";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";

function CreateCompany() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await createCompany(formData);
      toast.success("Company created successfully!");
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create company.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-black rounded-xl">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Company</h1>
            <p className="text-gray-500 text-sm">
              Fill in the details below to register a new company
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          {/* Company Name */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <Building2 className="w-4 h-4 text-gray-600" />
              Company Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter company name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
              } focus:ring-1 focus:ring-black focus:border-transparent transition`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                <Mail className="w-4 h-4 text-gray-600" />
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="company@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
                } focus:ring-1 focus:ring-black focus:border-transparent transition`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                <Phone className="w-4 h-4 text-gray-600" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.phone ? "border-red-400 bg-red-50" : "border-gray-300"
                } focus:ring-1 focus:ring-black focus:border-transparent transition`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <MapPin className="w-4 h-4 text-gray-600" />
              Address
            </label>
            <textarea
              name="address"
              rows={3}
              placeholder="Enter full business address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.address ? "border-red-400 bg-red-50" : "border-gray-300"
              } focus:ring-1 focus:ring-black focus:border-transparent transition resize-none`}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
            )}
          </div>

          <Button
            className="w-full py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Company"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateCompany;
