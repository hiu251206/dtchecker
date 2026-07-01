import { useEffect, useRef } from 'react';
import '@/styles/MessageBox.css';

/**
 * Custom MessageBox component.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {string} props.title - Title of the message box ("Error", "Message", "Confirm").
 * @param {string} props.message - The message content.
 * @param {'error' | 'info' | 'question'} props.type - Type of dialog icon.
 * @param {boolean} props.isConfirm - True if it should display Yes/No buttons, false for OK.
 * @param {() => void} props.onOk - Callback when OK or Yes is clicked.
 * @param {() => void} [props.onCancel] - Callback when No is clicked.
 */
export default function MessageBox({ isOpen, title, message, type, isConfirm, onOk, onCancel }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the primary button when opened
      const btn = dialogRef.current?.querySelector('.msgbox-btn-primary');
      btn?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg className="msgbox-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="rgba(239, 68, 68, 0.1)" />
            <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'question':
        return (
          <svg className="msgbox-icon question" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="rgba(59, 130, 246, 0.1)" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="msgbox-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="rgba(16, 185, 129, 0.1)" />
            <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
            <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div className="msgbox-backdrop" onClick={!isConfirm ? onOk : undefined}>
      <div
        className="msgbox-container animate-popup"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="msgbox-header">
          <span className="msgbox-title">{title}</span>
          <button className="msgbox-close-x" onClick={isConfirm ? onCancel : onOk} aria-label="Close">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="msgbox-body">
          <div className="msgbox-icon-container">
            {renderIcon()}
          </div>
          <div className="msgbox-message">{message}</div>
        </div>
        <div className="msgbox-footer">
          {isConfirm ? (
            <>
              <button className="msgbox-btn msgbox-btn-primary" onClick={onOk}>Yes</button>
              <button className="msgbox-btn msgbox-btn-secondary" onClick={onCancel}>No</button>
            </>
          ) : (
            <button className="msgbox-btn msgbox-btn-primary" onClick={onOk}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
}
