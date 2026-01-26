import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { FolderPlus, RefreshCw, Search, FolderOpen, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriveFolders } from '@/Services/DriveService';  // You'll create this

function DriveListPage() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFolders = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    try {
      const data = await getDriveFolders();  // Returns array of { id, name, webViewLink, createdTime }
      setFolders(data || []);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const filteredFolders = folders.filter(folder =>
    folder.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple stats (you can enhance with real data later)
  const stats = [
    { title: "Total Clients", value: folders.length, icon: Users },
    { title: "Active Folders", value: folders.length, icon: FolderOpen },
    { title: "Storage Used", value: "Calculating...", icon: FolderPlus }, // Future: per-folder size
  ];

  return (
    <div className="p-6 space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Client Drive Folders
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage and view all client folders stored on Google Drive
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={fetchFolders}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                Refresh
              </Button>
              <Button
                onClick={() => console.log("Manual folder creation")} // Future feature
                className="gap-2"
                variant="default"
              >
                <FolderPlus size={16} />
                New Client Folder
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <stat.icon className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {isLoading ? '--' : stat.value}
                        </h3>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search client folders..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Folders Table */}
          <Card className="overflow-hidden border">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-medium">All Client Folders</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredFolders.length} {filteredFolders.length === 1 ? 'folder' : 'folders'} found
                  </p>
                </div>
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Folder Name</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Files Count</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFolders.length > 0 ? (
                      filteredFolders.map((folder) => (
                        <TableRow key={folder.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-primary" />
                            {folder.name}
                          </TableCell>
                          <TableCell>
                            {folder.createdTime ? new Date(folder.createdTime).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">—</Badge> {/* Future: file count */}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/drive/${folder.id}`)} // Future detail page
                            >
                              Open
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(folder.webViewLink, '_blank')}
                            >
                              View in Drive
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          {searchTerm ? "No matching folders found" : "No client folders yet"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default DriveListPage;