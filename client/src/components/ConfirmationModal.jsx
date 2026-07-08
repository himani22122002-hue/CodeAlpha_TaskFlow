import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
