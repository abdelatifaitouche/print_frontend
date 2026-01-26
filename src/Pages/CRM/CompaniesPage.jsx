import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, RefreshCw, Search, Building2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { Badge } from '@/Components/ui/badge';
import {getCompanies} from '@/Services/CompanyService';
import CompaniesTable from './CompaniesTable';

function CompaniesPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCompanies = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    try {
      const data = await getCompanies();
      setCompanies(data || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    Object.values(company).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const stats = [
    { title: 'Total Companies', value: companies.length, change: '+12%' },
    { title: 'Active', value: companies.filter(c => c.status === 'active').length, change: '+5%' },
    { title: 'New This Month', value: 8, change: '+24%' }
  ];

  return (
    <div className="p-6 space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight">Company Directory</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your partner companies and organizations
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/companies/create')}
                className="gap-2"
                variant="default"
              >
                <Plus size={16} />
                Add Company
              </Button>
              <Button
                onClick={fetchCompanies}
                variant="outline"
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-none bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{isLoading ? '--' : stat.value}</h3>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Building2 size={14} />
                Filter
              </Button>
            </div>
          </div>

          {/* Companies Table */}
          <Card className="overflow-hidden border">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-medium">All Companies</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} found
                  </p>
                </div>
                <CompaniesTable 
                  data={filteredCompanies} 
                  onRowClick={(company) => navigate(`/companies/${company.id}`)}
                />
              </>
            )}
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default CompaniesPage;