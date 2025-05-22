import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails, updateUser } from '@/Services/UsersService';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'ibrahim',
    email: 'ji_Bensalma@esi.dz',
    phone_number: '+21355555555',
    role: 'admin',
  });

//   useEffect(() => {
//     const fetchUser = async () => {
//       const user = await getUserDetails(id);
//       setFormData(user);
//     };
//     fetchUser();
//   }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(id, formData);
    navigate('/users');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <Input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
      <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <Input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone" />
      <Input name="role" value={formData.role} onChange={handleChange} placeholder="Role" />
      <Button type="submit">Update User</Button>
    </form>
  );
}

export default EditUserPage;
