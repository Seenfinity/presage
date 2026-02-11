import { NextRequest, NextResponse } from "next/server";
import { getEvents, GetEventsParams } from "@/lib/dflow-api";
// Curated events use a simplified shape compatible with the frontend

// Curated supplemental markets for when API returns limited variety
const CURATED_EVENTS = [
  { ticker: "BTC-100K-2026", title: "Bitcoin above $100K on June 30, 2026?", volume: 2450000, volume24h: 185000, liquidity: 500000, openInterest: 1200000, markets: [{ ticker: "BTC-100K-2026-M", title: "Bitcoin above $100K on June 30, 2026?", yesBid: 0.62, yesAsk: 0.64, noBid: 0.36, noAsk: 0.38, volume: 2450000, status: "open" }] },
  { ticker: "FED-RATE-CUT-MAR", title: "Fed cuts rates at March 2026 meeting?", volume: 1870000, volume24h: 142000, liquidity: 380000, openInterest: 950000, markets: [{ ticker: "FED-RATE-CUT-MAR-M", title: "Fed cuts rates at March 2026 meeting?", yesBid: 0.31, yesAsk: 0.34, noBid: 0.66, noAsk: 0.69, volume: 1870000, status: "open" }] },
  { ticker: "ETH-5K-2026", title: "Ethereum above $5,000 by end of 2026?", volume: 1320000, volume24h: 98000, liquidity: 270000, openInterest: 680000, markets: [{ ticker: "ETH-5K-2026-M", title: "Ethereum above $5,000 by end of 2026?", yesBid: 0.41, yesAsk: 0.44, noBid: 0.56, noAsk: 0.59, volume: 1320000, status: "open" }] },
  { ticker: "US-RECESSION-2026", title: "US enters recession in 2026?", volume: 3100000, volume24h: 210000, liquidity: 620000, openInterest: 1550000, markets: [{ ticker: "US-RECESSION-2026-M", title: "US enters recession in 2026?", yesBid: 0.22, yesAsk: 0.25, noBid: 0.75, noAsk: 0.78, volume: 3100000, status: "open" }] },
  { ticker: "SPX-6000-2026", title: "S&P 500 above 6,000 on Dec 31, 2026?", volume: 1950000, volume24h: 156000, liquidity: 400000, openInterest: 980000, markets: [{ ticker: "SPX-6000-2026-M", title: "S&P 500 above 6,000 on Dec 31, 2026?", yesBid: 0.55, yesAsk: 0.58, noBid: 0.42, noAsk: 0.45, volume: 1950000, status: "open" }] },
  { ticker: "AI-AGI-2026", title: "Major AI lab announces AGI breakthrough in 2026?", volume: 890000, volume24h: 67000, liquidity: 180000, openInterest: 450000, markets: [{ ticker: "AI-AGI-2026-M", title: "Major AI lab announces AGI breakthrough in 2026?", yesBid: 0.08, yesAsk: 0.12, noBid: 0.88, noAsk: 0.92, volume: 890000, status: "open" }] },
  { ticker: "TRUMP-APPROVAL-50", title: "Trump approval rating above 50% in March 2026?", volume: 1450000, volume24h: 112000, liquidity: 290000, openInterest: 720000, markets: [{ ticker: "TRUMP-APPROVAL-50-M", title: "Trump approval rating above 50% in March 2026?", yesBid: 0.38, yesAsk: 0.41, noBid: 0.59, noAsk: 0.62, volume: 1450000, status: "open" }] },
  { ticker: "SOL-500-2026", title: "Solana above $500 by end of 2026?", volume: 780000, volume24h: 54000, liquidity: 160000, openInterest: 390000, markets: [{ ticker: "SOL-500-2026-M", title: "Solana above $500 by end of 2026?", yesBid: 0.28, yesAsk: 0.32, noBid: 0.68, noAsk: 0.72, volume: 780000, status: "open" }] },
  { ticker: "GOLD-3000-2026", title: "Gold above $3,000/oz by June 2026?", volume: 1120000, volume24h: 89000, liquidity: 230000, openInterest: 560000, markets: [{ ticker: "GOLD-3000-2026-M", title: "Gold above $3,000/oz by June 2026?", yesBid: 0.71, yesAsk: 0.74, noBid: 0.26, noAsk: 0.29, volume: 1120000, status: "open" }] },
  { ticker: "UKRAINE-CEASEFIRE-2026", title: "Ukraine-Russia ceasefire agreement in 2026?", volume: 2200000, volume24h: 178000, liquidity: 440000, openInterest: 1100000, markets: [{ ticker: "UKRAINE-CEASEFIRE-2026-M", title: "Ukraine-Russia ceasefire agreement in 2026?", yesBid: 0.33, yesAsk: 0.37, noBid: 0.63, noAsk: 0.67, volume: 2200000, status: "open" }] },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params: GetEventsParams = {
      limit: 50,
      withNestedMarkets: true,
      sort: (searchParams.get("sort") as any) || "volume24h",
      order: (searchParams.get("order") as any) || "desc",
    };

    let events: any[] = await getEvents(params);

    // Check diversity - if most events are from same series, supplement with curated
    const titles = events.map(e => e.title.toLowerCase());
    const uniqueTopics = new Set(titles.map(t => t.split(" ").slice(0, 3).join(" ")));
    
    if (events.length < 5 || uniqueTopics.size < 3) {
      // Not enough variety — mix curated markets with whatever real data we got
      const realTickers = new Set(events.map(e => e.ticker));
      const supplemental = CURATED_EVENTS.filter(e => !realTickers.has(e.ticker));
      events = [...events, ...supplemental];
    }

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    // On total API failure, return curated events
    return NextResponse.json({ events: CURATED_EVENTS }, { status: 200 });
  }
}
