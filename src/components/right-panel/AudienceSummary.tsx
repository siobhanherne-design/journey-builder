"use client";

import type { Rule, Junction } from "@/lib/types";
import { eventTypes, factGroups, audienceSegments } from "@/lib/mock-data";

interface AudienceSummaryProps {
  rules: Rule[];
  junctions: Junction[];
}

function estimateProfiles(rules: Rule[]): number {
  if (rules.length === 0 || rules.every((r) => r.ruleType === null)) return 0;

  let total = 0;
  for (const rule of rules) {
    if (rule.ruleType === "audience" && rule.audienceName) {
      total += Math.floor(Math.random() * 40000 + 8000);
    } else if (rule.ruleType === "event" && rule.categoryName) {
      total += Math.floor(Math.random() * 50000 + 10000);
    } else if (rule.ruleType === "fact" && rule.categoryName) {
      total += Math.floor(Math.random() * 30000 + 5000);
    }
  }
  return total || 304680;
}

function RuleSummaryText({ rule }: { rule: Rule }) {
  if (!rule.ruleType) return null;

  if (rule.ruleType === "event") {
    const event = eventTypes.find((e) => e.id === rule.categoryName);
    const name = event?.label || rule.categoryName || "...";
    return (
      <span>
        Profiles who <strong>{name}</strong>
        {rule.properties.length > 0 && rule.properties[0].propertyName && (
          <>
            {" · "}
            {rule.properties[0].propertyName}
            {rule.properties[0].operator && rule.properties[0].value && (
              <>
                {" "}
                {rule.properties[0].operator} <strong>{rule.properties[0].value}</strong>
              </>
            )}
          </>
        )}
        {rule.coOccurrenceValue && rule.timeframeValue && (
          <>
            {" "}
            more than <strong>{rule.coOccurrenceValue} time</strong> in the last{" "}
            <strong>{rule.timeframeValue} {rule.timeframeUnit.toLowerCase()}</strong>
          </>
        )}
      </span>
    );
  }

  if (rule.ruleType === "audience") {
    const seg = audienceSegments.find((a) => a.id === rule.audienceName);
    return (
      <span>
        profiles who are members of <strong>{seg?.label || rule.audienceName || "..."}</strong>
      </span>
    );
  }

  if (rule.ruleType === "fact") {
    const group = factGroups.find((g) => g.id === rule.categoryName);
    const name = group?.label || rule.categoryName || "...";
    return (
      <span>
        Profiles who <strong>{name}</strong>
        {rule.properties.length > 0 && rule.properties[0].propertyName && (
          <>
            {" · "}
            {rule.properties[0].propertyName}
            {rule.properties[0].operator && rule.properties[0].value && (
              <>
                {" "}
                {rule.properties[0].operator} <strong>{rule.properties[0].value}</strong>
              </>
            )}
          </>
        )}
      </span>
    );
  }

  return null;
}

function RuleGroup({
  label,
  labelColor,
  rules,
  junctions,
  allRules,
}: {
  label: string;
  labelColor: string;
  rules: Rule[];
  junctions: Junction[];
  allRules: Rule[];
}) {
  return (
    <div className="flex gap-3">
      <span
        className="text-[12px] font-semibold w-[72px] flex-shrink-0 pt-px"
        style={{ color: labelColor }}
      >
        {label}
      </span>
      <div className="text-[12px] text-[#6c6e82] leading-relaxed flex-1 min-w-0">
        {rules.map((rule, i) => {
          const globalIndex = allRules.indexOf(rule);
          const junction = globalIndex > 0 ? junctions[globalIndex - 1] : null;
          return (
            <div key={rule.id} className={i > 0 ? "mt-1" : ""}>
              {i > 0 && junction && (
                <span className="font-semibold text-[#1a1b2e] mr-1">
                  {junction}
                </span>
              )}
              <RuleSummaryText rule={rule} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AudienceSummary({ rules, junctions }: AudienceSummaryProps) {
  const count = estimateProfiles(rules);
  const hasRules = rules.some((r) => r.ruleType !== null);

  if (!hasRules) return null;

  const includeRules = rules.filter((r) => r.includeExclude === "Include" && r.ruleType);
  const excludeRules = rules.filter((r) => r.includeExclude === "Exclude" && r.ruleType);

  return (
    <div className="py-3">
      <div className="flex gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          {includeRules.length > 0 && (
            <RuleGroup
              label="Include"
              labelColor="#1a1b2e"
              rules={includeRules}
              junctions={junctions}
              allRules={rules}
            />
          )}
          {excludeRules.length > 0 && (
            <RuleGroup
              label="Don't include"
              labelColor="#1a1b2e"
              rules={excludeRules}
              junctions={junctions}
              allRules={rules}
            />
          )}
        </div>
        <div className="flex-shrink-0 text-right border-l border-[#e5e7f0] pl-4">
          <div className="text-[18px] font-bold text-[#1a1b2e]">
            ~{count.toLocaleString()}
          </div>
          <div className="text-[12px] text-[#9b9daf]">Estimated profiles</div>
        </div>
      </div>
    </div>
  );
}
