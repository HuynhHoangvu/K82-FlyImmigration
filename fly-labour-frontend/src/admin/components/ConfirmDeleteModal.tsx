import { Trash2 } from "lucide-react";

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
        className="absolute inset-0 modal-overlay"
        onClick={onCancel}
      />
      <div className="relative modal-content modal-error-content max-w-sm w-full p-6 text-center">
        {/* Icon — styled, no emoji */}
        <div className="error-icon-container">
          <Trash2 size={24} />
        </div>
        <h3 className="modal-title mb-1">Xác nhận xóa?</h3>
        <p className="modal-message mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="btn-danger flex-1 py-2.5 text-sm"
          >
            Xóa
          </button>
          <button
            onClick={onCancel}
            className="btn-outline flex-1 py-2.5 text-sm"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
