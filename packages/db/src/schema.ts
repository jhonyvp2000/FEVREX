import { pgTable, uuid, text, timestamp, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["USER", "ADMIN", "SUPERADMIN"]);
export const kycStatusEnum = pgEnum("kyc_status", ["PENDING", "IN_REVIEW", "VERIFIED", "REJECTED", "SUSPENDED"]);
export const orderTypeEnum = pgEnum("order_type", ["BUY", "SELL"]);
export const orderStatusEnum = pgEnum("order_status", [
    "DRAFT",
    "CREATED",
    "PENDING_PAYMENT_CONFIRMATION",
    "PAYMENT_UNDER_REVIEW",
    "PAYMENT_CONFIRMED",
    "PAYOUT_IN_PROGRESS",
    "COMPLETED",
    "REJECTED",
    "EXPIRED",
]);

// Tables

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"),
    role: roleEnum("role").default("USER").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    documentType: text("document_type"), // DNI, CE
    documentNumber: text("document_number"),
    phone: text("phone"),
    kycStatus: kycStatusEnum("kyc_status").default("PENDING").notNull(),
    accountType: text("account_type").default("PERSONAL"), // PERSONAL, COMPANY
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const companies = pgTable("companies", {
    id: uuid("id").defaultRandom().primaryKey(),
    ruc: text("ruc").notNull().unique(),
    businessName: text("business_name").notNull(),
    address: text("address"),
    kycStatus: kycStatusEnum("kyc_status").default("PENDING").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companyMembers = pgTable("company_members", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").references(() => companies.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    role: text("role").default("VIEWER"), // OWNER, ADMIN, APPROVER, OPERATOR, VIEWER
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bankAccounts = pgTable("bank_accounts", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id), // Nullable if company account? Or link via ownerType? Assuming user-owned for now or company-owned
    companyId: uuid("company_id").references(() => companies.id),
    alias: text("alias").notNull(),
    bankName: text("bank_name").notNull(),
    accountNumber: text("account_number").notNull(), // Smasked or encrypted ideally
    cci: text("cci"),
    currency: text("currency").notNull(), // PEN, USD
    isVerified: boolean("is_verified").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    companyId: uuid("company_id").references(() => companies.id),
    orderType: orderTypeEnum("order_type").notNull(), // BUY (User sends PEN), SELL (User sends USD)

    amountSend: decimal("amount_send", { precision: 12, scale: 2 }).notNull(),
    amountReceive: decimal("amount_receive", { precision: 12, scale: 2 }).notNull(),
    exchangeRate: decimal("exchange_rate", { precision: 10, scale: 4 }).notNull(),

    originAccountId: uuid("origin_account_id").references(() => bankAccounts.id),
    destinationAccountId: uuid("destination_account_id").references(() => bankAccounts.id),

    status: orderStatusEnum("status").default("DRAFT").notNull(),
    paymentProofRef: text("payment_proof_ref"), // Operation Number

    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderEvents = pgTable("order_events", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orders.id).notNull(),
    status: orderStatusEnum("status").notNull(),
    metadata: text("metadata"), // JSON stringified or generic text
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
