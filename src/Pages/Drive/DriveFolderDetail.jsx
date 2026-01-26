import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/Components/ui/breadcrumb";
import { FileText, Download, Search, ExternalLink, ArrowLeft, FileIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getFolderContents } from '@/Services/DriveService';  // Your API call

function DriveFolderDetailPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [folderName, setFolderName] = useState("Client Folder");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const data = await getFolderContents(folderId);  // Returns array of files
      setFiles(data || []);
      // Optional: you can pass folderName from backend, or keep it from client model
      setFolderName(data.length > 0 ? "Client Files" : "Empty Folder");
    } catch (error) {
      console.error("Failed to fetch files:", error);
      setFolderName("Error loading files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [folderId]);

  const filteredFiles = files.filter(file =>
    file.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = files.reduce((sum, file) => sum + (parseInt(file.size) || 0), 0);
  const formattedTotalSize = totalSize > 0 
    ? `${(totalSize / (1024 * 1024)).toFixed(2)} MB` 
    : "0 MB";

  return (
    <div className="p-6 space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/drive">Drive Folders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{folderName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileIcon className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Folder Files
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  All uploaded documents in this client folder
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank')}
                className="gap-2"
              >
                <ExternalLink size={16} />
                Open in Drive
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-none bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                <h3 className="text-2xl font-bold mt-1">{isLoading ? '--' : files.length}</h3>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <h3 className="text-2xl font-bold mt-1">{isLoading ? '--' : formattedTotalSize}</h3>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">File Types</p>
                <Badge variant="secondary" className="mt-1">PDF</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Files Table */}
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
                  <h3 className="font-medium">Uploaded Files</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
                  </p>
                </div>
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <TableRow key={file.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-red-600" />
                            {file.name}
                          </TableCell>
                          <TableCell>
                            {file.size ? `${(parseInt(file.size) / (1024 * 1024)).toFixed(2)} MB` : '—'}
                          </TableCell>
                          <TableCell>
                            {new Date(file.createdTime).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.webViewLink, '_blank')}
                            >
                              View
                            </Button>
                            {/* Direct download link if available (Drive sometimes provides webContentLink) */}
                            {/* If not, View opens preview where user can download */}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          {searchTerm ? "No matching files found" : "No files uploaded yet"}
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

export default DriveFolderDetailPage;