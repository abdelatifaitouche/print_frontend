import { getCompanyDetails, deleteCompany, updateCompany } from "@/Services/CompanyService";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plus,
  UserPlus,
  Briefcase,
  Activity,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/Components/ui/sheet";
import { Input } from "@/Components/ui/input";

function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sheet State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCompanyDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await getCompanyDetails(id);
      setCompanyData(response);
      setEditForm({
        name: response.name || "",
        email: response.email || "",
        phone: response.phone || "",
        address: response.address || "",
      });
    } catch (error) {
      console.error("Failed to fetch company details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails(id);
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCompany(id);
      toast.success("Company deleted successfully");
      navigate("/companies");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete company");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await updateCompany(id, editForm);
      toast.success("Company updated successfully");
      setIsEditOpen(false);
      fetchCompanyDetails(id); // Refresh data
    } catch (error) {
      console.error(error);
      toast.error("Failed to update company");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "created":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "pending":
        return "bg-gray-200 text-gray-900 border-gray-400";
      case "inactive":
      case "failed":
        return "bg-red-50 text-red-700 border-red-300";
      default:
        return "bg-white text-gray-600 border-gray-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const LoadingSkeleton = ({ className }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-all border border-gray-200"
          >
            <ArrowLeft size={16} />
            Back to Companies
          </button>

          <div className="flex gap-2">
            {/* Delete Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this company? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => document.body.click()}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="ml-2"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Button */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
              <SheetTrigger asChild>
                <Button variant="default" className="flex items-center gap-2">
                  <Edit2 size={16} />
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent position="right" size="lg">
                <SheetHeader>
                  <SheetTitle>Edit Company</SheetTitle>
                </SheetHeader>

                <div className="space-y-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      value={editForm.email}
                      onChange={(e) => handleEditChange("email", e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => handleEditChange("phone", e.target.value)}
                      placeholder="Phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <Input
                      value={editForm.address}
                      onChange={(e) => handleEditChange("address", e.target.value)}
                      placeholder="Address"
                    />
                  </div>
                </div>

                <SheetFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="ml-2" onClick={handleUpdate} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                  <span className="text-2xl font-semibold text-gray-700">
                    {companyData?.name?.charAt(0) || "C"}
                  </span>
                </div>
                <div className="flex-1">
                  {isLoading ? (
                    <LoadingSkeleton className="h-6 w-48 mb-2" />
                  ) : (
                    <h1 className="text-xl font-bold text-gray-900">{companyData?.name || "Company Name"}</h1>
                  )}
                  {isLoading ? (
                    <LoadingSkeleton className="h-5 w-24 mt-2" />
                  ) : (
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border mt-2 ${getStatusBadge(
                        companyData?.folder_status
                      )}`}
                    >
                      {companyData?.folder_status || "Unknown"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-gray-100">
                  <Mail size={18} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  {isLoading ? (
                    <LoadingSkeleton className="h-4 w-full" />
                  ) : (
                    <p className="font-medium text-gray-900 break-words">{companyData?.email || "N/A"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-gray-100">
                  <Phone size={18} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  {isLoading ? (
                    <LoadingSkeleton className="h-4 w-32" />
                  ) : (
                    <p className="font-medium text-gray-900">{companyData?.phone || "N/A"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-gray-100">
                  <MapPin size={18} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  {isLoading ? (
                    <LoadingSkeleton className="h-4 w-full" />
                  ) : (
                    <p className="font-medium text-gray-900">{companyData?.address || "N/A"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-gray-100">
                  <Calendar size={18} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Date Joined</p>
                  {isLoading ? (
                    <LoadingSkeleton className="h-4 w-28" />
                  ) : (
                    <p className="font-medium text-gray-900">{formatDate(companyData?.created_at)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Briefcase size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Active Projects</h3>
                  <p className="text-xs text-gray-500">Currently working on</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Users size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Total Users</h3>
                  <p className="text-xs text-gray-500">Registered employees</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Activity size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Calendar size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Upcoming Tasks</h3>
                  <p className="text-xs text-gray-500">Due this week</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">No upcoming tasks</p>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Users size={20} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Company Users</h2>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all border border-gray-200">
                <Plus size={16} />
                Add User
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50">
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
                  <Users size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">No users found for this company</p>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-all border border-gray-300">
                  <UserPlus size={16} />
                  Invite Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailPage;
