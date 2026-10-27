import React, { useState } from 'react';
import { Send, FileText, Download, CheckCircle, AlertCircle, ArrowLeft, Upload, Clock, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function SubmissionPortalPage() {
  const { submissions, submitBugReport, setCurrentView, competition } = useShop();

  const [formData, setFormData] = useState({
    teamId: '',
    bugTitle: '',
    module: 'Catalog / Products',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    screenshotName: ''
  });

  const [submittedStatus, setSubmittedStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, screenshotName: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.teamId.trim() || !formData.bugTitle.trim() || !formData.stepsToReproduce.trim()) {
      alert('Please fill out Team ID, Bug Title, and Steps to Reproduce.');
      return;
    }

    const saved = submitBugReport(formData);
    if (saved) {
      setSubmittedStatus(saved);
      // Reset form fields but preserve team ID for convenience
      setFormData(prev => ({
        teamId: prev.teamId,
        bugTitle: '',
        module: 'Catalog / Products',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
        screenshotName: ''
      }));
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ShopFault_BugReports_${formData.teamId || 'Team'}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const isCompetitionClosed = competition.status === 'ended';

  return (
    <div className="submission-page-container">
      {/* Page Header */}
      <div className="submission-header-row">
        <div>
          <button 
            className="back-to-store-btn"
            onClick={() => setCurrentView('catalog')}
          >
            <ArrowLeft size={15} />
            <span>Back to Store Catalog</span>
          </button>
          <h1 className="page-heading">Participant Bug Submission Portal</h1>
          <p className="page-subheading">
            Submit your discovered bugs with detailed reproduction steps for evaluation.
          </p>
        </div>

        {submissions.length > 0 && (
          <button 
            className="export-json-btn"
            onClick={handleExportJson}
            title="Download your submissions as JSON"
          >
            <Download size={15} />
            <span>Export Submissions ({submissions.length})</span>
          </button>
        )}
      </div>

      {/* Competition Closed Notice */}
      {isCompetitionClosed && (
        <div className="competition-closed-banner">
          <Lock size={20} />
          <div>
            <strong>Competition Period Concluded</strong>
            <p>The 40-minute debugging timer has elapsed. Submissions are now closed for evaluation.</p>
          </div>
        </div>
      )}

      {/* Submission Success Alert */}
      {submittedStatus && !isCompetitionClosed && (
        <div className="submission-success-banner">
          <CheckCircle size={20} className="success-icon" />
          <div className="banner-text">
            <strong>Bug Discovery Recorded Successfully</strong>
            <p>
              Report Reference <code>{submittedStatus.id}</code> logged at {submittedStatus.timestamp}.
            </p>
          </div>
        </div>
      )}

      {/* Layout Grid: Balanced 2 Columns */}
      <div className="submission-layout-grid">
        {/* Left Column: Bug Discovery Form */}
        <div className="submission-form-card">
          <h2 className="portal-section-title">
            <FileText size={17} />
            <span>Submit Bug Discovery Report</span>
          </h2>

          <form className="bug-report-form" onSubmit={handleSubmit}>
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">
                  Team Name or Team ID <span className="req-star">*</span>
                </label>
                <input 
                  type="text"
                  name="teamId"
                  className="form-input"
                  placeholder="e.g. Team ByteKnights - Desk #12"
                  value={formData.teamId}
                  onChange={handleInputChange}
                  disabled={isCompetitionClosed}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Page / Feature Affected <span className="req-star">*</span>
                </label>
                <select 
                  name="module"
                  className="form-input"
                  value={formData.module}
                  onChange={handleInputChange}
                  disabled={isCompetitionClosed}
                >
                  <option value="Catalog / Products">Catalog & Product Cards</option>
                  <option value="Search Bar">Search Bar & Filters</option>
                  <option value="Product Details Modal">Product Details Modal</option>
                  <option value="Shopping Cart">Shopping Cart & Quantity</option>
                  <option value="Coupon Discounts">Coupon Code & Discounts</option>
                  <option value="Checkout Form">Checkout Form & Validation</option>
                  <option value="Order Confirmation">Order Confirmation & Browser Navigation</option>
                  <option value="Order History">Order History & Duplicates</option>
                  <option value="Navigation / Badge">Navbar & Cart Counter</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Bug Summary / Title <span className="req-star">*</span>
              </label>
              <input 
                type="text"
                name="bugTitle"
                className="form-input"
                placeholder="Brief summary of the issue observed"
                value={formData.bugTitle}
                onChange={handleInputChange}
                disabled={isCompetitionClosed}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Exact Steps to Reproduce <span className="req-star">*</span>
              </label>
              <textarea 
                name="stepsToReproduce"
                rows={4}
                className="form-textarea"
                placeholder="1. Go to page...&#10;2. Click on...&#10;3. Observe that..."
                value={formData.stepsToReproduce}
                onChange={handleInputChange}
                disabled={isCompetitionClosed}
                required
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">
                  Expected Behaviour <span className="req-star">*</span>
                </label>
                <textarea 
                  name="expectedBehavior"
                  rows={3}
                  className="form-textarea"
                  placeholder="What should normally happen?"
                  value={formData.expectedBehavior}
                  onChange={handleInputChange}
                  disabled={isCompetitionClosed}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Actual Behaviour <span className="req-star">*</span>
                </label>
                <textarea 
                  name="actualBehavior"
                  rows={3}
                  className="form-textarea"
                  placeholder="What faulty outcome actually occurred?"
                  value={formData.actualBehavior}
                  onChange={handleInputChange}
                  disabled={isCompetitionClosed}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Optional Evidence / Screenshot Attachment</label>
              <input 
                type="file"
                accept="image/*"
                className="form-file-input"
                onChange={handleFileUpload}
                disabled={isCompetitionClosed}
              />
              {formData.screenshotName && (
                <span className="file-attached-pill">
                  Attached: {formData.screenshotName}
                </span>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-report-btn"
              disabled={isCompetitionClosed}
            >
              <Send size={16} />
              <span>Submit Bug Report to Judges</span>
            </button>
          </form>
        </div>

        {/* Right Column: Submitted Reports by This Team */}
        <div className="submissions-history-column">
          <div className="submission-summary-box">
            <h3 className="sub-heading">Your Recorded Submissions</h3>
            <span className="count-tag">{submissions.length} Total</span>
          </div>

          {submissions.length === 0 ? (
            <div className="no-submissions-card">
              <Clock size={32} className="empty-sub-icon" />
              <h4>No Submissions Yet</h4>
              <p>
                When your team identifies an anomaly, enter the numbered reproduction steps 
                and submit it here.
              </p>
            </div>
          ) : (
            <div className="submissions-list">
              {submissions.map((sub) => (
                <div key={sub.id} className="submitted-item-card">
                  <div className="sub-card-header">
                    <span className="sub-id-pill">{sub.id}</span>
                    <span className="sub-time">{sub.timestamp}</span>
                  </div>
                  <h4 className="sub-title">{sub.bugTitle}</h4>
                  <div className="sub-meta-tags">
                    <span className="sub-module-tag">{sub.module}</span>
                    <span className="sub-team-tag">{sub.teamId}</span>
                  </div>
                  <div className="sub-details-preview">
                    <strong>Steps:</strong>
                    <p>{sub.stepsToReproduce}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
