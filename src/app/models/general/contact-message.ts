export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  location?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  };
  userAgent?: string;
  createdAt?: string;
  /** Which site the message came from — shown in the admin Contact inbox. */
  source?: string;
}
