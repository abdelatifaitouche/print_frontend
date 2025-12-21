import React, { useState } from "react";
import { Check, Building2, Mail, Phone, MapPin } from "lucide-react";
import { createCompany } from "@/Services/CompanyService";


function CreateCompany() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Actual API call
      const response = await createCompany(formData);
      console.log("Company created:", response);
      
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
        });
        setIsSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error creating company:", error);
      setErrors({ submit: "Failed to create company. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Add New Company
            </h1>
            <p className="text-lg text-gray-600">
              Fill in the details below to register a new company
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">
            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label
                  htmlFor="name"
                  className="flex items-center text-sm font-semibold text-gray-900 mb-2"
                >
                  <Building2 className="w-4 h-4 mr-2 text-gray-700" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email and Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="flex items-center text-sm font-semibold text-gray-900 mb-2"
                  >
                    <Mail className="w-4 h-4 mr-2 text-gray-700" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="company@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="flex items-center text-sm font-semibold text-gray-900 mb-2"
                  >
                    <Phone className="w-4 h-4 mr-2 text-gray-700" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.phone ? "border-red-400 bg-red-50" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white`}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="flex items-center text-sm font-semibold text-gray-900 mb-2"
                >
                  <MapPin className="w-4 h-4 mr-2 text-gray-700" />
                  Business Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  rows="3"
                  placeholder="Enter complete business address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.address ? "border-red-400 bg-red-50" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none bg-white`}
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg text-base font-semibold text-white shadow-lg transition-all transform ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Company...
                  </span>
                ) : (
                  "Create Company"
                )}
              </button>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="mt-6 bg-gray-100 border-2 border-gray-800 text-gray-900 px-5 py-4 rounded-lg flex items-center shadow-md">
                <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center mr-4">
                  <Check size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">Success!</p>
                  <p className="text-sm text-gray-700">Company has been created successfully.</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            All fields are required to complete the registration
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateCompany;