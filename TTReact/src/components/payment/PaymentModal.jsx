import { useState } from 'react'

const paymentMethods = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { id: 'momo', label: 'Ví MoMo', icon: '📱' },
  { id: 'card', label: 'Thẻ tín dụng / Ghi nợ', icon: '💳' },
]

const PaymentModal = ({ isOpen, onClose, onConfirm, total }) => {
  const [selected, setSelected] = useState('cod')

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Xác nhận thanh toán</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">Chọn hình thức thanh toán:</p>
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`payment-method ${selected === method.id ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selected === method.id}
                  onChange={() => setSelected(method.id)}
                />
                <span className="payment-icon">{method.icon}</span>
                <span className="payment-label">{method.label}</span>
              </label>
            ))}
          </div>

          <div className="modal-total">
            <span>Tổng thanh toán:</span>
            <span className="modal-total-price">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-modal-confirm" onClick={() => onConfirm(selected)}>
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
