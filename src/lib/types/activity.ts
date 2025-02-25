export type ActivityType = 'PAGE_VIEW' | 'LOGIN' | 'POST_CREATE' | 'COMMENT_CREATE';

export interface ActivityMetadata {
  url: string;
  method: string;
  userAgent: string | null;
  timestamp: string;
}

export interface ActivityRequestBody {
  userId: string;
  type: ActivityType;
  metadata: ActivityMetadata;
}

export interface ActivityResponse {
  success: boolean;
  error?: string;
}

// Utility function to create activity metadata
export function createActivityMetadata(
  url: string, 
  method: string, 
  userAgent: string | null
): ActivityMetadata {
  return {
    url,
    method,
    userAgent,
    timestamp: new Date().toISOString(),
  };
}

// Utility function to determine activity type
export function getActivityType(url: string, method: string): ActivityType {
  if (url === '/api/auth/signin' && method === 'POST') {
    return 'LOGIN';
  } else if (url.startsWith('/api/bbs/posts') && method === 'POST') {
    return 'POST_CREATE';
  } else if (url.includes('/comments') && method === 'POST') {
    return 'COMMENT_CREATE';
  }
  return 'PAGE_VIEW';
}
