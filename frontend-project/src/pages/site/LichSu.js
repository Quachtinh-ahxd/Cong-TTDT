
function LichSu() {
  return (
    <>
      <div style={{padding: '48px 18px', maxWidth: 1150, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(189,0,0,0.10)', border: '2px solid #bd0000', marginTop: 40, marginBottom: 40}}>
        <h1 style={{textAlign: 'center', color: '#bd0000', fontWeight: 900, fontSize: 32, marginBottom: 28, letterSpacing: 2, textShadow: '0 2px 8px #eee'}}>LỊCH SỬ - TRUYỀN THỐNG TRUNG ĐOÀN RA ĐA 290</h1>
        <blockquote style={{fontSize: 18, color: '#bd0000', borderLeft: '5px solid #bd0000', background: '#f9f9f9', padding: '12px 24px', margin: '0 auto 24px', maxWidth: 700, fontStyle: 'italic', fontWeight: 600}}>
          "Trung thành - Dũng cảm - Sáng tạo - Quyết thắng"
        </blockquote>
        {/* Section 1: image left, text right */}
        <div style={{display: 'flex', maxWidth: 900, height: 400, margin: '60px auto 40px', background: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 12px #eee'}}>
          {/* Left half - image */}
          <div style={{width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '3px solid #bd0000', padding: 24, boxSizing: 'border-box'}}>
            <img src={require('../../assets/images/sam.jpg')} alt="Logo Trung đoàn" style={{width: '100%', height: 'auto', borderRadius: 16, objectFit: 'cover', maxHeight: '100%'}} />
          </div>
          {/* Right half - text */}
          <div style={{width: '50%', height: '100%', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#222', boxSizing: 'border-box'}}>
            <h2 style={{color: '#bd0000', fontWeight: 800, fontSize: 24, marginBottom: 16}}>LỊCH SỬ - TRUYỀN THỐNG TRUNG ĐOÀN RA ĐA 290</h2>
            <p style={{fontSize: 16, lineHeight: 1.6}}>
              Trung Đoàn được thành lập, tham gia nhiều chiến dịch lớn, lập nhiều chiến công xuất sắc trong kháng chiến chống Mỹ cứu nước, là đơn vị đầu tiên phát hiện máy bay B52.
            </p>
            <p style={{fontSize: 16, lineHeight: 1.6, marginTop: 12}}>
              Đơn vị củng cố lực lượng, bảo vệ biên giới phía Bắc, phối hợp các đơn vị bạn giữ vững an ninh quốc phòng khu vực, nhiều lần được tặng thưởng cao quý.
            </p>
            <p style={{fontSize: 16, lineHeight: 1.6, marginTop: 12}}>
              Không ngừng đổi mới, ứng dụng khoa học công nghệ, nâng cao chất lượng huấn luyện, SSCĐ, xây dựng đơn vị vững mạnh toàn diện, nhiều năm liền đạt danh hiệu Đơn vị Quyết thắng.
            </p>
          </div>
        </div>
        {/* Section 2: text left, image right */}
        <div style={{display: 'flex', maxWidth: 900, margin: '40px auto 40px', background: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 12px #eee'}}>
          {/* Left half - text */}
          <div style={{width: '50%', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#222', borderRight: '3px solid #bd0000', boxSizing: 'border-box'}}>
            <h2 style={{color: '#bd0000', fontWeight: 800, fontSize: 24, marginBottom: 16}}>GIAI ĐOẠN BẢO VỆ BIÊN GIỚI</h2>
            <p style={{fontSize: 16, lineHeight: 1.6}}>
              Đơn vị củng cố lực lượng, bảo vệ biên giới phía Bắc, phối hợp các đơn vị bạn giữ vững an ninh quốc phòng khu vực, nhiều lần được tặng thưởng cao quý.
            </p>
            <p style={{fontSize: 16, lineHeight: 1.6, marginTop: 12}}>
              Nhiều chiến công xuất sắc được ghi nhận trong giai đoạn này.
            </p>
          </div>
          {/* Right half - image */}
          <div style={{width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box'}}>
            <img src={require('../../assets/images/sam2.jpg')} alt="Bản đồ biên giới" style={{width: '100%', height: 'auto', borderRadius: 16, objectFit: 'cover'}} />
          </div>
        </div>
        {/* Section 3: image left, text right */}
        <div style={{display: 'flex', maxWidth: 900, margin: '40px auto 40px', background: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 12px #eee'}}>
          {/* Left half - image */}
          <div style={{width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '3px solid #bd0000', padding: 24, boxSizing: 'border-box'}}>
            <img src={require('../../assets/images/sam3.jpg')} alt="Logo Trung đoàn" style={{width: '100%', height: 'auto', borderRadius: 16, objectFit: 'cover'}} />
          </div>
          {/* Right half - text */}
          <div style={{width: '50%', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#222', boxSizing: 'border-box'}}>
            <h2 style={{color: '#bd0000', fontWeight: 800, fontSize: 24, marginBottom: 16}}>GIAI ĐOẠN HIỆN ĐẠI HÓA</h2>
            <p style={{fontSize: 16, lineHeight: 1.6}}>
              Không ngừng đổi mới, ứng dụng khoa học công nghệ, nâng cao chất lượng huấn luyện, SSCĐ, xây dựng đơn vị vững mạnh toàn diện, nhiều năm liền đạt danh hiệu Đơn vị Quyết thắng.
            </p>
            <p style={{fontSize: 16, lineHeight: 1.6, marginTop: 12}}>
              Đơn vị tiếp tục phát triển và giữ vững danh hiệu cao quý.
            </p>
          </div>
        </div>
        <p style={{textAlign: 'center', color: '#bd0000', fontSize: 18, fontWeight: 700, fontStyle: 'italic', marginTop: 18}}>
          Trung đoàn Ra đa 290 - Đơn vị Anh hùng Lực lượng vũ trang nhân dân, mãi mãi xứng đáng với niềm tin yêu của Đảng, Nhà nước và nhân dân!
        </p>
      </div>
    </>
  );
}

export default LichSu;