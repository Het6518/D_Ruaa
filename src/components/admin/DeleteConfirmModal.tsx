import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  productName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-ivory border border-border p-6 sm:p-8 shadow-soft">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 text-muted hover:text-charcoal transition"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 text-clay">
          <div className="p-3 rounded-full bg-clay/10">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-charcoal leading-none">
              Delete Product
            </h3>
            <p className="text-xs uppercase tracking-[0.16em] text-clay mt-1">
              Irreversible Action
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">
          Are you sure you want to delete{" "}
          <strong className="text-charcoal font-semibold">"{productName}"</strong>?
          This action will permanently remove the product and its images from the catalogue.
        </p>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-semibold text-charcoal border border-border hover:bg-cream transition text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-semibold text-ivory bg-clay hover:bg-clay/90 transition text-center flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-ivory border-t-transparent animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
