export default function ConfirmModal({ title, text, onConfirm, onClose }: { title: string; text: string; onConfirm: () => void; onClose: () => void }) {
  return <div className="modal-backdrop"><div className="confirm-modal" role="dialog" aria-modal="true"><h3>{title}</h3><p>{text}</p><div><button className="btn danger" onClick={onConfirm}>نعم، احذف</button><button className="btn secondary" onClick={onClose}>إلغاء</button></div></div></div>
}
