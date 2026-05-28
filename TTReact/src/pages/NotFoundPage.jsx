import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className='not-found-page'>
      <h1>404</h1>
      <h2>Trang khong tim thay</h2>
      <p>Xin loi, trang ban dang tim kiem khong ton tai.</p>
      <Link to='/' className='btn-primary'>
        Ve trang chu
      </Link>
    </div>
  )
}

export default NotFoundPage
