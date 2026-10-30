import { GoogleGenAI } from '@google/genai';
import { db } from './db.js';

interface PlannerMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface PlannerPlanRequest {
  eventType?: string;
  eventDate?: string;
  location?: string;
  isOutsideServiceArea?: boolean;
  guestCount?: number;
  budget?: number;
  theme?: string;
  preferredServices?: string[];
  specialNotes?: string;
  conversationHistory?: PlannerMessage[];
  message?: string;
}

export async function consultAIEventPlanner(req: PlannerPlanRequest) {
  const packages = db.getPackages().filter(p => p.isAvailable);
  const services = db.getServices().filter(s => s.isAvailable);
  const lighting = db.getLightingPackages().filter(l => l.isAvailable);
  const costumes = db.getCostumes().filter(c => c.isAvailable);
  const mascots = db.getMascots().filter(m => m.isAvailable);
  const settings = db.getSettings();

  const packagesContext = packages.map(p => 
    `- ${p.name}: ₦${p.price.toLocaleString()} | Inclusions: ${p.inclusions.join(', ')}`
  ).join('\n');

  const servicesContext = services.map(s => {
    if (s.options) {
      const opts = s.options.map(o => `${o.label} (₦${o.price.toLocaleString()})`).join(', ');
      return `- ${s.name} (${s.category}): Options: ${opts} | ${s.description}`;
    }
    return `- ${s.name} (${s.category}): ₦${s.unitPrice.toLocaleString()} per ${s.unit} | ${s.description}`;
  }).join('\n');

  const lightingContext = lighting.map(l => 
    `- ${l.name}: ${l.price ? '₦' + l.price.toLocaleString() : 'Requires Custom Quotation'} | Inclusions: ${l.inclusions.join(', ')}`
  ).join('\n');

  const costumesContext = costumes.map(c => 
    `- ${c.name}: ${c.rentalPrice ? '₦' + c.rentalPrice.toLocaleString() + ' / day' : 'Requires Custom Quotation'}`
  ).join('\n');

  const mascotsContext = mascots.map(m => 
    `- ${m.name}: ${m.rentalPrice ? '₦' + m.rentalPrice.toLocaleString() : 'Requires Custom Quotation'}`
  ).join('\n');

  const systemPrompt = `You are the Event Planning Assistant for DKWEENS DELIGHTS ENTERPRISES.
Business Location: Warri, Delta State, Nigeria.
Official Slogan: WE PLAN • WE CREATE • YOU CELEBRATE.
Official Phone: 09061453586.
Base Service Area: ${settings.baseServiceArea}.
Logistics Policy: Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation. Never advertise travel, accommodation, or logistics as free, and never invent fixed travel fees.

OFFICIAL DATABASE PACKAGES & CURRENT PRICES:
${packagesContext}

OFFICIAL CATALOG SERVICES & UNIT PRICES:
${servicesContext}

LIGHTING PACKAGES:
${lightingContext}

COSTUMES & MASCOTS:
${costumesContext}
${mascotsContext}

STRICT OPERATIONAL RULES:
1. ONLY recommend packages and services from the database records above.
2. The serving bowl items are strictly Gold-Coloured Serving Bowls with Chilled Drinks (₦2,500 each) and Silver Serving Bowls (₦2,000 each). Never use phonetic bracket spellings or describe serving bowls as boats.
3. NEVER invent prices, discounts, unlisted package items, or claim a booking is already approved or confirmed.
4. Compare the six official afterparty packages based on the user's budget and event type.
5. Approved service coverage: Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria. If the user specifies an event venue outside our normal Warri service area, inform them: "Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation."
6. Provide polite, professional guidance tailored to real Nigerian celebrations (weddings, milestone birthdays, burial ceremonies, corporate galas).
7. When making a concrete package and service recommendation, include a structured JSON block at the very end of your response inside triple backticks with \`json:eventsease_plan\` tag:
\`\`\`json:eventsease_plan
{
  "recommendedPackageId": "pkg-X or null",
  "recommendedPackageName": "string or null",
  "recommendedServices": [
    { "serviceId": "string", "quantity": 1, "selectedOption": "string or null" }
  ],
  "estimatedPricedTotal": 1234567,
  "travelNotice": "string or null",
  "summary": "1-2 sentence summary"
}
\`\`\`
`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return generateFallbackPlanResponse(req, packages, services);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const userPromptContent = `
Event Details Provided:
- Event Type: ${req.eventType || 'Not specified'}
- Date: ${req.eventDate || 'Not specified'}
- Location: ${req.location || 'Warri, Delta State'} (Outside standard service area: ${req.isOutsideServiceArea ? 'Yes' : 'No'})
- Guest Count: ${req.guestCount || 'Not specified'}
- Stated Budget: ${req.budget ? '₦' + req.budget.toLocaleString() : 'Not specified'}
- Theme: ${req.theme || 'Not specified'}
- Preferred Services: ${(req.preferredServices || []).join(', ') || 'Open to recommendations'}
- Additional Notes / User Message: ${req.message || req.specialNotes || 'Please suggest an ideal package and service configuration within my budget.'}
`;

    const contents: any[] = [];
    if (req.conversationHistory && req.conversationHistory.length > 0) {
      for (const msg of req.conversationHistory) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: userPromptContent }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    const replyText = response.text || 'Thank you for contacting DKWEENS DELIGHTS ENTERPRISES. Our event coordinators will be pleased to assist you.';

    let structuredPlan: any = null;
    const planMatch = replyText.match(/```json:eventsease_plan\s*([\s\S]*?)\s*```/);
    if (planMatch && planMatch[1]) {
      try {
        structuredPlan = JSON.parse(planMatch[1]);
      } catch (e) {
        console.warn('Failed to parse plan JSON block', e);
      }
    }

    return {
      success: true,
      reply: replyText.replace(/```json:eventsease_plan[\s\S]*?```/, '').trim(),
      structuredPlan
    };
  } catch (error: any) {
    console.error('Gemini API call failed, providing rule-based recommendation fallback:', error);
    return generateFallbackPlanResponse(req, packages, services);
  }
}

function generateFallbackPlanResponse(req: PlannerPlanRequest, packages: any[], services: any[]) {
  const budget = req.budget || 1000000;
  let recommendedPkg = packages[0];

  if (budget < 450000) {
    recommendedPkg = packages.find(p => p.id === 'pkg-6') || packages[5];
  } else if (budget < 600000) {
    recommendedPkg = packages.find(p => p.id === 'pkg-5') || packages[4];
  } else if (budget < 700000) {
    recommendedPkg = packages.find(p => p.id === 'pkg-4') || packages[3];
  } else if (budget < 850000) {
    recommendedPkg = packages.find(p => p.id === 'pkg-3') || packages[2];
  } else if (budget < 1100000) {
    recommendedPkg = packages.find(p => p.id === 'pkg-2') || packages[1];
  } else {
    recommendedPkg = packages.find(p => p.id === 'pkg-1') || packages[0];
  }

  const remainingBudget = Math.max(0, budget - recommendedPkg.price);
  const ushersCount = remainingBudget >= 68000 ? 4 : (remainingBudget >= 34000 ? 2 : 0);
  const bouncersCount = remainingBudget >= 120000 ? 2 : 0;
  const servingBowlsCount = remainingBudget >= 10000 ? 4 : 2;

  const servicesPlan = [];
  let addedServicesCost = 0;

  if (ushersCount > 0) {
    servicesPlan.push({ serviceId: 'srv-ushers', quantity: ushersCount, selectedOption: null });
    addedServicesCost += ushersCount * 17000;
  }
  if (bouncersCount > 0) {
    servicesPlan.push({ serviceId: 'srv-bouncers', quantity: bouncersCount, selectedOption: null });
    addedServicesCost += bouncersCount * 30000;
  }
  if (servingBowlsCount > 0) {
    servicesPlan.push({ serviceId: 'srv-serving-bowls', quantity: servingBowlsCount, selectedOption: 'Gold-Coloured Serving Bowls with Chilled Drinks' });
    addedServicesCost += servingBowlsCount * 2500;
  }

  const estimatedPricedTotal = recommendedPkg.price + addedServicesCost;

  const travelNotice = req.isOutsideServiceArea
    ? 'Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.'
    : null;

  const reply = `### ✨ Recommended Event Configuration from DKWEENS DELIGHTS ENTERPRISES

Based on your event parameters and budget of **₦${budget.toLocaleString()}**, we recommend **${recommendedPkg.name}** priced at **₦${recommendedPkg.price.toLocaleString()}**.

#### Package Inclusions:
${recommendedPkg.inclusions.map((inc: string) => `- **${inc}**`).join('\n')}

#### Suggested Complementary Services:
${ushersCount > 0 ? `- **${ushersCount} Professional Ushers**: ₦${(ushersCount * 17000).toLocaleString()} (guest welcome & registration)` : ''}
${bouncersCount > 0 ? `- **${bouncersCount} Executive Bouncers**: ₦${(bouncersCount * 30000).toLocaleString()} (VIP access & crowd management)` : ''}
${servingBowlsCount > 0 ? `- **${servingBowlsCount} Gold-Coloured Serving Bowls with Chilled Drinks**: ₦${(servingBowlsCount * 2500).toLocaleString()} (pedestal gold-coloured serving bowls filled with ice and assorted beverages for elegant table presentations and VIP hospitality)` : ''}

**Estimated Subtotal:** ₦${estimatedPricedTotal.toLocaleString()}
${travelNotice ? `\n> ⚠️ **Travel Notice:** ${travelNotice}` : ''}

*Disclaimer: All pricing reflects current database records. Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria. WE PLAN • WE CREATE • YOU CELEBRATE.*`;

  return {
    success: true,
    reply,
    structuredPlan: {
      recommendedPackageId: recommendedPkg.id,
      recommendedPackageName: recommendedPkg.name,
      recommendedServices: servicesPlan,
      estimatedPricedTotal,
      travelNotice,
      summary: `Tailored plan combining ${recommendedPkg.name} with coordinated hospitality staff.`
    }
  };
}
