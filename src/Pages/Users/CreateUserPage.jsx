import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {getCompanies} from "@/Services/CompanyService";
import {
  AlertCircle,
  Building2,
  Check,
  Fingerprint,
  Loader2,
  Mail,
  PersonStanding,
  Phone,
  Shield,
  UserPlus,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import {createUser} from '@/Services/UsersService'

function CreateUserPage() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    password2: "",
  });
/*
  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await getCompanies();
      setCompanies(response.response || []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);
*/
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
  
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }
    
 
    
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.password2) {
      newErrors.password2 = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Hide success message when trying to submit again
    setSuccessMessage("");
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      // Here you would add the API call to create the user
      console.log("Form submitted:", formData);
      const response = await createUser(formData);
      
      setSuccessMessage(`User ${formData.username} has been created successfully.`);

      
    } catch (error) {
      console.error("Failed to create user:", error);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      phone_number: "",
      role: "",
      company: 0,
      password: "",
      password2: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  const roleOptions = [
    { value: "ADMIN", label: "Admin", description: "Full access to system settings" },
    { value: "USER", label: "Operator", description: "Can manage daily operations" },
    { value: "client", label: "Client", description: "Limited access to own resources" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r  text-black py-6 px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Create New User</h1>
              <p className="text-black-100 mt-1">
                Add a new user to your organization
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <div>{successMessage}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                
                {/* Username Field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className={`flex items-center border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 bg-white focus-within:ring-2 ${errors.username ? 'focus-within:ring-red-500' : 'focus-within:ring-blue-500'}`}>
                    <PersonStanding className={`${errors.username ? 'text-red-400' : 'text-gray-400'} mr-2 w-5 h-5`} />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className="w-full bg-transparent outline-none border-none focus:ring-0 text-sm placeholder-gray-400"
                    />
                  </div>
                  {errors.username && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.username}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2 mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className={`flex items-center border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 bg-white focus-within:ring-2 ${errors.email ? 'focus-within:ring-red-500' : 'focus-within:ring-blue-500'}`}>
                    <Mail className={`${errors.email ? 'text-red-400' : 'text-gray-400'} mr-2 w-5 h-5`} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      className="w-full bg-transparent outline-none border-none focus:ring-0 text-sm placeholder-gray-400"
                    />
                  </div>
                  {errors.email && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>

              </div>
            </div>
              
            {/* Middle Column */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Organization Details</h2>
                
                {/* Role Select Field */}
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    User Role
                  </label>
                  <div className={`${errors.role ? 'ring-2 ring-red-500' : ''}`}>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                    >
                      <SelectTrigger className={`w-full border ${errors.role ? 'border-red-500' : 'border-gray-300'} focus:ring-0`}>
                        <div className="flex items-center">
                          <Shield className={`${errors.role ? 'text-red-400' : 'text-gray-400'} mr-2 w-5 h-5`} />
                          <SelectValue placeholder="Select a role" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex flex-col">
                              <span>{role.label}</span>
                              <span className="text-xs text-gray-500">{role.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.role && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.role}
                    </div>
                  )}
                </div>

                {/* Company Select Field */}
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className={`flex items-center border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 bg-white focus-within:ring-2 ${errors.password ? 'focus-within:ring-red-500' : 'focus-within:ring-blue-500'}`}>
                    <Fingerprint className={`${errors.password ? 'text-red-400' : 'text-gray-400'} mr-2 w-5 h-5`} />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none border-none focus:ring-0 text-sm placeholder-gray-400"
                    />
                  </div>
                  {errors.password ? (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-xs mt-1">
                      Password must be at least 8 characters long
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2 mt-4">
                  <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className={`flex items-center border ${errors.password2 ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 bg-white focus-within:ring-2 ${errors.password2 ? 'focus-within:ring-red-500' : 'focus-within:ring-blue-500'}`}>
                    <Fingerprint className={`${errors.password2 ? 'text-red-400' : 'text-gray-400'} mr-2 w-5 h-5`} />
                    <input
                      id="password2"
                      name="password2"
                      type="password"
                      value={formData.password2}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none border-none focus:ring-0 text-sm placeholder-gray-400"
                    />
                  </div>
                  {errors.password2 && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password2}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                For better security, please ask the user to change their password after first login.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;