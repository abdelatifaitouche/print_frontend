import { getCompanyDetails } from "@/Services/CompanyService";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';

import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
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
  UserPlus
} from "lucide-react";

function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanyDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await getCompanyDetails(id);
      setCompanyData(response);
    } catch (error) {
      console.error("Failed to fetch company details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails(id);
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
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
          Back to Companies
        </Button>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => console.log('Delete company')}
          >
            <Trash2 size={16} />
            Delete
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/companies/edit/${id}`)}
          >
            <Edit2 size={16} />
            Edit
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
                <CardDescription>
                  {isLoading ? (
                    <Skeleton className="h-4 w-[150px] mt-2" />
                  ) : (
                    <Badge variant={getStatusBadge(companyData?.status)}>
                      {companyData?.status || 'Unknown Status'}
                    </Badge>
                  )}
                </CardDescription>
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

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Projects</CardTitle>
              <CardDescription>Currently working on</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Users</CardTitle>
              <CardDescription>Registered employees</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
              <CardDescription>Due this week</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No upcoming tasks</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Users Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-muted-foreground" />
              <CardTitle>Company Users</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus size={16} />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="p-8 text-center text-muted-foreground">
              <Users size={40} className="mx-auto mb-4 text-muted-foreground/40" />
              <p>No users found for this company</p>
              <Button variant="ghost" size="sm" className="mt-4 gap-2">
                <UserPlus size={16} />
                Invite Users
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CompanyDetailPage;