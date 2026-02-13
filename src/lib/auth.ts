import { randomBytes } from "crypto";

interface ApiKeyRecord {
  key: string;
  agentId: string;
  createdAt: number;
}

// In-memory store (matches paper-trading pattern — resets on cold start)
const apiKeys = new Map<string, ApiKeyRecord>();

export function generateApiKey(agentId: string): string {
  const key = `pk_${randomBytes(24).toString("hex")}`;
  apiKeys.set(key, { key, agentId, createdAt: Date.now() });
  return key;
}

export function verifyApiKey(apiKey: string | null, agentId: string): boolean {
  if (!apiKey) return false;
  const record = apiKeys.get(apiKey);
  return record !== undefined && record.agentId === agentId;
}

export function generateSecureId(prefix: string): string {
  return `${prefix}-${Date.now()}-${randomBytes(8).toString("hex")}`;
}
