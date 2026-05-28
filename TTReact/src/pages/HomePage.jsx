import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className='home-page'>
      <section className='hero'>
        <h1>Shop Gallery</h1>
        <p>Chao mun den voi cua hang cua chung toi!</p>
        <Link to='/products' className='btn-primary'>
          Xem san pham
        </Link>
      </section>

      <section className='featured'>
        <h2>San pham noi bat</h2>
        <p>Kham pha bo suu tap moi nhat cua chung toi</p>
        <Link to='/products' className='btn-secondary'>
          Tat ca san pham
        </Link>
      </section>
    </div>
  )
}

export default HomePage
