import { pgTable, text, jsonb, varchar, timestamp, integer, uniqueIndex, foreignKey, doublePrecision, serial, boolean, index, primaryKey, pgEnum, uuid, check, unique } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"


// Enums for better type safety
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "suspended", "pending", "deleted", "banned","selected"]);
export const waitlistEntryStatusEnum = pgEnum("waitlist_entry_status", ["waiting", "approved", "rejected"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);
export const paymentMethodEnum = pgEnum("payment_method", ["stripe", "paypal", "razorpay", "bank_transfer"]);
export const eventTypeEnum = pgEnum("event_type", ["joined", "referred", "approved", "moved_up", "completed"]);
export const billingCucleEnum = pgEnum("billing_cycle", ["monthly", "yearly"]);




export const organisation  = pgTable("organisation", {
    id: text("id").primaryKey().default(sql`'orga_' || gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 255 }).notNull(),
    website: varchar("website", { length: 255 }),
    logoUrl: varchar("logo_url", { length: 255 }),
    planId: text("plan_id").references(() => plan.id),
    subscriptionStartDate: timestamp("subscription_start_date"),
    subscriptionEndDate: timestamp("subscription_end_date"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

export const project = pgTable("project", {
    id: text("id").primaryKey().default(sql`'proj_' || gen_random_uuid()`),
    name: varchar("name", {length: 255}).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    organisationId: text("organisation_id").references(() => organisation.id),
});

export const user = pgTable("user", {
    id: text("id").primaryKey().default(sql`'user_' || gen_random_uuid()`),
    name: varchar("name", {length: 255}).notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    phone: varchar("phone", {length: 255}).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    organisationId: text("organisation_id").references(() => organisation.id),
    referralCode: varchar("referral_code", {length: 255}).default(sql`null`),
    isVerified: boolean("is_verified").default(false),
    referredBy: text("referred_by"), // TODO: Add a foreign key to the user table (self-referencing)
    status: userStatusEnum("status").default("pending").notNull(),
},(table)=>([
    index("email_idx").on(table.email),
    index("phone_idx").on(table.phone),
    index("referral_code_idx").on(table.referralCode),
]));

// export const userRelations = relations(user, ({many, one})=>({
//     referredBy: one(user, {
//         fields: [user.referredBy],
//         references: [user.id],
//     }),
// }));
export const waitlist = pgTable("waitlist", {
    id: text("id").primaryKey().default(sql`'wait_' || gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    organisationId: text("organisation_id").references(() => organisation.id).notNull(),
    currentSignUps: integer("current_sign_ups").default(0),
    maxSignUps: integer("max_sign_ups").default(100),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    allowReferrals: boolean("allow_referrals").default(true),
    referralBonusPosition: integer("referral_bonus_position").default(1),
    isActive: boolean("is_active").default(true),
},(table)=>[
    index("waitlist_organisation_id_idx").on(table.organisationId),
    index("waitlist_slug_idx").on(table.slug),
    check("check_count", sql`max_sign_ups >= current_sign_ups`),
]);


export const waitlistEntries = pgTable("waitlist_entries", {
    id: text("id").primaryKey().default(sql`'waitlist_entry_' || gen_random_uuid()`),
    waitlistId: text("waitlist_id").references(() => waitlist.id, {onDelete: "cascade"}).notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    position: integer("position").notNull(),
    originalPosition: integer("original_position").notNull(),
    referredBy: text("referred_by").references(() => user.id),
    status: waitlistEntryStatusEnum("status").default("waiting").notNull(),
    statusUpdatedAt: timestamp("status_updated_at"),
    joinedAt: timestamp("joined_at"),
    isNotified: boolean("is_notified").default(false).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
},(table) => ([
    // To ensure a user can only have one entry per waitlist
    unique("waitlist_user_unique").on(table.waitlistId, table.userId),
    index("waitlist_entries_waitlist_idx").on(table.waitlistId),
    index("waitlist_entries_user_idx").on(table.userId),
    index("waitlist_entries_position_idx").on(table.position),
    index("waitlist_entries_status_idx").on(table.status),
]));

export const plan = pgTable("plan", {
    id: text("id").primaryKey().default(sql`'plan_' || gen_random_uuid()`),
    name: varchar("name", {length: 255}).notNull(),
    description: text("description"),
    price: doublePrecision("price").notNull(),
    currency: varchar("currency", {length: 3}).notNull().default("USD"),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
    maxSignUps: integer("max_sign_ups").notNull(),
    isActive: boolean("is_active").default(true),
    billingCycle: billingCucleEnum("billing_cycle").default("monthly").notNull(),
})

export const payment = pgTable("payment", {
    id: text("id").primaryKey().default(sql`'payment_' || gen_random_uuid()`),
    // waitlistId: text("waitlist_id").references(() => waitlist.id, {onDelete:"no action"}).notNull(),
    organisationId: text("organisation_id").references(() => organisation.id).notNull(),
    amount: doublePrecision("amount").notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentStatus: paymentStatusEnum("payment_status"),
    paymentDate: timestamp("payment_date"),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
})

export const socialProofEvent = pgTable("social_proof_event", {
    id: text("id").primaryKey().default(sql`'social_proof_event_' || gen_random_uuid()`),
    waitlistId: text("waitlist_id").references(() => waitlist.id, {onDelete:"no action"}).notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    // eventType: socialProofEventTypeEnum("event_type").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
})