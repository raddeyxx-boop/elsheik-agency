export default function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return <div className={`admin-toast ${type}`}>{message}</div>
}
