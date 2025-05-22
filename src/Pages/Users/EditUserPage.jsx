import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails, updateUser, AdminchangeUserPassword } from '@/Services/UsersService';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Mail, Phone, User, Shield, Ban, Lock } from 'lucide-react';

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    role: '',
    new_password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserDetails(id);
      setFormData({
        username: data.data.response.username || '',
        email: data.data.response.email || '',
        phone_number: data.data.response.phone_number || '',
        role: data.data.response.role || '',
        new_password: '',
        confirm_password: ''
      });
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Update user info via PATCH
    const patchPayload = { ...formData };

    try {
      await updateUser(id, patchPayload);
    } catch (err) {
      setError('Failed to update user data.');
      return;
    }

    // 2. Handle password change if both fields are filled
    if (formData.new_password || formData.confirm_password) {
  
      if (formData.new_password !== formData.confirm_password) {
        setError('Passwords do not match.');
        return;
      }

      try {
        await AdminchangeUserPassword(id, {
          new_password: formData.new_password,
          new_password2: formData.confirm_password,
        });
      } catch (err) {
        setError('Failed to change password.');
        return;
      }
    }

    navigate(`/users/${id}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-center">Edit User Info</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <Input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>

        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="operator">Staff</option>
            <option value="client">Client</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <Input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="New Password"
          />
        </div>

        {/* 🔒 Confirm Password */}
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <Input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm New Password"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
