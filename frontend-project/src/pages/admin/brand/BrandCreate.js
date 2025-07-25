import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandService from '../../../services/BrandService';
import Swal from 'sweetalert2';

function BrandCreate() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await BrandService.create({ name, slug });
      
      console.log('=== Brand Create Response Debug ===');
      console.log('Full response:', response);
      console.log('response.httpStatus:', response.httpStatus);
      console.log('response.httpOk:', response.httpOk);
      console.log('response.status:', response.status);
      console.log('response.success:', response.success);
      console.log('response.message:', response.message);
      
      const isSuccess = response?.httpOk === true || 
                       response?.httpStatus === 200 ||
                       response?.status === true || 
                       response?.success === true ||
                       (response?.message && response.message.includes('successfully'));
      
      if (isSuccess) {
        Swal.fire({
          title: 'Thành công!',
          text: response?.message || 'Thương hiệu đã được tạo thành công.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/admin/brands');
        });
      } else {
        Swal.fire('Lỗi!', response?.message || 'Không thể tạo thương hiệu.', 'error');
      }
    } catch (error) {
      console.error('Error creating brand:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi tạo thương hiệu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Thêm thương hiệu</h2>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Tên thương hiệu</label>
          <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Slug</label>
          <input type="text" className="form-control" value={slug} onChange={e => setSlug(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </form>
    </div>
  );
}

export default BrandCreate;
