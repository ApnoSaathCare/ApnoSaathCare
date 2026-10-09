-- AapnoSaath Care Seed Data

-- Clear existing data if necessary
DELETE FROM service_plans;
DELETE FROM service_areas;

-- Insert Service Plans
INSERT INTO service_plans (id, name, slug, short_description, price_amount, currency_code, billing_period, inclusions, exclusions, is_published, display_order)
VALUES 
(
    'sp-001',
    'Family Check-in',
    'family-check-in',
    'Ideal for families wanting regular, gentle reassurance and thoughtful check-ins for parents living independently.',
    1499.00,
    'INR',
    'per month',
    '["2 scheduled home visits per month", "Up to 30 minutes per visit", "Brief visit summary after each completed visit (subject to consent)", "Basic coordination with nominated family contact", "Wellbeing & comfort check"]'::jsonb,
    '["Medical nursing or clinical procedures", "Emergency medical response", "Third-party purchase costs or travel fees", "Heavy domestic housekeeping"]'::jsonb,
    true,
    1
),
(
    'sp-002',
    'Regular Support',
    'regular-support',
    'Comprehensive non-medical assistance for weekly presence, errand support, and continuous family peace of mind.',
    2999.00,
    'INR',
    'per month',
    '["4 scheduled home visits per month (weekly)", "Up to 30 minutes per visit", "Detailed visit summaries for the nominated family contact", "Assistance coordinating agreed everyday support needs", "Appointment escort & reminder support", "Priority scheduling review"]'::jsonb,
    '["Medical treatment or medication dispensing", "24/7 continuous supervision", "Third-party transport / appointment fees", "Direct financial or asset management"]'::jsonb,
    true,
    2
),
(
    'sp-003',
    'On-demand Errands',
    'on-demand-errands',
    'Flexible, task-based assistance for essential errands, bill payments, grocery pickups, and local coordination.',
    299.00,
    'INR',
    'per task (₹299–₹699)',
    '["Transparent quote based on task distance, time, and complexity", "Bill payment assistance & local errand runs", "Prescription medicine pickup (non-controlled items)", "Accompanied local visit coordination", "Prompt completion confirmation and digital update"]'::jsonb,
    '["Cash advances or large cash transactions", "Urgent emergency errand runs", "Hazardous tasks or heavy lifting", "Unverified third-party financial requests"]'::jsonb,
    true,
    3
);

-- Insert Service Areas (Vadodara Localities)
INSERT INTO service_areas (id, locality_name, pincode, city, state, is_active, coverage_notes)
VALUES
('sa-001', 'Alkapuri', '390007', 'Vadodara', 'Gujarat', true, 'Core coverage zone with high scheduling availability.'),
('sa-002', 'Akota', '390020', 'Vadodara', 'Gujarat', true, 'Core coverage zone with standard scheduling availability.'),
('sa-003', 'Karelibaug', '390018', 'Vadodara', 'Gujarat', true, 'Active service zone for scheduled visits and errands.'),
('sa-004', 'Manjalpur', '390011', 'Vadodara', 'Gujarat', true, 'Active service area with daily visit coverage.'),
('sa-005', 'Fatehgunj', '390002', 'Vadodara', 'Gujarat', true, 'Active service zone near university area.'),
('sa-006', 'Gotri', '390021', 'Vadodara', 'Gujarat', true, 'Core coverage zone for weekly support plans.'),
('sa-007', 'Vasna Road', '390015', 'Vadodara', 'Gujarat', true, 'Core coverage zone with active partner support.'),
('sa-008', 'Sayajigunj', '390005', 'Vadodara', 'Gujarat', true, 'Central Vadodara zone with standard coverage.'),
('sa-009', 'Subhanpura', '390023', 'Vadodara', 'Gujarat', true, 'Active service area with regular visit scheduling.'),
('sa-010', 'Sama', '390024', 'Vadodara', 'Gujarat', true, 'Active service zone for check-ins and errand assistance.'),
('sa-011', 'Ellora Park', '390023', 'Vadodara', 'Gujarat', true, 'Core coverage zone with standard scheduling availability.'),
('sa-012', 'Nizampura', '390002', 'Vadodara', 'Gujarat', true, 'Active service area for non-medical elder care visits.'),
('sa-013', 'Waghodia Road', '390019', 'Vadodara', 'Gujarat', true, 'Active service zone with confirmed routing availability.'),
('sa-014', 'Gorwa', '390016', 'Vadodara', 'Gujarat', true, 'Active service area with regular visit scheduling.'),
('sa-015', 'Tandalja', '390012', 'Vadodara', 'Gujarat', true, 'Active service area with standard availability.'),
('sa-016', 'Bhayli', '391410', 'Vadodara', 'Gujarat', true, 'Expanding coverage zone; advance booking recommended.'),
('sa-017', 'Harni Road', '390022', 'Vadodara', 'Gujarat', true, 'Active service area with regular visit coverage.'),
('sa-018', 'Makarpura', '390014', 'Vadodara', 'Gujarat', true, 'Active service zone for scheduled check-in plans.'),
('sa-019', 'Atladara', '390012', 'Vadodara', 'Gujarat', true, 'Active service zone for scheduled check-in plans.'),
('sa-020', 'Sevasi', '391101', 'Vadodara', 'Gujarat', true, 'Pilot expansion area; schedule confirmed on enquiry.');
