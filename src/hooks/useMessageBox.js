import { useState } from 'react';

/**
 * Custom hook to manage a MessageBox dialog state.
 * @returns {{ dialogState, openMessageBox }}
 */
export function useMessageBox() {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    isConfirm: false,
    onOk: () => { },
    onCancel: () => { }
  });

  const openMessageBox = (title, message, type = 'info', isConfirm = false, onOk = () => { }, onCancel = () => { }) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      type,
      isConfirm,
      onOk: () => {
        setDialogState(prev => ({ ...prev, isOpen: false }));
        onOk();
      },
      onCancel: () => {
        setDialogState(prev => ({ ...prev, isOpen: false }));
        onCancel();
      }
    });
  };

  return { dialogState, openMessageBox };
}
