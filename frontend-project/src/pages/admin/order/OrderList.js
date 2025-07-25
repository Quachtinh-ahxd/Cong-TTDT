import React from 'react';

function OrderList() {
  return (
    <div className="container-fluid">
      <h1 className="mt-4">Danh sách đơn hàng</h1>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1"></i>
          Đơn hàng
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Khách hàng mẫu</td>
                <td>01/01/2023</td>
                <td>500.000 đ</td>
                <td>Đã thanh toán</td>
                <td>
                  <a href="/admin/orders/show/1" className="btn btn-sm btn-info me-1">
                    <i className="fas fa-eye"></i>
                  </a>
                  <a href="/admin/orders/edit/1" className="btn btn-sm btn-primary me-1">
                    <i className="fas fa-edit"></i>
                  </a>
                  <button className="btn btn-sm btn-danger">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderList;