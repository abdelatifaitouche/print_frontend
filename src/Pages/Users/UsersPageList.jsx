import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import getUsers from "@/Services/UsersService";

function UsersPageList() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={18} />
          Create New User
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border shadow-md overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-gray-700 font-semibold text-sm px-6 py-3">Username</TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm px-6 py-3">Company</TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm px-6 py-3">Role</TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm px-6 py-3">Phone</TableHead>
              <TableHead className="text-gray-700 font-semibold text-sm px-6 py-3">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users?.length > 0 ? (
              users.map((user, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition"}
                >
                  <TableCell className="px-6 py-4">{user.username}</TableCell>
                  <TableCell className="px-6 py-4">{user.company?.company_name}</TableCell>
                  <TableCell className="px-6 py-4 capitalize">{user.role}</TableCell>
                  <TableCell className="px-6 py-4">{user.phone_number}</TableCell>
                  <TableCell className="px-6 py-4">{user.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default UsersPageList;
