// AI Feature Service Mock for Connectvisit
// In production, integrate with Gemini API or OpenAI API

export const calculateVisitorRiskScore = (visitor: any) => {
  // AI Logic Simulation
  // Example: High risk if ID number resembles a known blacklist pattern, or no host matched
  let score = 0;

  if (!visitor.idProofUrl) score += 2;
  if (!visitor.personToMeet) score += 3;
  if (visitor.companyName === 'Unknown') score += 1;

  if (score >= 4) return 'HIGH_RISK';
  if (score >= 2) return 'MEDIUM_RISK';
  return 'LOW_RISK';
};

export const getSmartSearchAnalytics = (query: string, visitors: any[]) => {
  // Simulate AI NLP to search visitors
  const q = query.toLowerCase();
  return visitors.filter(v => 
    v.fullName.toLowerCase().includes(q) || 
    v.email.toLowerCase().includes(q) ||
    (v.companyName && v.companyName.toLowerCase().includes(q))
  );
};
