CREATE TYPE "public"."billing_cycle" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('joined', 'referred', 'approved', 'moved_up', 'completed');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('stripe', 'paypal', 'razorpay', 'bank_transfer');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended', 'pending', 'deleted', 'banned', 'selected');--> statement-breakpoint
CREATE TYPE "public"."waitlist_entry_status" AS ENUM('waiting', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "organisation" (
	"id" text PRIMARY KEY DEFAULT 'orga_' || gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"phone" varchar(255),
	"website" varchar(255),
	"logo_url" varchar(255),
	"plan_id" text,
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organisation_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY DEFAULT 'payment_' || gen_random_uuid() NOT NULL,
	"organisation_id" text NOT NULL,
	"amount" double precision NOT NULL,
	"payment_method" "payment_method",
	"payment_status" "payment_status",
	"payment_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan" (
	"id" text PRIMARY KEY DEFAULT 'plan_' || gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" double precision NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"max_sign_ups" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"billing_cycle" "billing_cycle" DEFAULT 'monthly' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY DEFAULT 'proj_' || gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organisation_id" text
);
--> statement-breakpoint
CREATE TABLE "social_proof_event" (
	"id" text PRIMARY KEY DEFAULT 'social_proof_event_' || gen_random_uuid() NOT NULL,
	"waitlist_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY DEFAULT 'user_' || gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organisation_id" text,
	"referral_code" varchar(255) DEFAULT null,
	"is_verified" boolean DEFAULT false,
	"referred_by" text,
	"status" "user_status" DEFAULT 'pending' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" text PRIMARY KEY DEFAULT 'wait_' || gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organisation_id" text NOT NULL,
	"current_sign_ups" integer DEFAULT 0,
	"max_sign_ups" integer DEFAULT 100,
	"slug" varchar(255) NOT NULL,
	"allow_referrals" boolean DEFAULT true,
	"referral_bonus_position" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"metadata" jsonb,
	CONSTRAINT "waitlist_name_unique" UNIQUE("name"),
	CONSTRAINT "waitlist_slug_unique" UNIQUE("slug"),
	CONSTRAINT "check_count" CHECK (max_sign_ups >= current_sign_ups)
);
--> statement-breakpoint
CREATE TABLE "waitlist_entries" (
	"id" text PRIMARY KEY DEFAULT 'waitlist_entry_' || gen_random_uuid() NOT NULL,
	"waitlist_id" text NOT NULL,
	"user_id" text NOT NULL,
	"position" integer NOT NULL,
	"original_position" integer NOT NULL,
	"referred_by" text,
	"status" "waitlist_entry_status" DEFAULT 'waiting' NOT NULL,
	"status_updated_at" timestamp,
	"joined_at" timestamp,
	"is_notified" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_user_unique" UNIQUE("waitlist_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_proof_event" ADD CONSTRAINT "social_proof_event_waitlist_id_waitlist_id_fk" FOREIGN KEY ("waitlist_id") REFERENCES "public"."waitlist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_proof_event" ADD CONSTRAINT "social_proof_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_waitlist_id_waitlist_id_fk" FOREIGN KEY ("waitlist_id") REFERENCES "public"."waitlist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_referred_by_user_id_fk" FOREIGN KEY ("referred_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "phone_idx" ON "user" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "referral_code_idx" ON "user" USING btree ("referral_code");--> statement-breakpoint
CREATE INDEX "waitlist_organisation_id_idx" ON "waitlist" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "waitlist_slug_idx" ON "waitlist" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "waitlist_entries_waitlist_idx" ON "waitlist_entries" USING btree ("waitlist_id");--> statement-breakpoint
CREATE INDEX "waitlist_entries_user_idx" ON "waitlist_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "waitlist_entries_position_idx" ON "waitlist_entries" USING btree ("position");--> statement-breakpoint
CREATE INDEX "waitlist_entries_status_idx" ON "waitlist_entries" USING btree ("status");