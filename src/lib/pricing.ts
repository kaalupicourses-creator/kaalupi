import { FOUNDING_MEMBER_DISCOUNT } from "@/lib/data";

type PricedCourse = { price: number; founding_free?: boolean };

/**
 * Harga yang dibayar user buat sebuah course.
 * - Bukan founding member  → harga normal (course.price).
 * - Founding member + course founding_free → gratis (0), auto-enroll.
 * - Founding member + course premium → diskon FOUNDING_MEMBER_DISCOUNT.
 */
export function priceForUser(course: PricedCourse, isFoundingMember: boolean): number {
  if (!isFoundingMember) return course.price;
  if (course.founding_free) return 0;
  return Math.round(course.price * (1 - FOUNDING_MEMBER_DISCOUNT));
}
