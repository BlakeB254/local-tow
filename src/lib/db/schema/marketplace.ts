import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  real,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

// ============================================================
// SERVICE AREAS (Chicago's 77 Community Areas)
// ============================================================

export const serviceAreas = pgTable("service_areas", {
  id: serial("id").primaryKey(),
  communityAreaNumber: integer("community_area_number").notNull().unique(),
  communityAreaName: text("community_area_name").notNull(),
  status: text("status").notNull().default("coming_soon"), // active | coming_soon | inactive
  centerLng: real("center_lng"),
  centerLat: real("center_lat"),
  zipCodes: jsonb("zip_codes").$type<string[]>().default([]),
  minSuggestedPrice: integer("min_suggested_price").default(3000),
  avgSuggestedPrice: integer("avg_suggested_price").default(5000),
  maxSuggestedPrice: integer("max_suggested_price").default(10000),
  activeProviders: integer("active_providers").default(0),
  totalJobs: integer("total_jobs").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================
// PROVIDERS (Tow Operators)
// ============================================================

export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  businessName: text("business_name"),

  // Address
  addressStreet: text("address_street"),
  addressCity: text("address_city").default("Chicago"),
  addressState: text("address_state").default("IL"),
  addressZip: text("address_zip"),
  addressLng: real("address_lng"),
  addressLat: real("address_lat"),

  // Service area
  communityAreaIds: jsonb("community_area_ids").$type<number[]>().default([]),
  maxDistance: integer("max_distance").default(15), // miles

  // Equipment
  vehicleType: text("vehicle_type").notNull(), // flatbed | wheel_lift | dolly | integrated
  maxWeight: integer("max_weight"),
  truckMake: text("truck_make"),
  truckModel: text("truck_model"),
  truckYear: integer("truck_year"),

  // Verification
  verificationStatus: text("verification_status").notNull().default("pending"), // pending | approved | rejected | needs_info | expired
  reviewNotes: text("review_notes"),
  reviewedAt: timestamp("reviewed_at"),

  // Stripe Connect
  stripeAccountId: text("stripe_account_id"),
  stripeOnboardingStatus: text("stripe_onboarding_status").default("not_started"), // not_started | in_progress | completed | restricted
  instantPayoutsEnabled: boolean("instant_payouts_enabled").default(false),

  // Stats
  jobsCompleted: integer("jobs_completed").default(0),
  totalEarnings: integer("total_earnings").default(0), // cents
  averageRating: real("average_rating"),
  responseRate: real("response_rate"),
  lastJobAt: timestamp("last_job_at"),

  // Availability
  isOnline: boolean("is_online").default(false),
  currentLng: real("current_lng"),
  currentLat: real("current_lat"),
  lastLocationUpdate: timestamp("last_location_update"),

  // Notifications
  pushEnabled: boolean("push_enabled").default(false),
  pushSubscription: jsonb("push_subscription"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("providers_email_idx").on(t.email),
  index("providers_verification_idx").on(t.verificationStatus),
  index("providers_online_idx").on(t.isOnline),
]);

// ============================================================
// TOW REQUESTS (Customer requests)
// ============================================================

export const towRequests = pgTable("tow_requests", {
  id: serial("id").primaryKey(),
  requestNumber: text("request_number").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),

  // Pickup
  pickupAddress: text("pickup_address").notNull(),
  pickupCity: text("pickup_city").notNull().default("Chicago"),
  pickupState: text("pickup_state").notNull().default("IL"),
  pickupZip: text("pickup_zip").notNull(),
  pickupLng: real("pickup_lng"),
  pickupLat: real("pickup_lat"),
  pickupNotes: text("pickup_notes"),
  pickupCommunityAreaId: integer("pickup_community_area_id"),

  // Dropoff
  dropoffAddress: text("dropoff_address").notNull(),
  dropoffCity: text("dropoff_city").notNull().default("Chicago"),
  dropoffState: text("dropoff_state").notNull().default("IL"),
  dropoffZip: text("dropoff_zip").notNull(),
  dropoffLng: real("dropoff_lng"),
  dropoffLat: real("dropoff_lat"),
  dropoffNotes: text("dropoff_notes"),

  // Distance
  distanceMiles: real("distance_miles"),
  estimatedDuration: integer("estimated_duration"), // minutes

  // Vehicle
  vehicleMake: text("vehicle_make").notNull(),
  vehicleModel: text("vehicle_model").notNull(),
  vehicleYear: integer("vehicle_year"),
  vehicleColor: text("vehicle_color"),
  vehicleCondition: text("vehicle_condition").notNull().default("runs"), // runs | runs_no_drive | no_run | damaged
  vehicleNotes: text("vehicle_notes"),

  // Pricing (cents)
  offeredPrice: integer("offered_price").notNull(),
  agreedPrice: integer("agreed_price"),
  platformFee: integer("platform_fee"),
  providerPayout: integer("provider_payout"),

  // Timing
  urgency: text("urgency").notNull().default("asap"), // asap | few_hours | today | scheduled
  scheduledTime: timestamp("scheduled_time"),

  // Status
  status: text("status").notNull().default("open"), // open | pending | accepted | job_created | completed | cancelled | expired
  offerCount: integer("offer_count").default(0),
  acceptedOfferId: integer("accepted_offer_id"),
  jobId: integer("job_id"),

  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("tow_requests_number_idx").on(t.requestNumber),
  index("tow_requests_status_idx").on(t.status),
  index("tow_requests_customer_idx").on(t.customerEmail),
]);

// ============================================================
// OFFERS (Provider responses to requests)
// ============================================================

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  offerNumber: text("offer_number").notNull().unique(),
  towRequestId: integer("tow_request_id").notNull(),
  providerId: integer("provider_id").notNull(),

  offerType: text("offer_type").notNull(), // accept | counter
  offerPrice: integer("offer_price").notNull(), // cents
  estimatedArrival: integer("estimated_arrival").notNull(), // minutes
  message: text("message"),

  providerLng: real("provider_lng"),
  providerLat: real("provider_lat"),
  distanceToPickup: real("distance_to_pickup"), // miles

  status: text("status").notNull().default("pending"), // pending | accepted | declined | expired | withdrawn
  declineReason: text("decline_reason"),

  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  declinedAt: timestamp("declined_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("offers_request_idx").on(t.towRequestId),
  index("offers_provider_idx").on(t.providerId),
  index("offers_status_idx").on(t.status),
]);

// ============================================================
// JOBS (Active tow jobs)
// ============================================================

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  jobNumber: text("job_number").notNull().unique(),
  towRequestId: integer("tow_request_id").notNull(),
  offerId: integer("offer_id").notNull(),
  providerId: integer("provider_id").notNull(),
  customerEmail: text("customer_email").notNull(),

  // Status
  status: text("status").notNull().default("accepted"), // accepted | en_route | at_pickup | loading | transporting | at_dropoff | completed | cancelled | disputed

  // Payment (cents)
  agreedPrice: integer("agreed_price").notNull(),
  platformFee: integer("platform_fee").notNull(),
  providerPayout: integer("provider_payout").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentStatus: text("payment_status").default("pending"), // pending | authorized | captured | transferred | failed | refunded

  // Live tracking
  providerLng: real("provider_lng"),
  providerLat: real("provider_lat"),
  lastLocationUpdate: timestamp("last_location_update"),
  gpsPath: jsonb("gps_path").$type<Array<{ lng: number; lat: number; ts: number }>>(),
  estimatedArrival: integer("estimated_arrival"), // minutes

  // Timestamps
  acceptedAt: timestamp("accepted_at"),
  enRouteAt: timestamp("en_route_at"),
  arrivedAt: timestamp("arrived_at"),
  loadedAt: timestamp("loaded_at"),
  departedAt: timestamp("departed_at"),
  deliveredAt: timestamp("delivered_at"),
  completedAt: timestamp("completed_at"),
  totalDurationMinutes: integer("total_duration_minutes"),

  // Ratings
  customerRating: integer("customer_rating"),
  customerComment: text("customer_comment"),
  customerRatedAt: timestamp("customer_rated_at"),
  providerRating: integer("provider_rating"),
  providerComment: text("provider_comment"),
  providerRatedAt: timestamp("provider_rated_at"),

  // Cancellation
  cancelledBy: text("cancelled_by"), // customer | provider | system | admin
  cancellationReason: text("cancellation_reason"),
  cancellationExplanation: text("cancellation_explanation"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationFee: integer("cancellation_fee"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("jobs_number_idx").on(t.jobNumber),
  index("jobs_status_idx").on(t.status),
  index("jobs_provider_idx").on(t.providerId),
  index("jobs_customer_idx").on(t.customerEmail),
]);

// ============================================================
// PAYOUTS (Stripe Connect transfers)
// ============================================================

export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  providerId: integer("provider_id").notNull(),
  stripeTransferId: text("stripe_transfer_id"),
  amount: integer("amount").notNull(), // cents
  platformFee: integer("platform_fee").notNull(), // cents
  status: text("status").notNull().default("pending"), // pending | processing | completed | failed
  method: text("method").default("standard"), // standard | instant
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("payouts_provider_idx").on(t.providerId),
  index("payouts_job_idx").on(t.jobId),
]);
