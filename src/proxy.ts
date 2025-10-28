/**
 * API Proxy utilities for Mobile App Assignment 2
 * Handles proxying requests to external APIs
 */

import { env } from './env';
import { AppError } from './error';

export interface ProxyRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface ProxyResponse {
  data: any;
  status: number;
  headers: Record<string, string>;
}

/**
 * Make a proxied request to external API
 */
export async function proxyRequest(config: ProxyRequest): Promise<ProxyResponse> {
  try {
    const url = config.url.startsWith('http') 
      ? config.url 
      : `${env.API_BASE_URL}${config.url}`;

    const headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    const options: RequestInit = {
      method: config.method,
      headers,
      signal: config.timeout ? AbortSignal.timeout(config.timeout) : undefined,
    };

    if (config.body) {
      options.body = JSON.stringify(config.body);
    }

    console.log(`🌐 Proxying ${config.method} request to ${url}`);

    const response = await fetch(url, options);

    const data = await response.json();

    return {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    console.error('❌ Proxy request failed:', error);
    throw new AppError('Proxy request failed', 502);
  }
}

/**
 * Proxy middleware factory
 */
export function createProxyMiddleware(targetUrl: string) {
  return async (req: any, res: any, next: any) => {
    try {
      const proxyConfig: ProxyRequest = {
        url: targetUrl + req.path,
        method: req.method as any,
        headers: req.headers as Record<string, string>,
        body: req.body,
      };

      const result = await proxyRequest(proxyConfig);
      
      res.status(result.status).json(result.data);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Batch proxy requests
 */
export async function batchProxyRequests(requests: ProxyRequest[]): Promise<ProxyResponse[]> {
  const promises = requests.map(req => proxyRequest(req));
  return Promise.all(promises);
}

/**
 * Cache proxy response
 */
const proxyCache = new Map<string, { data: any; expiry: number }>();

export async function cachedProxyRequest(
  config: ProxyRequest,
  cacheTTL: number = 1000 * 60 * 5 // 5 minutes default
): Promise<ProxyResponse> {
  const cacheKey = `${config.method}:${config.url}`;
  const cached = proxyCache.get(cacheKey);

  if (cached && cached.expiry > Date.now()) {
    console.log('📦 Cache hit:', cacheKey);
    return {
      data: cached.data,
      status: 200,
      headers: {},
    };
  }

  const result = await proxyRequest(config);
  
  proxyCache.set(cacheKey, {
    data: result.data,
    expiry: Date.now() + cacheTTL,
  });

  return result;
}

/**
 * Clear proxy cache
 */
export function clearProxyCache() {
  proxyCache.clear();
  console.log('🗑️  Proxy cache cleared');
}

export default {
  proxyRequest,
  createProxyMiddleware,
  batchProxyRequests,
  cachedProxyRequest,
  clearProxyCache,
};

