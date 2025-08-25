export type RegistrationInput = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  interests: Array<'indoor'|'outdoor'|'accessories'|'split'|'spare'>;
};

export type SessionUser = {
  uid: string; // cuid-like string generated at registration
  fullName: string;
  email: string;
};

export type BidInput = {
  bids: {
    [key in 'vrf-indoor'|'vrf-outdoor'|'accessories'|'split'|'spare'|'mixed']?: number;
  };
  notes?: string;
};

export type BidSubmission = {
  bundleSlug: string;
  bidAmount?: number;
  notes?: string;
};

export type Catalogue = {
  slug: 'indoor'|'outdoor'|'accessories'|'split'|'spare'|'bundles';
  title: string;
  fileUrl: string; // public or signed, for POC public is fine
  imageUrl?: string; // Image for visual representation
  description?: string;
};
