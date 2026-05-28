import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className='about-page'>
      <h1>Gioi thieu Shop Gallery</h1>
      <p>
        Shop Gallery la cua hang truc tuyen chuyen cung cap cac san pham chat luong cao.
      </p>
      <p>
        Chung toi cam ket mang den cho khach hang nhung trai nghiem mua sam tot nhat.
      </p>
      
      <div className='contact-info'>
        <h2>Thong tin lien he</h2>
        <p>Email: contact@shopgallery.com</p>
        <p>Dien thoai: 0123 456 789</p>
        <p>Dia chi: 123 Duong ABC, Quan XYZ, TP.HCM</p>
      </div>

      <Link to='/' className='btn-primary'>
        Ve trang chu
      </Link>
    </div>
  )
}

export default AboutPage
