/*
 * File purpose: Shared data model for configurable megamenu columns, items, values, and visibility rules.
 *
 * Imports:
 * - type { ElementType, ReactNode } from "react" provides React types used by megamenu configuration.
 */
import type { ElementType, ReactNode } from "react";
export type RadioVisibilityRule = {
  source: "radio";
  radioGroupId: string;
  value: string;
};

export type CheckboxVisibilityRule = {
  source: "checkbox";
  checkboxId: string;
  checked: boolean;
};

export type MenuVisibilityRule =
  | RadioVisibilityRule
  | CheckboxVisibilityRule;

export type RadioMenuItem = {
  type: "radio";
  id: string;
  label: string;
  groupId: string;
  value: string;
};

export type CheckboxMenuItem = {
  type: "checkbox";
  id: string;
  label: string;
};

export type CommandMenuItem = {
  type: "command";
  id: string;
  label: string;
  icon?: ElementType;
};

export type DropdownMenuItem = {
  type: "dropdown";
  id: string;
  label: string;
  icon?: ElementType;
};

export type SelectMenuItemOption = {
  value: string;
  label: string;
};

export type SelectMenuItem = {
  type: "select";
  id: string;
  label: string;
  options: SelectMenuItemOption[];
  placeholder?: string;
};

export type TextInputMenuItem = {
  type: "text-input";
  id: string;
  label: string;
  placeholder?: string;
};

export type ButtonMenuItem = {
  type: "button";
  id: string;
  label: string;
};

export type DelimiterMenuItem = {
  type: "delimiter";
  id: string;
};

export type MegamenuItem =
  | RadioMenuItem
  | CheckboxMenuItem
  | CommandMenuItem
  | DropdownMenuItem
  | SelectMenuItem
  | TextInputMenuItem
  | ButtonMenuItem
  | DelimiterMenuItem;

export type MegamenuColumn = {
  id: string;
  header?: string;
  items: MegamenuItem[];
  content?: ReactNode;
  slotId?: string;
  visibleWhen?: MenuVisibilityRule;
  width?: number;
};

export type MegamenuConfig = {
  id: string;
  columns: MegamenuColumn[];
  maxColumnsPerRow?: number;
};

export type MegamenuRadioValues = Record<string, string | undefined>;

export type MegamenuCheckboxValues = Record<string, boolean | undefined>;

export type MegamenuFieldValues = Record<string, string | undefined>;
