import React, { useEffect, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Plus, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomDataCard from '@/Components/CustomDataCard';
import CustomTable from '@/Components/CustomTable';
import getCompanies from '@/Services/CompanyService'; // You can implement this later
import CompaniesTable from './CompaniesTable';

function CompaniesPage() {
  const navigate = useNavigate();
  const [companiesData, setCompaniesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await getCompanies();
        console.log(data.response)
      setCompaniesData(data.response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Companies</h1>
            <p className="text-zinc-500 mt-1">
              {isLoading 
                ? 'Loading companies...'
                : companiesData 
                  ? `${companiesData.length} companies found`
                  : 'No companies available'}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button 
              className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2"
              onClick={() => navigate('/companies/create')}
            >
              <Plus size={16} />
              Create Company
            </Button>
          </div>
        </div>

        {/* Data Cards (Optional if you want to summarize) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((item, index) => (
            <CustomDataCard key={index} />
          ))}
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="font-medium text-zinc-800">All Companies</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-zinc-500 hover:text-zinc-800"
              onClick={fetchCompanies}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <RefreshCw size={16} className="mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-teal-500 mr-2" />
              <span className="text-zinc-500">Loading companies...</span>
            </div>
          ) : (
            <CompaniesTable data={companiesData}/>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompaniesPage;
