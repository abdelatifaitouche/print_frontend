import React, { useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { createCompany } from "@/Services/CompanyService";

function CreateCompany() {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_email: "",
    company_phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = "Email is invalid";
    }

    if (!formData.company_phone.trim()) {
      newErrors.company_phone = "Phone number is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("are we here ?")
    console.log(formData)

    const validationErrors = validateForm();

    try {
        const response = await createCompany(formData);

    }catch(error){
        console.log(error)
    }


    
  };

  return (
    <div className="p-4">
      <div className="mb-1 text-left">
        <h1 className="text-3xl font-bold text-gray-900">Add a new company</h1>
        <p className="mt-2 text-gray-600">
          Enter company details
        </p>
      </div>
      <div className="min-h-screen flex flex-col justify-start items-center p-4">
        <div className="w-full max-w-lg bg-white rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="company_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Name
                </label>
                <Input
                  type="text"
                  name="company_name"
                  id="company_name"
                  placeholder="Company name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    errors.company_name ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.company_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact_email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  type="email"
                  name="contact_email"
                  id="contact_email"
                  placeholder="Email address"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    errors.contact_email ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                {errors.contact_email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contact_email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="company_phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <Input
                type="tel"
                name="company_phone"
                id="company_phone"
                placeholder="Phone number"
                value={formData.company_phone}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  errors.company_phone ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
              {errors.company_phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.company_phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <Input placeholder="address" name="address" id="address" value={formData.address} onChange={handleChange} />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isSubmitting ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </form>

          {isSuccess && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
              <Check size={20} className="mr-2" />
              <span>Company created successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCompany;
