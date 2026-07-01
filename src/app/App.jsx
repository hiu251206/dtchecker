import { useMessageBox } from '@/hooks/useMessageBox';
import { useDateCheckerForm } from '@/hooks/useDateCheckerForm';
import MessageBox from '@/components/MessageBox';

export default function App() {
  const { dialogState, openMessageBox } = useMessageBox();
  const {
    dayText, setDayText,
    monthText, setMonthText,
    yearText, setYearText,
    isAppOpen, setIsAppOpen,
    isChecking,
    handleClear,
    handleCloseClick,
    handleCheck
  } = useDateCheckerForm(openMessageBox);

  return (
    <div className="desktop-container">
      {/* Desktop Icon to Re-open Application */}
      {!isAppOpen && (
        <div className="desktop-shortcuts" onClick={() => setIsAppOpen(true)}>
          <div className="desktop-icon-wrapper">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="4"></line>
              <line x1="8" y1="2" x2="8" y2="4"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="desktop-label">Date Time Checker</div>
        </div>
      )}

      {/* Main App Window */}
      <div className={`window-container ${!isAppOpen ? 'closed' : ''}`}>
        {/* Title Bar mimicking Windows Form */}
        <div className="window-titlebar">
          <div className="window-title">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Form</span>
          </div>
          <div className="window-controls">
            <button className="window-btn-close" onClick={handleCloseClick} title="Close">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Client Area */}
        <div className="window-client">
          <div className="brand-header">
            <div className="brand-logo-container">
              <img src="/fpt_logo.png" alt="FPT Logo" className="brand-logo" />
            </div>
            <h1 className="brand-title">Date Time Checker</h1>
          </div>

          <div className="checker-form">
            <div className="form-row">
              <label htmlFor="txtDay" className="form-label">Day</label>
              <input
                id="txtDay"
                type="text"
                className="form-input"
                value={dayText}
                onChange={(e) => setDayText(e.target.value)}
                placeholder="1-31"
                disabled={isChecking}
              />
            </div>

            <div className="form-row">
              <label htmlFor="txtMonth" className="form-label">Month</label>
              <input
                id="txtMonth"
                type="text"
                className="form-input"
                value={monthText}
                onChange={(e) => setMonthText(e.target.value)}
                placeholder="1-12"
                disabled={isChecking}
              />
            </div>

            <div className="form-row">
              <label htmlFor="txtYear" className="form-label">Year</label>
              <input
                id="txtYear"
                type="text"
                className="form-input"
                value={yearText}
                onChange={(e) => setYearText(e.target.value)}
                placeholder="1000-3000"
                disabled={isChecking}
              />
            </div>

            <div className="form-actions">
              <button
                id="btnClear"
                className="btn btn-clear"
                onClick={handleClear}
                disabled={isChecking}
              >
                Clear
              </button>
              <button
                id="btnCheck"
                className="btn btn-check"
                onClick={handleCheck}
                disabled={isChecking}
              >
                {isChecking ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                      <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
                    </svg>
                    Checking...
                  </>
                ) : (
                  'Check'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom OS MessageBox Dialog Modal */}
      <MessageBox
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
        isConfirm={dialogState.isConfirm}
        onOk={dialogState.onOk}
        onCancel={dialogState.onCancel}
      />
    </div>
  );
}
