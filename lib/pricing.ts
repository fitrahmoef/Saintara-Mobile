// Package pricing configuration
export const PACKAGE_PRICING = {
  LAPORAN_UMUM_10: {
    name: 'Laporan Umum',
    price: 10000,
    description: 'Basic personality report with general insights',
    features: [
      'General personality overview',
      'Basic character type identification',
      'PDF report included',
    ],
  },
  LAPORAN_LENGKAP_PENEMPATAN_25: {
    name: 'Laporan Lengkap Penempatan',
    price: 25000,
    description: 'Complete report for job placement and role assignment',
    features: [
      'Detailed personality analysis',
      'Job placement recommendations',
      'Team role suggestions',
      'Strengths and weaknesses analysis',
      'PDF report with certificate',
    ],
  },
  LAPORAN_LENGKAP_KARIR_25: {
    name: 'Laporan Lengkap Karir',
    price: 25000,
    description: 'Complete report for career development',
    features: [
      'Career path recommendations',
      'Skill development suggestions',
      'Leadership potential analysis',
      'Work style preferences',
      'PDF report with certificate',
    ],
  },
  LENGKAP_35_KARAKTER: {
    name: 'Lengkap 35 Karakter',
    price: 35000,
    description: 'Comprehensive character analysis with 35 traits',
    features: [
      'In-depth 35 character traits analysis',
      'Detailed behavioral patterns',
      'Interpersonal relationship insights',
      'Decision-making style analysis',
      'Comprehensive PDF report with certificate',
    ],
  },
  PELATIHAN_ONLINE: {
    name: 'Pelatihan Online',
    price: 50000,
    description: 'Online training session included',
    features: [
      'Complete personality report',
      'Online training session (2 hours)',
      'Q&A with certified trainer',
      'Digital materials',
      'Certificate of completion',
    ],
  },
  PELATIHAN_TATAP_MUKA: {
    name: 'Pelatihan Tatap Muka',
    price: 100000,
    description: 'Face-to-face training session included',
    features: [
      'Complete personality report',
      'Face-to-face training (4 hours)',
      'Interactive workshop',
      'Printed materials',
      'Certificate of completion',
      'Follow-up consultation',
    ],
  },
} as const;

export type PackageType = keyof typeof PACKAGE_PRICING;

export function calculateOrderTotal(
  packageTypes: PackageType[],
  participantCount: number
): number {
  const basePrice = packageTypes.reduce((total, pkg) => {
    return total + PACKAGE_PRICING[pkg].price;
  }, 0);

  return basePrice * participantCount;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
