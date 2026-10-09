-- AapnoSaath Care Database Schema (PostgreSQL 14+)

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: service_plans
CREATE TABLE IF NOT EXISTS service_plans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    price_amount NUMERIC(10, 2) NOT NULL,
    currency_code VARCHAR(10) NOT NULL DEFAULT 'INR',
    billing_period VARCHAR(50) NOT NULL,
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_plans_slug ON service_plans (slug);
CREATE INDEX IF NOT EXISTS idx_service_plans_published ON service_plans (is_published, display_order);

-- Table: enquiries
CREATE TABLE IF NOT EXISTS enquiries (
    id VARCHAR(36) PRIMARY KEY,
    reference_number VARCHAR(32) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    relationship_to_parent VARCHAR(60) NOT NULL,
    parent_city VARCHAR(100) NOT NULL DEFAULT 'Vadodara',
    parent_locality VARCHAR(120) NOT NULL,
    parent_pincode VARCHAR(10),
    parent_preferred_name VARCHAR(100),
    service_of_interest VARCHAR(100) NOT NULL,
    preferred_contact_method VARCHAR(30) NOT NULL DEFAULT 'PHONE',
    preferred_consultation_date VARCHAR(30),
    preferred_time_window VARCHAR(60),
    message TEXT,
    contact_consent BOOLEAN NOT NULL DEFAULT false,
    privacy_notice_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    status VARCHAR(40) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_enquiries_ref ON enquiries (reference_number);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);

-- Table: consultation_requests
CREATE TABLE IF NOT EXISTS consultation_requests (
    id VARCHAR(36) PRIMARY KEY,
    reference_number VARCHAR(32) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    preferred_date VARCHAR(30) NOT NULL,
    preferred_time_window VARCHAR(60) NOT NULL,
    consultation_method VARCHAR(40) NOT NULL DEFAULT 'PHONE',
    support_requirements TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultation_ref ON consultation_requests (reference_number);
CREATE INDEX IF NOT EXISTS idx_consultation_status ON consultation_requests (status);

-- Table: service_areas
CREATE TABLE IF NOT EXISTS service_areas (
    id VARCHAR(36) PRIMARY KEY,
    locality_name VARCHAR(120) NOT NULL,
    pincode VARCHAR(10),
    city VARCHAR(100) NOT NULL DEFAULT 'Vadodara',
    state VARCHAR(100) NOT NULL DEFAULT 'Gujarat',
    is_active BOOLEAN NOT NULL DEFAULT true,
    coverage_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_areas_locality ON service_areas (locality_name);
CREATE INDEX IF NOT EXISTS idx_service_areas_pincode ON service_areas (pincode);
CREATE INDEX IF NOT EXISTS idx_service_areas_active ON service_areas (is_active);
