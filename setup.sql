-- Create audit_submissions table
CREATE TABLE IF NOT EXISTS audit_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE,
  company_name VARCHAR(255),
  user_name VARCHAR(255),
  phone VARCHAR(20),
  user_role VARCHAR(100),
  vertical VARCHAR(100),
  lead_score INT DEFAULT 0,
  tier_assigned VARCHAR(20) DEFAULT 'TIER_1',
  audit_status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT NOW(),
  tier1_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email ON audit_submissions(email);
CREATE INDEX IF NOT EXISTS idx_domain ON audit_submissions(domain);
CREATE INDEX IF NOT EXISTS idx_tier ON audit_submissions(tier_assigned);

-- Create audit_reports table
CREATE TABLE IF NOT EXISTS audit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES audit_submissions(id) ON DELETE CASCADE,
  tier VARCHAR(20) DEFAULT 'TIER_1',
  report_json JSONB,
  overall_score INT,
  technical_score INT,
  on_page_score INT,
  content_score INT,
  aeo_score INT,
  status VARCHAR(50) DEFAULT 'generated',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submission ON audit_reports(submission_id);
