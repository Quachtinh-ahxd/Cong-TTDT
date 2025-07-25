// Trong phần hiển thị nút thao tác
<td>
  <div className="btn-group">
    <Link to={`/admin/topics/show/${topic.id}`} className="btn btn-sm btn-primary">
      <i className="fas fa-eye"></i>
    </Link>
    <Link to={`/admin/topics/edit/${topic.id}`} className="btn btn-sm btn-info">
      <i className="fas fa-edit"></i>
    </Link>
    <button 
      className="btn btn-sm btn-warning" 
      onClick={() => handleChangeStatus(topic.id)}
    >
      <i className="fas fa-sync-alt"></i>
    </button>
    <button 
      className="btn btn-sm btn-danger" 
      onClick={() => handleDelete(topic.id, topic.name)}
    >
      <i className="fas fa-trash"></i>
    </button>
  </div>
</td>