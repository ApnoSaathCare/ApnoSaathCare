import { DataSource } from 'typeorm';
import { ServicePlan } from '../entities/service-plan.entity';
import { ServiceArea } from '../entities/service-area.entity';

export async function runInitialSeeds(dataSource: DataSource): Promise<void> {
  const servicePlanRepo = dataSource.getRepository(ServicePlan);
  const serviceAreaRepo = dataSource.getRepository(ServiceArea);

  const existingPlansCount = await servicePlanRepo.count();
  if (existingPlansCount === 0) {
    const plans: Partial<ServicePlan>[] = [
      {
        id: 'sp-001',
        name: 'Family Check-in',
        slug: 'family-check-in',
        shortDescription:
          'Ideal for families wanting regular, gentle reassurance and thoughtful check-ins for parents living independently.',
        priceAmount: 1499.0,
        currencyCode: 'INR',
        billingPeriod: 'per month',
        inclusions: [
          '2 scheduled home visits per month',
          'Up to 30 minutes per visit',
          'Brief visit summary after each completed visit (subject to consent)',
          'Basic coordination with nominated family contact',
          'Wellbeing & comfort check',
        ],
        exclusions: [
          'Medical nursing or clinical procedures',
          'Emergency medical response',
          'Third-party purchase costs or travel fees',
          'Heavy domestic housekeeping',
        ],
        isPublished: true,
        displayOrder: 1,
      },
      {
        id: 'sp-002',
        name: 'Regular Support',
        slug: 'regular-support',
        shortDescription:
          'Comprehensive non-medical assistance for weekly presence, errand support, and continuous family peace of mind.',
        priceAmount: 2999.0,
        currencyCode: 'INR',
        billingPeriod: 'per month',
        inclusions: [
          '4 scheduled home visits per month (weekly)',
          'Up to 30 minutes per visit',
          'Detailed visit summaries for the nominated family contact',
          'Assistance coordinating agreed everyday support needs',
          'Appointment escort & reminder support',
          'Priority scheduling review',
        ],
        exclusions: [
          'Medical treatment or medication dispensing',
          '24/7 continuous supervision',
          'Third-party transport / appointment fees',
          'Direct financial or asset management',
        ],
        isPublished: true,
        displayOrder: 2,
      },
      {
        id: 'sp-003',
        name: 'On-demand Errands',
        slug: 'on-demand-errands',
        shortDescription:
          'Flexible, task-based assistance for essential errands, bill payments, grocery pickups, and local coordination.',
        priceAmount: 299.0,
        currencyCode: 'INR',
        billingPeriod: 'per task (₹299–₹699)',
        inclusions: [
          'Transparent quote based on task distance, time, and complexity',
          'Bill payment assistance & local errand runs',
          'Prescription medicine pickup (non-controlled items)',
          'Accompanied local visit coordination',
          'Prompt completion confirmation and digital update',
        ],
        exclusions: [
          'Cash advances or large cash transactions',
          'Urgent emergency errand runs',
          'Hazardous tasks or heavy lifting',
          'Unverified third-party financial requests',
        ],
        isPublished: true,
        displayOrder: 3,
      },
    ];

    await servicePlanRepo.save(plans);
  }

  const existingAreasCount = await serviceAreaRepo.count();
  if (existingAreasCount === 0) {
    const areas: Partial<ServiceArea>[] = [
      { id: 'sa-001', localityName: 'Alkapuri', pincode: '390007', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone with high scheduling availability.' },
      { id: 'sa-002', localityName: 'Akota', pincode: '390020', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone with standard scheduling availability.' },
      { id: 'sa-003', localityName: 'Karelibaug', pincode: '390018', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone for scheduled visits and errands.' },
      { id: 'sa-004', localityName: 'Manjalpur', pincode: '390011', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with daily visit coverage.' },
      { id: 'sa-005', localityName: 'Fatehgunj', pincode: '390002', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone near university area.' },
      { id: 'sa-006', localityName: 'Gotri', pincode: '390021', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone for weekly support plans.' },
      { id: 'sa-007', localityName: 'Vasna Road', pincode: '390015', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone with active partner support.' },
      { id: 'sa-008', localityName: 'Sayajigunj', pincode: '390005', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Central Vadodara zone with standard coverage.' },
      { id: 'sa-009', localityName: 'Subhanpura', pincode: '390023', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with regular visit scheduling.' },
      { id: 'sa-010', localityName: 'Sama', pincode: '390024', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone for check-ins and errand assistance.' },
      { id: 'sa-011', localityName: 'Ellora Park', pincode: '390023', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone with standard scheduling availability.' },
      { id: 'sa-012', localityName: 'Nizampura', pincode: '390002', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area for non-medical elder care visits.' },
      { id: 'sa-013', localityName: 'Waghodia Road', pincode: '390019', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone with confirmed routing availability.' },
      { id: 'sa-014', localityName: 'Gorwa', pincode: '390016', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with regular visit scheduling.' },
      { id: 'sa-015', localityName: 'Tandalja', pincode: '390012', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with standard availability.' },
      { id: 'sa-016', localityName: 'Bhayli', pincode: '391410', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Expanding coverage zone; advance booking recommended.' },
      { id: 'sa-017', localityName: 'Harni Road', pincode: '390022', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with regular visit coverage.' },
      { id: 'sa-018', localityName: 'Makarpura', pincode: '390014', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone for scheduled check-in plans.' },
      { id: 'sa-019', localityName: 'Atladara', pincode: '390012', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone for scheduled check-in plans.' },
      { id: 'sa-020', localityName: 'Sevasi', pincode: '391101', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Pilot expansion area; schedule confirmed on enquiry.' },
    ];

    await serviceAreaRepo.save(areas);
  }
}
