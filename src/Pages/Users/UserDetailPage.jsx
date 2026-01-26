import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Trash2, Mail, Phone, MapPin, Calendar, Building2, User, Check, X, Loader2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { toast } from "sonner";
import { getUserDetails, blockUser, unblockUser, deleteUser, updateUser } from '@/Services/UsersService';
import { getCompanies } from '@/Services/CompanyService';

function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser]           = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [companies, setCompanies] = useState([]);          // ← real list
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm]   = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    company_id: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userRes, companiesRes] = await Promise.all([
        getUserDetails(id),
        getCompanies(),
      ]);

      const userData = userRes?.response || userRes?.data || userRes || {};
      setUser(userData);
      setCompanyData(userData.company || null);

      const companyList = Array.isArray(companiesRes) ? companiesRes : [];
      setCompanies(companyList);

      setEditForm({
        username: userData.username || "",
        email: userData.email || "",
        phoner: userData.phone || "",
        role: (userData.role || ""),
        company_id: userData.company?.id?.toString() || "",
      });
    } catch (err) {
      console.error("Load failed:", err);
      toast.error("Could not load user or companies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleToggleBlock = async () => {
    if (!user) return;
    setIsToggling(true);
    try {
      if (user.is_active) {
        await blockUser(user.id);
        toast.success("User blocked");
      } else {
        await unblockUser(user.id);
        toast.success("User unblocked");
      }
      await loadData();
    } catch (err) {
      toast.error("Status update failed");
    } finally {
      setIsToggling(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const payload = {
        username: editForm.username?.trim() || undefined,
        phone_number: editForm.phone?.trim() || undefined,
        role: editForm.role || undefined,
      };

      // Only include company_id if it has a real value
      if (editForm.company_id && editForm.company_id !== "") {
        payload.company_id = editForm.company_id;
      } else {
        payload.company_id = null;   // or omit if backend treats missing as null
      }

      await updateUser(id, payload);
      toast.success("User updated successfully");
      setIsEditOpen(false);
      await loadData();
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err?.response?.data?.detail || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(id);
      toast.success("User deleted");
      navigate("/users");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getInitials = (name) =>
    (name || "?").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/70">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-slate-500" />
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/70">
        <div className="text-center space-y-6">
          <div className="text-7xl font-bold text-slate-200">404</div>
          <p className="text-xl text-slate-600">User not found</p>
          <Button onClick={() => navigate("/users")}>Back to Users</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/70 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        <Button
          variant="ghost"
          className="mb-6 -ml-3 text-slate-600 hover:text-slate-900"
          onClick={() => navigate("/users")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {getInitials(user.username)}
              </div>
              {user.is_active && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">{user.username}</h1>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'ADMIN' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {(user.role || 'USER').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Active' : 'Blocked'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>Update profile and permissions.</DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-5">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      value={editForm.username}
                      onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={editForm.email} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={editForm.phone}
                      onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={editForm.role}
                      onValueChange={v => setEditForm(p => ({ ...p, role: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                       

                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="CLIENT">Client</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Select
                      value={editForm.company_id}
                      onValueChange={v => setEditForm(p => ({ ...p, company_id: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select or clear company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— No company / Unassigned —</SelectItem>
                        {companies.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name || c.name || "Unnamed"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="gap-3">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant={user.is_active ? "outline" : "default"}
              onClick={handleToggleBlock}
              disabled={isToggling}
              className={!user.is_active ? "bg-slate-900 hover:bg-slate-800 text-white" : ""}
            >
              {isToggling ? "..." : user.is_active ? "Block" : "Unblock"}
            </Button>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-red-600">Delete User</DialogTitle>
                  <DialogDescription>
                    Permanently delete <strong>{user.username}</strong>?<br />
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Contact & Company cards – unchanged from previous version */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <InfoItem icon={Mail} label="Email" value={user.email} />
              <InfoItem icon={Phone} label="Phone" value={user.phone_number} />
              <InfoItem icon={Calendar} label="Member Since" value={formatDate(user.date_joined)} />
            </CardContent>
          </Card>

          {companyData && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs uppercase text-slate-500 mb-1">Name</p>
                      <p className="font-medium">{companyData.name || companyData.company_name || "—"}</p>
                    </div>
                    <InfoItem icon={Mail} label="Contact Email" value={companyData.contact_email} />
                    <InfoItem icon={Phone} label="Phone" value={companyData.company_phone || companyData.phone} />
                  </div>
                  <div className="space-y-6">
                    <InfoItem icon={MapPin} label="Address" value={companyData.address} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase text-slate-500 mb-1 tracking-wide">{label}</p>
        <p className="text-sm font-medium text-slate-900 break-words">{value || "—"}</p>
      </div>
    </div>
  );
}

export default UserDetailPage;