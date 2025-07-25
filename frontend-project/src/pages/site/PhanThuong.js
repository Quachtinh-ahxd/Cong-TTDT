import hcccImage from '../../assets/images/logotd.jpg';
import ahllvtndImage from '../../assets/images/AHLLVTND2.png';

function PhanThuong() {
  return (
    <>
      <div style={{
        padding: '48px 18px',
        maxWidth: 1200,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(189,0,0,0.10)',
        border: '2px solid #bd0000',
        marginTop: 40,
        marginBottom: 40
      }}>
        <h1 style={{textAlign: 'center', color: '#bd0000', fontWeight: 900, fontSize: 30, marginBottom: 8, letterSpacing: 2, textShadow: '0 2px 8px #eee', position:'relative'}}>
          MỘT SỐ PHẦN THƯỞNG CAO QUÝ<br/>VÀ TRUYỀN THỐNG VẺ VANG CỦA TRUNG ĐOÀN 290
          <div style={{height:4, width:80, background:'#bd0000', margin:'12px auto 0', borderRadius:2}}></div>
        </h1>
        <blockquote style={{fontSize: 18, color: '#bd0000', borderLeft: '5px solid #bd0000', background: '#f9f9f9', padding: '12px 24px', margin: '0 auto 28px', maxWidth: 650, fontStyle: 'italic', fontWeight: 600, textAlign:'center'}}>
          "Truyền thống: Trung thành vô hạn – Không ngừng học tập – Bám máy, bám đất, bám dân – Đoàn kết nội bộ, đoàn kết quân dân – Chủ động hiệp đồng lập công tập thể."
        </blockquote>
        <p style={{fontSize: 18, color: '#333', marginBottom: 22, textAlign:'center', fontWeight:500}}>
          Trung đoàn Ra đa 290 đã vinh dự được Đảng, Nhà nước, Quân đội trao tặng nhiều phần thưởng cao quý, ghi nhận những đóng góp xuất sắc trong chiến đấu và xây dựng đơn vị.
        </p>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 32, justifyContent: 'center',
          background:'#f6f6f6', borderRadius: 12, boxShadow:'0 1px 8px #eee', padding:'24px 18px', margin:'0 auto 24px', maxWidth: 700
        }}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'center'}}>
            <div style={{flex: '1 1 50%', minWidth: 260, textAlign: 'center'}}>
              <img src={hcccImage} alt="Huân chương Quân công" style={{maxWidth: '90%', borderRadius: 12, boxShadow: '0 2px 8px rgba(189,0,0,0.3)'}} />
            </div>
            <div style={{flex: '1 1 50%', minWidth: 260, fontSize: 16, color: '#222', lineHeight: 1.8, listStyle: '"🏅 " inside'}}>
              <ul style={{margin:0, padding:0}}>
                <li><b>1 Huân chương Quân công hạng Nhất</b></li>
                <li><b>1 Huân chương Quân công hạng Nhì</b></li>
                <li><b>2 Huân chương Quân công hạng Ba</b></li>
                <li><b>17 Huân chương Chiến công các loại</b></li>
              </ul>
            </div>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'center'}}>
            <div style={{flex: '1 1 50%', minWidth: 260, textAlign: 'center'}}>
              <img src={ahllvtndImage} alt="Anh hùng Lực lượng vũ trang nhân dân" style={{maxWidth: '30%', borderRadius: 12, boxShadow: '0 2px 8px rgba(189,0,0,0.3)'}} />
            </div>
            <div style={{flex: '1 1 50%', minWidth: 260, fontSize: 16, color: '#222', lineHeight: 1.8, listStyle: '"🏅 " inside'}}>
              <ul style={{margin:0, padding:0}}>
                <li><b>Danh hiệu Anh hùng Lực lượng vũ trang nhân dân</b><br/><span style={{fontSize:15, color:'#bd0000'}}>Trung đoàn, Trạm ra đa 12, đồng chí Vũ Ngọc Diệu (Trắc thủ Đại đội ra đa 14)</span></li>
                <li><b>Nhiều bằng khen của Thủ tướng Chính phủ, Bộ Quốc phòng, Quân khu và các cấp</b></li>
                <li><b>Hàng trăm lượt tập thể, hàng ngàn cán bộ, chiến sĩ được tặng thưởng nhiều phần thưởng cao quý khác</b></li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{margin: '28px 0', color:'#bd0000', fontWeight:700, textAlign:'center', fontStyle:'italic', fontSize:18}}>
          Những phần thưởng cao quý này là nguồn động viên to lớn, tiếp thêm động lực để Trung Đoàn 290 tiếp tục phát huy truyền thống, hoàn thành xuất sắc mọi nhiệm vụ được giao.
        </div>
        <hr style={{margin: '28px 0', borderTop: '2px solid #bd0000'}} />
        <div style={{textAlign:'center', color:'#bd0000', fontSize:17, fontWeight:800, fontStyle:'italic', letterSpacing:1}}>
          Trung đoàn Ra đa 290 – Đơn vị Anh hùng Lực lượng vũ trang nhân dân, mãi mãi xứng đáng với niềm tin yêu của Đảng, Nhà nước và nhân dân!
        </div>
      </div>
    </>
  );
}

export default PhanThuong;