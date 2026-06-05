export type Junction = "AND" | "OR";

export type PanelMode = "rule" | "exit" | "goal";

export interface RuleProperty {
  id: number;
  propertyName: string | null;
  operator: string | null;
  value: string | null;
  unit?: string | null;
}

export interface Rule {
  id: number;
  includeExclude: "Include" | "Exclude";
  ruleType: string | null;
  categoryName: string | null;
  audienceName: string | null;
  audienceOp: string | null;
  properties: RuleProperty[];
  allProperties: string[];
  timeframeValue: number | null;
  timeframeUnit: string;
  coOccurrenceValue: number;
  coOccurrenceUnit: string;
}

export interface DateOperator {
  label: string;
  requiresUnit: boolean;
  suffix?: string;
  inputType?: "datepicker" | "datepicker-range";
}

export interface PropertyDef {
  name: string;
  type: "string" | "number" | "date";
  values?: string[];
  operators?: DateOperator[];
  units?: string[];
}

export interface EventType {
  id: string;
  label: string;
  properties: PropertyDef[];
}

export interface FactGroup {
  id: string;
  label: string;
  properties: PropertyDef[];
}

export interface AudienceSegment {
  id: string;
  label: string;
}

export interface Operator {
  id: string;
  label: string;
}

export interface SavedRuleSummary {
  ruleType: string;
  label: string;
}

export interface TimeDelayConfig {
  mode: "fixed" | "dynamic" | "specific_date";
  value: number;
  unit: string;
  specificDate?: string;
  direction?: string;
  dateSource?: string;
  dateSourceLabel?: string;
  dynamicDate?: string;
  dynamicDateEnd?: string;
  datePassedAction?: string;
  missingWaitValue?: number;
  missingWaitUnit?: string;
  missingAction?: string;
  stopWaitingValue?: number;
  stopWaitingUnit?: string;
}

export interface DestinationConnector {
  id: number;
  platformId: string;
  accountId: string;
}

export interface DestinationConfig {
  connectors: DestinationConnector[];
}

export function createEmptyConnector(): DestinationConnector {
  return {
    id: Date.now() + Math.random(),
    platformId: "",
    accountId: "",
  };
}

export function createEmptyRule(): Rule {
  return {
    id: Date.now() + Math.random(),
    includeExclude: "Include",
    ruleType: null,
    categoryName: null,
    audienceName: null,
    audienceOp: null,
    properties: [],
    allProperties: [],
    timeframeValue: null,
    timeframeUnit: "Days",
    coOccurrenceValue: 1,
    coOccurrenceUnit: "Days",
  };
}
