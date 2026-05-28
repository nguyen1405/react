import { Link } from 'react-router-dom'

const CartPage = () => {
  return (
    <div className='cart-page'>
      <h1>Gio hang</h1>
      <p>Gio hang cua ban dang trong.</p>
      <Link to='/products' className='btn-primary'>
        Tiep tuc mua sam
      </Link>
    </div>
  )
}

export default CartPage
