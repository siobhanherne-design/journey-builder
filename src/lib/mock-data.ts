import type { EventType, FactGroup, AudienceSegment, Operator, DateOperator } from "./types";

const dateOperators: DateOperator[] = [
  { label: "was within the last", requiresUnit: true },
  { label: "was more than", requiresUnit: true, suffix: "ago" },
  { label: "is within the next", requiresUnit: true },
  { label: "is more than", requiresUnit: true, suffix: "away" },
  { label: "is", requiresUnit: false, inputType: "datepicker" },
  { label: "is between", requiresUnit: false, inputType: "datepicker-range" },
];

const dateUnits = ["minutes", "hours", "days", "weeks"];

export const eventTypes: EventType[] = [
  {
    id: "viewed_product",
    label: "Viewed Product",
    properties: [
      { name: "Product Name", type: "string", values: ["Nike Air Max", "Levi's 501 Jeans", "Sony WH-1000XM5", "Zara Linen Blazer", "Samsung Galaxy Tab"] },
      { name: "Category", type: "string", values: ["Footwear", "Apparel", "Electronics", "Homewares", "Sports"] },
      { name: "Brand", type: "string", values: ["Nike", "Levi's", "Sony", "Samsung", "Zara"] },
      { name: "Department", type: "string", values: ["Men's", "Women's", "Kids", "Sports"] },
      { name: "Price", type: "number" },
    ],
  },
  {
    id: "completed_purchase",
    label: "Completed Purchase",
    properties: [
      { name: "Order Value", type: "number" },
      { name: "Payment Method", type: "string", values: ["Credit card", "PayPal", "Afterpay", "Apple Pay"] },
      { name: "Promo Code Used", type: "string", values: ["SUMMER20", "WELCOME10", "FLASH50"] },
      { name: "Items in Order", type: "number" },
    ],
  },
  {
    id: "abandoned_checkout",
    label: "Abandoned Checkout",
    properties: [
      { name: "Cart Value", type: "number" },
      { name: "Items in Cart", type: "number" },
      { name: "Category", type: "string", values: ["Footwear", "Electronics", "Apparel"] },
    ],
  },
  {
    id: "add_to_cart",
    label: "Add to Cart",
    properties: [
      { name: "Product Name", type: "string", values: ["Nike Air Max", "Sony WH-1000XM5", "Levi's 501 Jeans", "Zara Linen Blazer"] },
      { name: "Category", type: "string", values: ["Footwear", "Electronics", "Apparel", "Homewares"] },
      { name: "Price", type: "number" },
    ],
  },
  {
    id: "email_click",
    label: "Email Click",
    properties: [
      { name: "Campaign Name", type: "string", values: ["Summer Sale", "New Arrivals", "VIP Early Access", "Win-back 30 days"] },
      { name: "Link Type", type: "string", values: ["Product", "Homepage", "Sale page", "Category page"] },
    ],
  },
  {
    id: "email_open",
    label: "Email Open",
    properties: [
      { name: "Campaign Name", type: "string", values: ["Summer Sale", "New Arrivals", "VIP Early Access", "Win-back 30 days"] },
      { name: "Device", type: "string", values: ["Mobile", "Desktop"] },
    ],
  },
  {
    id: "viewed_page",
    label: "Page visit",
    properties: [
      { name: "Page Type", type: "string", values: ["Homepage", "Sale", "Category", "Blog", "Brand page"] },
      { name: "Page Name", type: "string", values: ["Men's Sale", "Nike Collection", "Summer Lookbook", "New Arrivals"] },
    ],
  },
  {
    id: "used_search",
    label: "Used Search",
    properties: [
      { name: "Search Term", type: "string", values: ["running shoes", "wireless headphones", "gifts under $50", "summer dresses"] },
      { name: "Results Returned", type: "number" },
    ],
  },
];

export const factGroups: FactGroup[] = [
  {
    id: "customer_details",
    label: "Customer Details",
    properties: [
      { name: "Country", type: "string", values: ["Australia", "UK", "USA", "Germany", "Canada"] },
      { name: "City", type: "string", values: ["Sydney", "London", "New York", "Berlin", "Toronto"] },
      { name: "Gender", type: "string", values: ["Male", "Female", "Non-binary", "Not specified"] },
      { name: "Age Bracket", type: "string", values: ["18–24", "25–34", "35–44", "45–54", "55+"] },
      { name: "Language", type: "string", values: ["English", "German", "French", "Spanish"] },
      { name: "Date of Birth", type: "date", operators: dateOperators, units: dateUnits },
      { name: "Account Created Date", type: "date", operators: dateOperators, units: dateUnits },
    ],
  },
  {
    id: "loyalty",
    label: "Loyalty",
    properties: [
      { name: "Loyalty Tier", type: "string", values: ["Bronze", "Silver", "Gold", "Platinum"] },
      { name: "Points Balance", type: "number" },
      { name: "Member Since", type: "date", operators: dateOperators, units: dateUnits },
    ],
  },
  {
    id: "lifecycle",
    label: "Lifecycle",
    properties: [
      { name: "Lifecycle Stage", type: "string", values: ["New", "Active", "At risk", "Lapsed", "Churned"] },
      { name: "Days Since Last Purchase", type: "number" },
      { name: "Total Orders", type: "number" },
      { name: "Lifetime Value", type: "number" },
      { name: "First Purchase Date", type: "date", operators: dateOperators, units: dateUnits },
      { name: "Last Purchase Date", type: "date", operators: dateOperators, units: dateUnits },
    ],
  },
  {
    id: "preferences",
    label: "Preferences",
    properties: [
      { name: "Preferred Category", type: "string", values: ["Footwear", "Apparel", "Electronics", "Homewares"] },
      { name: "Preferred Brand", type: "string", values: ["Nike", "Zara", "Sony", "Levi's"] },
      { name: "Email Opt-in", type: "string", values: ["True", "False"] },
      { name: "SMS Opt-in", type: "string", values: ["True", "False"] },
    ],
  },
  {
    id: "subscription",
    label: "Subscription",
    properties: [
      { name: "Subscription Status", type: "string", values: ["Active", "Paused", "Cancelled", "Never subscribed"] },
      { name: "Plan", type: "string", values: ["Monthly", "Annual"] },
      { name: "Renewal Date", type: "date", operators: dateOperators, units: dateUnits },
    ],
  },
];

export const audienceSegments: AudienceSegment[] = [
  { id: "high_value_customers", label: "High Value Customers" },
  { id: "lapsed_90_days", label: "Lapsed Customers — 90 Days" },
  { id: "loyalty_gold_platinum", label: "Loyalty Gold & Platinum Members" },
  { id: "abandoned_cart_7d", label: "Abandoned Cart — Last 7 Days" },
  { id: "summer_sale_engagers", label: "Summer Sale Engagers" },
  { id: "new_customers_30d", label: "New Customers — First 30 Days" },
  { id: "vip_early_access", label: "VIP Early Access List" },
  { id: "at_risk_subscribers", label: "At-Risk Subscribers" },
  { id: "winback_candidates", label: "Win-Back Candidates" },
  { id: "mobile_app_users", label: "Mobile App Users" },
];

export const operators: Record<string, Operator[]> = {
  string: [
    { id: "is", label: "is" },
    { id: "is_not", label: "is not" },
    { id: "contains", label: "contains" },
    { id: "does_not_contain", label: "does not contain" },
    { id: "starts_with", label: "starts with" },
    { id: "ends_with", label: "ends with" },
  ],
  number: [
    { id: "equals", label: "equals" },
    { id: "greater_than", label: "greater than" },
    { id: "less_than", label: "less than" },
    { id: "between", label: "between" },
  ],
  date: [
    { id: "before", label: "before" },
    { id: "after", label: "after" },
    { id: "between", label: "between" },
    { id: "in_the_last", label: "in the last" },
  ],
};

export const timeUnits = ["Minutes", "Hours", "Days", "Weeks", "Months"];

export const ruleCategories = [
  { id: "event", label: "Event", description: "Track when something happens" },
  { id: "fact", label: "Profile property", description: "Based on profile attributes" },
  { id: "audience", label: "Audience", description: "Membership in a segment" },
];

export const destinationPlatforms = [
  { id: "facebook", label: "Facebook", color: "#1877F2" },
  { id: "google_ads", label: "Google Ads", color: "#4285F4" },
  { id: "tiktok", label: "TikTok", color: "#010101" },
  { id: "snapchat", label: "Snapchat", color: "#FFFC00" },
  { id: "hubspot", label: "HubSpot", color: "#FF7A59" },
  { id: "salesforce", label: "Salesforce", color: "#00A1E0" },
  { id: "braze", label: "Braze", color: "#1A1A1A" },
  { id: "klaviyo", label: "Klaviyo", color: "#2BDE73" },
];

export const destinationAccounts: Record<string, { id: string; label: string }[]> = {
  facebook: [
    { id: "fb_levi_nl", label: "Levi Strauss & Co. NL (Performance)" },
    { id: "fb_levi_us", label: "Levi Strauss & Co. US (Brand)" },
    { id: "fb_levi_uk", label: "Levi Strauss & Co. UK (Retargeting)" },
  ],
  google_ads: [
    { id: "gads_main", label: "Main Brand Account" },
    { id: "gads_shopping", label: "Shopping Campaigns" },
    { id: "gads_display", label: "Display Network" },
  ],
  tiktok: [
    { id: "tt_brand", label: "Brand Awareness" },
    { id: "tt_perf", label: "Performance Marketing" },
  ],
  snapchat: [
    { id: "snap_main", label: "Snap Ads - Primary" },
    { id: "snap_retarget", label: "Snap Ads - Retargeting" },
  ],
  hubspot: [
    { id: "hs_main", label: "Marketing Hub (Production)" },
    { id: "hs_sandbox", label: "Marketing Hub (Sandbox)" },
  ],
  salesforce: [
    { id: "sf_prod", label: "Production Org" },
    { id: "sf_sandbox", label: "Developer Sandbox" },
  ],
  braze: [
    { id: "braze_prod", label: "Production Workspace" },
    { id: "braze_staging", label: "Staging Workspace" },
  ],
  klaviyo: [
    { id: "kl_main", label: "Primary Account" },
    { id: "kl_test", label: "Test Account" },
  ],
};
