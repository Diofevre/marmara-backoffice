import React from 'react';
import Modal from '../ui/modal';
import Button from '../ui/button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  isLoading: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="py-2">
        <p className="text-gray-700">{message}</p>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button" 
            onClick={onClose} 
            variant="outline"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={handleConfirm} 
            variant="danger"
            isLoading={isLoading}
          >
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;