/*
 * Megamenu data contracts.
 * - Defines config, column, item, radio, and checkbox value shapes.
 * - Used by the generic megamenu renderer and edit-menu configs.
 */
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
  icon?: React.ElementType;
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

export type MegamenuItem =
  | RadioMenuItem
  | CheckboxMenuItem
  | CommandMenuItem
  | SelectMenuItem
  | TextInputMenuItem
  | ButtonMenuItem;

export type MegamenuColumn = {
  id: string;
  header?: string;
  items: MegamenuItem[];
  slotId?: string;
  visibleWhen?: MenuVisibilityRule;
};

export type MegamenuConfig = {
  id: string;
  columns: MegamenuColumn[];
};

export type MegamenuRadioValues = Record<string, string | undefined>;

export type MegamenuCheckboxValues = Record<string, boolean | undefined>;

export type MegamenuFieldValues = Record<string, string | undefined>;
