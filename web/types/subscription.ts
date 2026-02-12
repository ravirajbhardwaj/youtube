export interface Subscription {
  id: string;
  subscriberId: string;
  channelId: string;
  createdAt: string;
  updatedAt: string;
  channel?: {
    id: string;
    username: string;
    fullname: string;
    avatar?: string;
  };
}

export interface CreateSubscriptionInput {
  channelId: string;
}

export interface SubscriptionResponse {
  success: boolean;
  data?: Subscription | Subscription[];
  message?: string;
  error?: string;
}

export interface SubscriptionStatus {
  success: boolean;
  isSubscribed: boolean;
  subscriptionId?: string;
}
