import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function HRCalculator() {
  const [positions, setPositions] = useState(5);
  const [salary, setSalary] = useState(8);

  const turnaroundDays = Math.min(18, Math.max(7, Math.round(5 + positions * 0.8)));
  const inHouseCostLakhs = positions * (salary * 0.18);
  const nirvanaCostLakhs = positions * (salary * 0.0833);
  const savingsLakhs = Math.max(1.2, inHouseCostLakhs - nirvanaCostLakhs).toFixed(1);
  const successRate = (97.5 + (positions > 10 ? 1.5 : 0.8)).toFixed(1);

  return (
    <section className="calculator-section">
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-tag">Interactive Calculator</div>
          <h2>Estimate Your Hiring Efficiency & Cost Savings</h2>
          <p>See how partnering with Nirvana HR Solutions accelerates time-to-hire and optimizes recruitment expenditures.</p>
        </div>

        <div className="calculator-card">
          <div className="calc-inputs">
            <div className="calc-slider-group">
              <label>
                <span>Positions to Hire:</span>
                <span className="val-display">{positions} Positions</span>
              </label>
              <input
                type="range"
                className="calc-slider"
                min="1"
                max="50"
                value={positions}
                onChange={(e) => setPositions(parseInt(e.target.value, 10))}
              />
            </div>

            <div className="calc-slider-group">
              <label>
                <span>Average Annual CTC:</span>
                <span className="val-display">₹{salary} Lakhs</span>
              </label>
              <input
                type="range"
                className="calc-slider"
                min="3"
                max="50"
                value={salary}
                onChange={(e) => setSalary(parseInt(e.target.value, 10))}
              />
            </div>

            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              background: 'var(--bg-subtle)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <Info size={18} style={{ color: 'var(--accent-gold-dark)', flexShrink: 0 }} />
              <span>Calculations benchmark standard internal recruiting cycles (~45 days) versus Nirvana HR Solutions dedicated sourcing pipelines.</span>
            </div>
          </div>

          <div className="calc-results-box">
            <div className="calc-result-item">
              <div className="calc-result-title">Estimated Shortlist Time</div>
              <div className="calc-result-value">{turnaroundDays} Days</div>
            </div>
            <div className="calc-result-item">
              <div className="calc-result-title">Estimated Overhead Savings</div>
              <div className="calc-result-value">₹{savingsLakhs}L+</div>
            </div>
            <div className="calc-result-item">
              <div className="calc-result-title">Historical Retention Rate</div>
              <div className="calc-result-value">{successRate}%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
