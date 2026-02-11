import {
  DFlowEvent,
  DFlowMarket,
  DFlowOrderbook,
  DFlowTrade,
  DFlowCandlestick,
} from "./types";

const BASE_URL = "https://dev-prediction-markets-api.dflow.net";

interface FetchOptions {
  cache?: RequestCache;
  revalidate?: number;
}

async function fetchDFlow<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      cache: options?.cache || "no-store",
      next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
    });

    if (!response.ok) {
      throw new Error(`DFlow API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

export interface GetEventsParams {
  limit?: number;
  withNestedMarkets?: boolean;
  sort?: "volume" | "volume24h" | "openInterest";
  order?: "asc" | "desc";
}

export async function getEvents(params: GetEventsParams = {}): Promise<DFlowEvent[]> {
  const {
    limit = 20,
    withNestedMarkets = true,
    sort = "volume24h",
    order = "desc",
  } = params;

  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    withNestedMarkets: withNestedMarkets.toString(),
    sort,
    order,
  });

  const data = await fetchDFlow<{ events?: DFlowEvent[] }>(`/api/v1/events?${queryParams}`, {
    revalidate: 30, // Cache for 30 seconds
  });

  return data.events || [];
}

export async function getEvent(eventId: string): Promise<DFlowEvent | null> {
  try {
    const data = await fetchDFlow<{ event?: DFlowEvent }>(
      `/api/v1/event/${eventId}?withNestedMarkets=true`,
      { revalidate: 30 }
    );
    return data.event || null;
  } catch (error) {
    console.error(`Failed to fetch event ${eventId}:`, error);
    return null;
  }
}

export async function getMarket(marketId: string): Promise<DFlowMarket | null> {
  try {
    const data = await fetchDFlow<{ market?: DFlowMarket }>(`/api/v1/market/${marketId}`, {
      revalidate: 10,
    });
    return data.market || null;
  } catch (error) {
    console.error(`Failed to fetch market ${marketId}:`, error);
    return null;
  }
}

export async function getOrderbook(marketTicker: string): Promise<DFlowOrderbook | null> {
  try {
    const data = await fetchDFlow<DFlowOrderbook>(`/api/v1/orderbook/${marketTicker}`, {
      cache: "no-store", // Always fresh orderbook data
    });
    return data;
  } catch (error) {
    console.error(`Failed to fetch orderbook for ${marketTicker}:`, error);
    return null;
  }
}

export interface GetTradesParams {
  limit?: number;
}

export async function getTrades(
  marketTicker: string,
  params: GetTradesParams = {}
): Promise<DFlowTrade[]> {
  const { limit = 20 } = params;
  const queryParams = new URLSearchParams({ limit: limit.toString() });

  try {
    const data = await fetchDFlow<{ trades?: DFlowTrade[] }>(
      `/api/v1/trades/${marketTicker}?${queryParams}`,
      { cache: "no-store" }
    );
    return data.trades || [];
  } catch (error) {
    console.error(`Failed to fetch trades for ${marketTicker}:`, error);
    return [];
  }
}

export interface GetCandlesticksParams {
  startTs: number;
  endTs: number;
  periodInterval?: number;
}

export async function getCandlesticks(
  eventTicker: string,
  params: GetCandlesticksParams
): Promise<DFlowCandlestick[]> {
  const { startTs, endTs, periodInterval = 60 } = params;
  
  const queryParams = new URLSearchParams({
    startTs: startTs.toString(),
    endTs: endTs.toString(),
    periodInterval: periodInterval.toString(),
  });

  try {
    const data = await fetchDFlow<{ candlesticks?: DFlowCandlestick[] }>(
      `/api/v1/event/${eventTicker}/candlesticks?${queryParams}`,
      { revalidate: 60 }
    );
    return data.candlesticks || [];
  } catch (error) {
    console.error(`Failed to fetch candlesticks for ${eventTicker}:`, error);
    return [];
  }
}

// Helper function to convert DFlow market to frontend Market type
export function convertDFlowMarketToMarket(
  dflowMarket: DFlowMarket,
  event?: DFlowEvent
): any {
  const yesPrice = (dflowMarket.yesBid + dflowMarket.yesAsk) / 2;
  const noPrice = (dflowMarket.noBid + dflowMarket.noAsk) / 2;

  return {
    id: dflowMarket.ticker,
    title: dflowMarket.title,
    category: "Crypto", // Default, could be enhanced with categorization logic
    yesPrice,
    noPrice,
    change24h: 0, // Would need historical data to calculate
    volume24h: event?.volume24h || 0,
    totalVolume: dflowMarket.volume,
    agentsTrading: 0, // To be populated from paper trading engine
    closeDate: "2026-12-31", // Default, DFlow doesn't provide close date in current API
    status: dflowMarket.status.toLowerCase() as "open" | "closed" | "resolved",
  };
}
