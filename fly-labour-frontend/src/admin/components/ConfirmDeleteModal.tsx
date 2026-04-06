interface ConfirmDeleteModalProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  message = "Hành động này không thể hoàn tác.",
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-theme-surface border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div className="text-4xl mb-3">🗑️</div>
        <h3 className="font-semibold text-theme-text-base mb-1">Xác nhận xóa?</h3>
        <p className="text-theme-text-tertiary text-sm mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
          >
            Xóa
          </button>
          <button
            onClick={onCancel}
            className="flex-1 btn-outline py-2.5 text-sm"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
