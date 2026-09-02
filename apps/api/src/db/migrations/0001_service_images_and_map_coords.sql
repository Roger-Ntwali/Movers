ALTER TABLE "service_areas" ADD COLUMN "latitude" double precision;--> statement-breakpoint
ALTER TABLE "service_areas" ADD COLUMN "longitude" double precision;--> statement-breakpoint
ALTER TABLE "service_areas" DROP COLUMN "map_pin_x";--> statement-breakpoint
ALTER TABLE "service_areas" DROP COLUMN "map_pin_y";--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "image_urls" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN "image_url";
