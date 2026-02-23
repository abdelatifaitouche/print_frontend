import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { getCompanies } from "@/Services/CompanyService";
import {
  AlertCircle,
  Check,
  Loader2,
  Mail,
  UserPlus,
  Shield,
  Lock,
  User,
  CheckCircle,
  ArrowLeft,
  Building2,
  ChevronsUpDown,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "@/Services/UsersService";
import { toast } from "sonner";

function CreateUserPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [errors, setErrors] = useState({});
  const [companyOpen, setCompanyOpen] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    company_id: "",
    password: "",
    password2: "",
  });

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Fetch all companies using all=True parameter
        const response = await getCompanies({ all: true });
        
        // Extract companies array from response [companies, pagination]
        const companiesList = Array.isArray(response) ? response[0] : response;
        setCompanies(companiesList || []);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        toast.error("Failed to load companies");
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

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

    if (!formData.company_id) {
      newErrors.company_id = "Please select a company";
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
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    try {
      setIsLoading(true);
      await createUser(formData);
      
      toast.success(`User ${formData.username} created successfully`);
      
      // Reset form
      setFormData({
        username: "",
        email: "",
        role: "",
        company_id: "",
        password: "",
        password2: "",
      });
      setErrors({});
      
      // Optional: Navigate back to users list after 1 second
      setTimeout(() => {
        navigate("/users");
      }, 1500);
      
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { 
      value: "ADMIN", 
      label: "Admin", 
      description: "Full system access and management",
      icon: Shield,
      color: "text-purple-600"
    },
    { 
      value: "USER", 
      label: "User", 
      description: "Can manage orders and operations",
      icon: User,
      color: "text-blue-600"
    },
    { 
      value: "CLIENT", 
      label: "Client", 
      description: "Limited access to own orders",
      icon: UserPlus,
      color: "text-green-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">Create New User</h1>
            <p className="text-slate-600 mt-1">Add a new user to your organization</p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle className="text-blue-600" size={16} />
            <span className="text-sm text-blue-900 font-medium">New Account</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
                    <p className="text-sm text-slate-600">User identity and contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                      Username *
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className={`h-11 ${errors.username ? 'border-red-300 focus:ring-red-400' : 'border-slate-300'}`}
                    />
                    {errors.username && (
                      <div className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.username}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@company.com"
                      className={`h-11 ${errors.email ? 'border-red-300 focus:ring-red-400' : 'border-slate-300'}`}
                    />
                    {errors.email && (
                      <div className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role & Permissions */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Shield size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Role & Permissions</h2>
                    <p className="text-sm text-slate-600">Define user access level and organization</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-slate-700">
                      User Role *
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                    >
                      <SelectTrigger className={`h-11 ${errors.role ? 'border-red-300' : 'border-slate-300'}`}>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => {
                          const Icon = role.icon;
                          return (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex items-center gap-3 py-1">
                                <div className={`h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center`}>
                                  <Icon size={16} className={role.color} />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900">{role.label}</div>
                                  <div className="text-xs text-slate-500">{role.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <div className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.role}
                      </div>
                    )}
                  </div>

                  {/* Company Selection - Combobox */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Company *
                    </Label>
                    <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={companyOpen}
                          className={`w-full h-11 justify-between ${errors.company_id ? 'border-red-300' : 'border-slate-300'}`}
                          disabled={isLoadingCompanies}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Building2 size={16} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate">
                              {formData.company_id
                                ? companies.find((company) => company.id.toString() === formData.company_id)?.name
                                : isLoadingCompanies ? "Loading..." : "Select company..."}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search companies..." />
                          <CommandList>
                            <CommandEmpty>No company found.</CommandEmpty>
                            <CommandGroup>
                              {companies.map((company) => (
                                <CommandItem
                                  key={company.id}
                                  value={`${company.name} ${company.email || ''}`}
                                  onSelect={() => {
                                    handleSelectChange("company_id", company.id.toString());
                                    setCompanyOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                      <Building2 size={14} className="text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-slate-900 truncate">{company.name}</div>
                                      {company.email && (
                                        <div className="text-xs text-slate-500 truncate">{company.email}</div>
                                      )}
                                    </div>
                                    <Check
                                      className={`ml-auto h-4 w-4 ${
                                        formData.company_id === company.id.toString()
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    />
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.company_id && (
                      <div className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.company_id}
                      </div>
                    )}
                    {isLoadingCompanies && (
                      <div className="text-slate-500 text-xs flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin" />
                        Loading companies...
                      </div>
                    )}
                  </div>
                </div>

                {/* Role Info */}
                {formData.role && (
                  <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={16} className="text-slate-600 mt-0.5" />
                      <div className="text-sm text-slate-700">
                        <p className="font-medium mb-1">Role Permissions:</p>
                        <ul className="space-y-1 text-slate-600">
                          {formData.role === "ADMIN" && (
                            <>
                              <li>• Full system access and configuration</li>
                              <li>• Manage all users and orders</li>
                              <li>• View all analytics and reports</li>
                            </>
                          )}
                          {formData.role === "USER" && (
                            <>
                              <li>• Manage orders and items</li>
                              <li>• Accept/reject orders</li>
                              <li>• Update order statuses</li>
                            </>
                          )}
                          {formData.role === "CLIENT" && (
                            <>
                              <li>• View own orders only</li>
                              <li>• Cancel pending orders</li>
                              <li>• Download order files</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <Lock size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Security Credentials</h2>
                    <p className="text-sm text-slate-600">Set initial password for the account</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`h-11 ${errors.password ? 'border-red-300 focus:ring-red-400' : 'border-slate-300'}`}
                    />
                    {errors.password ? (
                      <div className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.password}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs">
                        Minimum 8 characters required
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password2" className="text-sm font-medium text-slate-700">
                      Confirm Password *
                    </Label>
                    <Input
                      id="password2"
                      name="password2"
                      type="password"
                      value={formData.password2}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`h-11 ${errors.password2 ? 'border-red-300 focus:ring-red-400' : 'border-slate-300'}`}
                    />
                    {errors.password2 && (
                      <div className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.password2}
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Note */}
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-900">
                      <p className="font-medium mb-1">Security Recommendation</p>
                      <p className="text-amber-800">
                        Ask the user to change their password immediately after first login for better security.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-slate-600">
                    <p>All fields marked with * are required</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="flex-1 sm:flex-none border-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          Create User
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;