import React, { useState } from 'react';
import { 
  Play, Pause, Square, RotateCcw, Download, Search, Filter, 
  Award, Trophy, CheckCircle, AlertTriangle, FileText, ChevronDown, 
  ChevronRight, ArrowLeft, Clock, ShieldCheck, Check, X
} from 'lucide-react';
import { useShop, BUG_PATTERNS } from '../context/ShopContext';
import { ORGANIZER_BUGS_DATA } from '../data/organizerBugs';

export { ORGANIZER_BUGS_DATA };

export default function OrganizerPortalPage({ onExit }) {
  const { 
    submissions, 
    updateSubmissionEvaluation, 
    getLeaderboard,
    competition, 
    startCompetition, 
    pauseCompetition, 
    stopCompetition, 
    resetCompetition 
  } = useShop();

  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'reports' | 'key' | 'checklist'
  const [expandedBug, setExpandedBug] = useState('BUG-E01');

  // Search & Filter state for participant reports
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [reportModuleFilter, setReportModuleFilter] = useState('All');
  const [reportStatusFilter, setReportStatusFilter] = useState('All');

  // Format MM:SS for 40-minute timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const leaderboard = getLeaderboard();
  const totalPossiblePoints = 76;

  // Filtered submissions in participant reports tab
  const getFilteredSubmissions = () => {
    return submissions.filter(sub => {
      // Search query filter
      if (reportSearchQuery.trim()) {
        const q = reportSearchQuery.toLowerCase();
        const matchesText = 
          sub.teamId?.toLowerCase().includes(q) ||
          sub.bugTitle?.toLowerCase().includes(q) ||
          sub.stepsToReproduce?.toLowerCase().includes(q) ||
          sub.matchedBugId?.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // Module filter
      if (reportModuleFilter !== 'All' && sub.module !== reportModuleFilter) {
        return false;
      }

      // Status filter
      if (reportStatusFilter !== 'All' && sub.evaluationStatus !== reportStatusFilter) {
        return false;
      }

      return true;
    });
  };

  const filteredSubmissions = getFilteredSubmissions();

  // Export Results as CSV
  const handleExportResultsCSV = () => {
    const headers = ['Rank', 'Team ID', 'Total Points', 'Bugs Solved Count', 'Solved Bug IDs', 'Total Submissions', 'Last Activity'];
    const rows = leaderboard.map(team => [
      team.rank,
      `"${team.teamId}"`,
      team.totalPoints,
      team.bugsCount,
      `"${team.bugsList.join(', ')}"`,
      team.totalSubmissions,
      `"${team.lastSubmissionTime}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `ShopFault_Final_Leaderboard_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export Complete Audit Log as JSON
  const handleExportAuditJSON = () => {
    const auditData = {
      event: 'CSI Inter-College Debugging Championship',
      timestamp: new Date().toISOString(),
      competitionState: competition,
      leaderboard: leaderboard,
      allSubmissions: submissions
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ShopFault_Competition_Audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="organizer-portal-container">
      {/* Top Header Bar */}
      <div className="organizer-header-bar">
        <div className="org-header-left">
          <button className="org-exit-btn" onClick={onExit}>
            <ArrowLeft size={15} />
            <span>Return to Participant View</span>
          </button>
          <h1 className="org-title">Event Operations & Scoring Command Center</h1>
          <p className="org-subtitle">
            CSI Inter-College Debugging Championship • 45 Teams • 40-Minute Sprint
          </p>
        </div>

        <div className="org-header-right">
          <button className="export-key-btn" onClick={handleExportResultsCSV}>
            <Download size={14} />
            <span>Download Results (CSV)</span>
          </button>
          <button className="export-key-btn" onClick={handleExportAuditJSON}>
            <Download size={14} />
            <span>Export Audit Log (JSON)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          40-MINUTE COMPETITION TIMER & CONTROL BAR
          ========================================================================= */}
      <div className="competition-timer-control-card">
        <div className="timer-display-col">
          <span className="timer-label">Competition Clock (40 Mins)</span>
          <div className="timer-clock-digits">
            <Clock size={28} className="timer-icon" />
            <span className={`timer-time ${competition.status === 'running' ? 'active-timer' : ''}`}>
              {formatTime(competition.timeRemaining)}
            </span>
            <span className={`status-chip ${competition.status}`}>
              {competition.status === 'not_started' && 'Standby (Access Locked)'}
              {competition.status === 'running' && 'Live (Store Unlocked)'}
              {competition.status === 'paused' && 'Timer Paused'}
              {competition.status === 'ended' && 'Concluded (Submissions Closed)'}
            </span>
          </div>
        </div>

        <div className="timer-controls-col">
          {competition.status !== 'running' ? (
            <button 
              className="ctrl-btn btn-start" 
              onClick={startCompetition}
              title="Start timer and grant participants store access"
            >
              <Play size={16} />
              <span>{competition.status === 'paused' ? 'Resume Sprint' : 'Start Competition (Unlock Store)'}</span>
            </button>
          ) : (
            <button 
              className="ctrl-btn btn-pause" 
              onClick={pauseCompetition}
              title="Pause the 40-minute timer"
            >
              <Pause size={16} />
              <span>Pause Timer</span>
            </button>
          )}

          <button 
            className="ctrl-btn btn-stop" 
            onClick={stopCompetition}
            disabled={competition.status === 'ended'}
            title="Immediately end competition and lock submissions"
          >
            <Square size={16} />
            <span>Stop / End Event</span>
          </button>

          <button 
            className="ctrl-btn btn-reset" 
            onClick={() => {
              if (window.confirm('Reset the competition timer back to 40 minutes?')) {
                resetCompetition(40);
              }
            }}
            title="Reset timer to 40 minutes"
          >
            <RotateCcw size={15} />
            <span>Reset (40m)</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="org-tabs-row">
        <button 
          className={`org-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Trophy size={16} />
          <span>Real-Time Leaderboard ({leaderboard.length} Teams)</span>
        </button>

        <button 
          className={`org-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={16} />
          <span>Participant Reports & Auto-Evaluation ({submissions.length})</span>
        </button>

        <button 
          className={`org-tab ${activeTab === 'key' ? 'active' : ''}`}
          onClick={() => setActiveTab('key')}
        >
          <Award size={16} />
          <span>Master Answer Key (15 Seeded Bugs)</span>
        </button>

        <button 
          className={`org-tab ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          <CheckCircle size={16} />
          <span>Pre-Event Checklist</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: REAL-TIME LEADERBOARD
          ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="org-tab-panel">
          <div className="leaderboard-top-summary">
            <div>
              <h3 className="section-heading">Official Live Leaderboard</h3>
              <p className="section-desc">
                Rankings dynamically update in real time as participant submissions are received and verified.
              </p>
            </div>
            <div className="total-submissions-badge">
              <span>Total Logged Findings:</span>
              <strong>{submissions.length}</strong>
            </div>
          </div>

          {leaderboard.length === 0 ? (
            <div className="empty-panel-box">
              <Trophy size={44} className="empty-icon" />
              <h4>No Scored Teams Yet</h4>
              <p>As teams submit reproducible bug reports, auto-evaluation will tally scores here in real time.</p>
            </div>
          ) : (
            <div className="leaderboard-table-container">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team ID</th>
                    <th>Score / Points</th>
                    <th>Bugs Solved</th>
                    <th>Verified Bug IDs</th>
                    <th>Total Reports</th>
                    <th>Last Submission</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((team) => (
                    <tr key={team.teamId} className={`rank-row rank-${team.rank}`}>
                      <td className="rank-cell">
                        {team.rank === 1 && <span className="trophy-badge gold">🥇 #1</span>}
                        {team.rank === 2 && <span className="trophy-badge silver">🥈 #2</span>}
                        {team.rank === 3 && <span className="trophy-badge bronze">🥉 #3</span>}
                        {team.rank > 3 && <span className="rank-number">#{team.rank}</span>}
                      </td>
                      <td className="team-cell">
                        <strong>{team.teamId}</strong>
                      </td>
                      <td className="points-cell">
                        <span className="points-badge">{team.totalPoints} pts</span>
                        <span className="pts-percent">({Math.round((team.totalPoints / totalPossiblePoints) * 100)}%)</span>
                      </td>
                      <td className="bugs-cell">
                        <strong>{team.bugsCount}</strong> / 15
                      </td>
                      <td className="bug-ids-cell">
                        <div className="solved-pills-wrap">
                          {team.bugsList.map(bId => (
                            <span key={bId} className="solved-bug-pill">{bId}</span>
                          ))}
                        </div>
                      </td>
                      <td>{team.totalSubmissions}</td>
                      <td className="time-cell">{team.lastSubmissionTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: PARTICIPANT REPORTS & AUTO-EVALUATION
          ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="org-tab-panel">
          <div className="reports-top-filter-bar">
            {/* Search Box */}
            <div className="search-filter-input-wrap">
              <Search size={15} className="search-icon" />
              <input 
                type="text"
                placeholder="Search by Team ID, bug title, or matched bug..."
                className="reports-search-input"
                value={reportSearchQuery}
                onChange={(e) => setReportSearchQuery(e.target.value)}
              />
            </div>

            {/* Module Filter */}
            <div className="filter-select-wrap">
              <Filter size={14} />
              <select 
                value={reportModuleFilter}
                onChange={(e) => setReportModuleFilter(e.target.value)}
                className="org-select"
              >
                <option value="All">All Features / Modules</option>
                <option value="Catalog / Products">Catalog & Products</option>
                <option value="Search Bar">Search Bar</option>
                <option value="Shopping Cart">Shopping Cart</option>
                <option value="Coupon Discounts">Coupon Discounts</option>
                <option value="Checkout Form">Checkout Form</option>
                <option value="Order Confirmation">Order Confirmation</option>
                <option value="Order History">Order History</option>
                <option value="Navigation / Badge">Navbar & Badge</option>
              </select>
            </div>

            {/* Evaluation Status Filter */}
            <div className="filter-select-wrap">
              <select 
                value={reportStatusFilter}
                onChange={(e) => setReportStatusFilter(e.target.value)}
                className="org-select"
              >
                <option value="All">All Evaluation Statuses</option>
                <option value="Verified">Verified (Auto-Matched)</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="empty-panel-box">
              <FileText size={44} className="empty-icon" />
              <h4>No Submissions Matching Filter</h4>
              <p>Adjust your search query or wait for teams to log new discoveries.</p>
            </div>
          ) : (
            <div className="reports-table-wrap">
              <table className="org-submissions-table">
                <thead>
                  <tr>
                    <th>Report Ref</th>
                    <th>Team ID</th>
                    <th>Bug Title & Module</th>
                    <th>Reproduction Steps</th>
                    <th>Auto-Evaluation</th>
                    <th>Points Awarded</th>
                    <th>Organizer Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id}>
                      <td>
                        <code>{sub.id}</code>
                        <div className="sub-time-txt">{sub.timestamp}</div>
                      </td>

                      <td>
                        <strong className="team-highlight">{sub.teamId}</strong>
                      </td>

                      <td>
                        <div className="sub-table-title">{sub.bugTitle}</div>
                        <span className="sub-module-pill">{sub.module}</span>
                      </td>

                      <td className="steps-td">
                        <div className="steps-scroll-box">
                          <strong>Steps:</strong> {sub.stepsToReproduce}
                          <br />
                          <strong>Observed:</strong> {sub.actualBehavior}
                        </div>
                      </td>

                      <td>
                        {sub.matchedBugId && sub.matchedBugId !== 'Unmatched' ? (
                          <div className="auto-match-box">
                            <span className="auto-badge verified">
                              <Check size={12} />
                              <span>{sub.matchedBugId}</span>
                            </span>
                            <div className="auto-match-name">{sub.matchedBugName}</div>
                            <span className="confidence-pill">{sub.evaluationConfidence} Match</span>
                          </div>
                        ) : (
                          <div className="auto-match-box">
                            <span className="auto-badge review">Needs Review</span>
                            <span className="confidence-pill">No Direct Match</span>
                          </div>
                        )}
                      </td>

                      <td>
                        <input 
                          type="number"
                          className="points-input-field"
                          value={sub.awardedPoints || 0}
                          onChange={(e) => updateSubmissionEvaluation(sub.id, sub.evaluationStatus, Number(e.target.value))}
                          min={0}
                          max={8}
                        />
                        <span className="pts-lbl">pts</span>
                      </td>

                      <td className="actions-td">
                        <div className="eval-actions-buttons">
                          <button 
                            className={`action-btn approve ${sub.evaluationStatus === 'Verified' ? 'active' : ''}`}
                            onClick={() => updateSubmissionEvaluation(sub.id, 'Verified', sub.awardedPoints || 2)}
                            title="Approve and count points for this team"
                          >
                            <Check size={14} />
                            <span>Verify</span>
                          </button>
                          <button 
                            className={`action-btn reject ${sub.evaluationStatus === 'Rejected' ? 'active' : ''}`}
                            onClick={() => updateSubmissionEvaluation(sub.id, 'Rejected', 0)}
                            title="Reject this submission"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: MASTER ANSWER KEY
          ========================================================================= */}
      {activeTab === 'key' && (
        <div className="org-tab-panel">
          <div className="stats-cards-grid">
            <div className="stat-card easy">
              <span className="stat-num">4</span>
              <span className="stat-label">Easy Bugs (2 pts each)</span>
              <span className="stat-sub">8 Points Total</span>
            </div>
            <div className="stat-card medium">
              <span className="stat-num">5</span>
              <span className="stat-label">Medium Bugs (4 pts each)</span>
              <span className="stat-sub">20 Points Total</span>
            </div>
            <div className="stat-card hard">
              <span className="stat-num">6</span>
              <span className="stat-label">Hard Bugs (8 pts each)</span>
              <span className="stat-sub">48 Points Total</span>
            </div>
            <div className="stat-card total">
              <span className="stat-num">76</span>
              <span className="stat-label">Max Possible Score</span>
              <span className="stat-sub">15 Bugs Total</span>
            </div>
          </div>

          <div className="bugs-accordion-list">
            {ORGANIZER_BUGS_DATA.map((bug) => {
              const isOpen = expandedBug === bug.id;
              return (
                <div key={bug.id} className={`bug-accordion-item ${isOpen ? 'open' : ''}`}>
                  <div 
                    className="bug-accordion-header"
                    onClick={() => setExpandedBug(isOpen ? null : bug.id)}
                  >
                    <div className="bug-header-left">
                      <span className={`bug-diff-badge ${bug.difficulty.toLowerCase()}`}>
                        {bug.difficulty} ({bug.points} pts)
                      </span>
                      <strong className="bug-id-tag">{bug.id}</strong>
                      <span className="bug-name-txt">{bug.name}</span>
                    </div>

                    <div className="bug-header-right">
                      <span className="bug-module-txt">{bug.module}</span>
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="bug-accordion-body">
                      <div className="bug-detail-grid">
                        <div className="detail-block">
                          <h4>Reproduction Steps</h4>
                          <ol>
                            {bug.stepsToReproduce.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="detail-block">
                          <h4>Evidence to Verify</h4>
                          <p className="evidence-p">{bug.evidence}</p>
                          <h4>Expected vs Actual</h4>
                          <p><strong>Expected:</strong> {bug.expected}</p>
                          <p><strong>Actual:</strong> {bug.actual}</p>
                        </div>
                      </div>

                      <div className="bug-technical-panel">
                        <h4>Technical Root Cause</h4>
                        <p>{bug.technicalExplanation}</p>
                        <h4>Post-Competition Solution Fix</h4>
                        <code>{bug.fix}</code>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PRE-EVENT CHECKLIST
          ========================================================================= */}
      {activeTab === 'checklist' && (
        <div className="org-tab-panel">
          <div className="checklist-card">
            <h3>Pre-Event Infrastructure Verification Checklist</h3>
            <p>Verify these items 30 minutes before releasing the competition URL to participants:</p>
            
            <ul className="org-checklist-items">
              <li>
                <input type="checkbox" id="chk1" defaultChecked />
                <label htmlFor="chk1">Confirm website opens reliably without build errors or missing scripts.</label>
              </li>
              <li>
                <input type="checkbox" id="chk2" defaultChecked />
                <label htmlFor="chk2">Verify 40-minute timer control works and syncs across participant tabs.</label>
              </li>
              <li>
                <input type="checkbox" id="chk3" defaultChecked />
                <label htmlFor="chk3">Verify Product #4 displays broken image state (BUG E02).</label>
              </li>
              <li>
                <input type="checkbox" id="chk4" defaultChecked />
                <label htmlFor="chk4">Verify search button click fails to filter products (BUG E01).</label>
              </li>
              <li>
                <input type="checkbox" id="chk5" defaultChecked />
                <label htmlFor="chk5">Verify cart badge does not increment until page reload (BUG E03).</label>
              </li>
              <li>
                <input type="checkbox" id="chk6" defaultChecked />
                <label htmlFor="chk6">Verify blank email address passes checkout validation (BUG E04).</label>
              </li>
              <li>
                <input type="checkbox" id="chk7" defaultChecked />
                <label htmlFor="chk7">Verify selecting "Accessories" category omits product #8 (BUG M01).</label>
              </li>
              <li>
                <input type="checkbox" id="chk8" defaultChecked />
                <label htmlFor="chk8">Verify increasing cart quantity displays previous stale subtotal (BUG M02).</label>
              </li>
              <li>
                <input type="checkbox" id="chk9" defaultChecked />
                <label htmlFor="chk9">Verify removing an item from cart retains its price in total (BUG M03).</label>
              </li>
              <li>
                <input type="checkbox" id="chk10" defaultChecked />
                <label htmlFor="chk10">Verify malformed email "student@" passes checkout validation (BUG M04).</label>
              </li>
              <li>
                <input type="checkbox" id="chk11" defaultChecked />
                <label htmlFor="chk11">Verify Price: Low-to-High sorting places ₹1,299 before ₹499 (BUG M05).</label>
              </li>
              <li>
                <input type="checkbox" id="chk12" defaultChecked />
                <label htmlFor="chk12">Verify repeatedly clicking Apply Coupon stacks discount (BUG H01).</label>
              </li>
              <li>
                <input type="checkbox" id="chk13" defaultChecked />
                <label htmlFor="chk13">Verify refreshing Order Confirmation creates duplicate order (BUG H02).</label>
              </li>
              <li>
                <input type="checkbox" id="chk14" defaultChecked />
                <label htmlFor="chk14">Verify Cart Total vs Checkout Total mismatch when coupon applied (BUG H03).</label>
              </li>
              <li>
                <input type="checkbox" id="chk15" defaultChecked />
                <label htmlFor="chk15">Verify browser back/forward navigation loads stale order draft (BUG H04).</label>
              </li>
              <li>
                <input type="checkbox" id="chk16" defaultChecked />
                <label htmlFor="chk16">Verify rapid clicks on Add to Cart creates duplicate cart rows (BUG H05).</label>
              </li>
              <li>
                <input type="checkbox" id="chk17" defaultChecked />
                <label htmlFor="chk17">Verify negative quantity input reduces cart total (BUG H06).</label>
              </li>
              <li>
                <input type="checkbox" id="chk18" defaultChecked />
                <label htmlFor="chk18">Verify Leaderboard and CSV/JSON download feature operates cleanly.</label>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
