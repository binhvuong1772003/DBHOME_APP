export type ShopMembershipRole = "OWNER" | "ADMIN" | "STAFF";

export type ShopMembershipStatus = "ACTIVE" | "INACTIVE";

export interface ShopMembership {
  id: string;
  shopId: string;
  userId: string;
  staffId: string | null;
  role: ShopMembershipRole;
  status: ShopMembershipStatus;
}
