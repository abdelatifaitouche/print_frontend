import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { Button } from "@/Components/ui/button";
import { getUserDetails, blockUser, unblockUser, deleteUser } from '@/Services/UsersService';

import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar ,
  Plus,
  UserPlus,
  ShieldUser

} from "lucide-react";
import { set } from 'zod';
function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUserDetails(id);
      setUser(res.data.response);
      setCompanyData(res.data.response.company);
      console.log(user);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);


  const handleDelete = async () => {
  const confirmed = window.confirm("Are you sure you want to delete this user?");
  if (!confirmed) return;

  try {
    await deleteUser(id);
    navigate('/users'); // Redirect to user list after delete
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};



    const handleToggleBlock = async () => {
    if (!user) return;
    setIsToggling(true);
    try {
        if (user.is_active) {
        await blockUser(user.id);
        } else {
        await unblockUser(user.id);
        }
        const updated = await getUserDetails(id);
        setUser(updated.data.response);
    } catch (err) {
        console.error('Error toggling user status:', err);
    } finally {
        setIsToggling(false);
    }
    };
    const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (!user) return <div>Loading...</div>;

  return (
 <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back to Users
        </Button>
        <div className="flex gap-2">
        <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={handleDelete}
        >
            <Trash2 size={16} />
            Delete
        </Button>
        <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/users/edit/${id}`)}
        >
            <Edit2 size={16} />
            Edit
        </Button>

        <Button
            variant={user?.is_active ? "destructive" : "secondary"}
            size="sm"
            className="gap-2"
            onClick={handleToggleBlock}
            disabled={isToggling}
        >
            {user?.is_active ? (
            <>
                <ShieldUser size={16} />
                Block
            </>
            ) : (
            <>
                <ShieldUser size={16} />
                Unblock
            </>
            )}
        </Button>
        </div>

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-xl font-medium">
                  {user?.username?.charAt(0) || 'C'}
                </span>
              </div>
              <div>
                <CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-6 w-[200px]" />
                  ) : (
                    user?.username || 'User Name'
                  )}
                </CardTitle>
                
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Mail size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-[180px] mt-1" />
                ) : (
                  <p className="font-medium">{user?.email || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Phone size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-[150px] mt-1" />
                ) : (
                  <p className="font-medium">{user?.phone_number || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <ShieldUser size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-[200px] mt-1" />
                ) : (
                  <p className="font-medium">{user?.role || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Joined</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-[120px] mt-1" />
                ) : (
                  <p className="font-medium">{formatDate(user?.date_joined)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-xl font-medium">
                  {companyData?.company_name?.charAt(0) || 'C'}
                </span>
              </div>
              <div>
                <CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-6 w-[200px]" />
                  ) : (
                    companyData?.company_name || 'Company Name'
                  )}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Mail size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-[180px] mt-1" />
                ) : (
                  <p className="font-medium">{companyData?.contact_email || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Phone size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-[150px] mt-1" />
                ) : (
                  <p className="font-medium">{companyData?.company_phone || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <MapPin size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-[200px] mt-1" />
                ) : (
                  <p className="font-medium">{companyData?.address || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Joined</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-[120px] mt-1" />
                ) : (
                  <p className="font-medium">{formatDate(companyData?.date_joined)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
export default UserDetailPage;
