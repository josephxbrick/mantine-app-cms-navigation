/*
 * File purpose: Edit Publish megamenu guided flow for checking in, marking for publish, and publishing page content.
 *
 * Imports:
 * - Box, Button, Group, Loader, Menu, Stack, Text, UnstyledButton from "@mantine/core" provides Mantine UI primitives used by the custom publish flow.
 * - IconCheck, IconChevronDown from "@tabler/icons-react" provides the completed step icon and picker chevron.
 * - useEffect, useLayoutEffect, useRef, useState from "react" provides local completion and scope state for the guided publish flow.
 * - MegamenuColumnLayout, MegamenuCommandItem, MegamenuCommandLabel from "../../../megamenus/MegamenuRenderer" provides shared dropdown menu presentation.
 */
import {
  Box,
  Button,
  Group,
  Loader,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconCheck,
} from "@tabler/icons-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type {
  CSSProperties,
  Ref,
} from "react";

import {
  MegamenuColumnLayout,
  MegamenuCommandItem,
  MegamenuCommandLabel,
} from "../../../megamenus/MegamenuRenderer";

type PublishStepId = "check-in" | "mark" | "publish";
type PublishScope = "page" | "descendants";
type PublishTarget = "qa" | "staging" | "production";

type PublishFlowState = {
  completedSteps: Set<PublishStepId>;
  pendingUntil: Partial<Record<PublishStepId, number>>;
  checkInScope: PublishScope;
  markScope: PublishScope;
  publishTarget: PublishTarget;
  publishTargetChanged: boolean;
};

type PublishStep = {
  id: PublishStepId;
  title: string;
  actionLabel: string;
};

type PublishStepLayout = {
  stepWidth: number;
  stepGap: number;
};

const PUBLISH_STEP_PENDING_MS = 3350;
const PUBLISH_STEP_GAP = 48;
const PUBLISH_VERTICAL_PADDING = 32;
const PUBLISH_COMPLETE_STATUS_BACKGROUND =
  "var(--mantine-color-green-0)";
const PUBLISH_COMPLETE_STATUS_BORDER =
  "1px solid var(--mantine-color-green-4)";
const PUBLISH_COMPLETE_STATUS_TEXT =
  "var(--mantine-color-asxGray-8)";
const PUBLISH_COMPLETE_STATUS_VERTICAL_PADDING = 12;
const PUBLISH_STEP_TITLE_PRIMARY_COLOR = "asxGray.9";
const PUBLISH_STEP_TITLE_SECONDARY_COLOR = "asxGray.6";

const publishFlowState: PublishFlowState = {
  completedSteps: new Set(),
  pendingUntil: {},
  checkInScope: "page",
  markScope: "page",
  publishTarget: "production",
  publishTargetChanged: false,
};

function normalizePublishFlowState() {
  const now = Date.now();

  Object.entries(publishFlowState.pendingUntil).forEach(
    ([stepId, finishTime]) => {
      if (
        !isPublishStepId(stepId) ||
        typeof finishTime !== "number" ||
        finishTime > now
      ) {
        return;
      }

      delete publishFlowState.pendingUntil[stepId];
      publishFlowState.completedSteps.add(stepId);
    }
  );
}

export function isPublishWizardComplete() {
  normalizePublishFlowState();
  return publishFlowState.completedSteps.has("publish");
}

const publishSteps: PublishStep[] = [
  {
    id: "check-in",
    title: "Check In",
    actionLabel: "Check In",
  },
  {
    id: "mark",
    title: "Mark for Publish",
    actionLabel: "Mark",
  },
  {
    id: "publish",
    title: "Publish",
    actionLabel: "Publish",
  },
];

const publishTargetOptions: {
  value: PublishTarget;
  label: string;
}[] = [
  {
    value: "qa",
    label: "QA",
  },
  {
    value: "staging",
    label: "Staging",
  },
  {
    value: "production",
    label: "Production",
  },
];

function getPublishStepLayout(
  availableWidth: number
): PublishStepLayout {
  const stepCount = publishSteps.length;
  const betweenStepGapCount = Math.max(stepCount - 1, 0);
  const outsideGapCount = 2;
  const totalGapWidth =
    (betweenStepGapCount + outsideGapCount) *
    PUBLISH_STEP_GAP;
  const stepWidth = Math.max(
    0,
    (availableWidth - totalGapWidth) / stepCount
  );

  return {
    stepWidth,
    stepGap: PUBLISH_STEP_GAP,
  };
}

const commandMessages: Record<string, string> = {
  "publish-check-in-page": "Check In Page",
  "publish-check-in-descendants":
    "Check In Page and Descendants",
  "publish-mark-page": "Mark Page for Publish",
  "publish-mark-descendants":
    "Mark Page and Descendants for Publish",
  "publish-page": "Publish",
};

function getCommandId(
  stepId: PublishStepId,
  scope: PublishScope
) {
  if (stepId === "check-in") {
    return scope === "page"
      ? "publish-check-in-page"
      : "publish-check-in-descendants";
  }

  if (stepId === "mark") {
    return scope === "page"
      ? "publish-mark-page"
      : "publish-mark-descendants";
  }

  return "publish-page";
}

function getCompletedStepLabel(
  stepId: PublishStepId,
  scope: PublishScope,
  publishTarget: PublishTarget
) {
  if (stepId === "check-in") {
    return scope === "page"
      ? "This page is checked in."
      : "This page and its children are checked in.";
  }

  if (stepId === "mark") {
    return scope === "page"
      ? "This page is marked."
      : "This page and its children are marked.";
  }

  const selectedTarget =
    publishTargetOptions.find(
      (option) => option.value === publishTarget
    ) ?? publishTargetOptions[0];

  return `Marked pages were published to ${selectedTarget.label}.`;
}

function isStepReady(
  stepId: PublishStepId,
  completedSteps: Set<PublishStepId>
) {
  if (stepId === "check-in") {
    return true;
  }

  if (stepId === "mark") {
    return completedSteps.has("check-in");
  }

  return completedSteps.has("mark");
}

function isPublishStepId(
  value: string
): value is PublishStepId {
  return publishSteps.some((step) => step.id === value);
}

function isPublishTarget(
  value: string
): value is PublishTarget {
  return publishTargetOptions.some(
    (option) => option.value === value
  );
}

type MegamenuPublishProps = {
  sitePublishTarget: string;
};

export default function MegamenuPublish({
  sitePublishTarget,
}: MegamenuPublishProps) {
  normalizePublishFlowState();
  const stepsContainerRef =
    useRef<HTMLDivElement | null>(null);
  const normalizedSitePublishTarget = isPublishTarget(
    sitePublishTarget
  )
    ? sitePublishTarget
    : "production";

  if (!publishFlowState.publishTargetChanged) {
    publishFlowState.publishTarget =
      normalizedSitePublishTarget;
  }

  const pendingTimeoutsRef = useRef<
    ReturnType<typeof window.setTimeout>[]
  >([]);
  const pendingUntilRef = useRef<
    Partial<Record<PublishStepId, number>>
  >(publishFlowState.pendingUntil);
  const [completedSteps, setCompletedSteps] = useState<
    Set<PublishStepId>
  >(() => new Set(publishFlowState.completedSteps));
  const [pendingSteps, setPendingSteps] = useState<
    Set<PublishStepId>
  >(
    () =>
      new Set(
        Object.keys(publishFlowState.pendingUntil).filter(
          isPublishStepId
        )
      )
  );
  const [checkInScope, setCheckInScope] =
    useState<PublishScope>(publishFlowState.checkInScope);
  const [markScope, setMarkScope] =
    useState<PublishScope>(publishFlowState.markScope);
  const [publishTarget, setPublishTarget] =
    useState<PublishTarget>(
      publishFlowState.publishTarget
    );
  const [stepLayout, setStepLayout] =
    useState<PublishStepLayout>(() =>
      getPublishStepLayout(
        320 * publishSteps.length +
          PUBLISH_STEP_GAP *
            (publishSteps.length + 1)
      )
    );
  const [completedStatusMinHeight, setCompletedStatusMinHeight] =
    useState(40);
  const completedStatusHeightsRef = useRef<
    Partial<Record<PublishStepId, number>>
  >({});

  const scopes: Record<PublishStepId, PublishScope> = {
    "check-in": checkInScope,
    mark: markScope,
    publish: "page",
  };

  const scopeSetters: Partial<
    Record<
      PublishStepId,
      (scope: PublishScope) => void
    >
  > = {
    "check-in": setCheckInScope,
    mark: setMarkScope,
  };

  const handleCompletedStatusHeightChange = (
    stepId: PublishStepId,
    height: number
  ) => {
    completedStatusHeightsRef.current[stepId] = height;

    const nextMinHeight = Math.max(
      40,
      ...Object.values(
        completedStatusHeightsRef.current
      ).filter((value): value is number =>
        typeof value === "number"
      )
    );

    setCompletedStatusMinHeight((current) =>
      current === nextMinHeight ? current : nextMinHeight
    );
  };

  function finishPendingStep(stepId: PublishStepId) {
    delete pendingUntilRef.current[stepId];
    delete publishFlowState.pendingUntil[stepId];
    setPendingSteps((current) => {
      const next = new Set(current);
      next.delete(stepId);
      return next;
    });
    setCompletedSteps((current) => {
      const next = new Set(current);
      next.add(stepId);
      publishFlowState.completedSteps = next;
      return next;
    });

    if (
      stepId === "check-in" &&
      checkInScope === "descendants" &&
      markScope !== "descendants"
    ) {
      const timeoutId = window.setTimeout(() => {
        publishFlowState.markScope = "descendants";
        setMarkScope("descendants");
      }, 80);

      pendingTimeoutsRef.current.push(timeoutId);
    }
  }

  useEffect(() => {
    Object.entries(pendingUntilRef.current).forEach(
      ([stepId, finishTime]) => {
        if (
          !isPublishStepId(stepId) ||
          typeof finishTime !== "number"
        ) {
          return;
        }

        const timeoutId = window.setTimeout(
          () => finishPendingStep(stepId),
          Math.max(0, finishTime - Date.now())
        );

        pendingTimeoutsRef.current.push(timeoutId);
      }
    );

    return () => {
      pendingTimeoutsRef.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId)
      );
    };
  }, []);

  useEffect(() => {
    publishFlowState.completedSteps = completedSteps;
    publishFlowState.pendingUntil = pendingUntilRef.current;
    publishFlowState.checkInScope = checkInScope;
    publishFlowState.markScope = markScope;
    publishFlowState.publishTarget = publishTarget;
  }, [
    completedSteps,
    pendingSteps,
    checkInScope,
    markScope,
    publishTarget,
  ]);

  useEffect(() => {
    if (publishFlowState.publishTargetChanged) {
      return;
    }

    publishFlowState.publishTarget =
      normalizedSitePublishTarget;
    setPublishTarget(normalizedSitePublishTarget);
  }, [normalizedSitePublishTarget]);

  useLayoutEffect(() => {
    const element = stepsContainerRef.current;

    if (!element) {
      return;
    }

    const updateLayout = () => {
      setStepLayout(
        getPublishStepLayout(
          element.getBoundingClientRect().width
        )
      );
    };

    updateLayout();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateLayout);

    resizeObserver?.observe(element);
    window.addEventListener("resize", updateLayout);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  const handleChangePublishTarget = (
    value: PublishTarget
  ) => {
    publishFlowState.publishTargetChanged = true;
    publishFlowState.publishTarget = value;
    setPublishTarget(value);
  };

  function completeStep(stepId: PublishStepId) {
    if (pendingSteps.has(stepId)) {
      return;
    }

    const commandId = getCommandId(
      stepId,
      scopes[stepId]
    );

    console.log(commandMessages[commandId] ?? commandId);
    pendingUntilRef.current[stepId] =
      Date.now() + PUBLISH_STEP_PENDING_MS;
    publishFlowState.pendingUntil = pendingUntilRef.current;
    setPendingSteps((current) => {
      const next = new Set(current);
      next.add(stepId);
      return next;
    });
    const timeoutId = window.setTimeout(() => {
      finishPendingStep(stepId);
    }, PUBLISH_STEP_PENDING_MS);

    pendingTimeoutsRef.current.push(timeoutId);
  }

  return (
    <Box
      ref={stepsContainerRef}
      w="100%"
      style={{
        boxSizing: "border-box",
        paddingBlock: PUBLISH_VERTICAL_PADDING,
        paddingInline: stepLayout.stepGap,
      }}
    >
      <Group
        align="stretch"
        wrap="nowrap"
        style={{ gap: stepLayout.stepGap }}
      >
        {publishSteps.map((step, index) => {
          const completed = completedSteps.has(step.id);
          const pending = pendingSteps.has(step.id);
          const ready = isStepReady(
            step.id,
            completedSteps
          );
          const scopeSetter = scopeSetters[step.id];

          return (
            <Group key={step.id} gap={0} wrap="nowrap">
              <PublishStepCard
                step={step}
                stepNumber={index + 1}
                stepWidth={stepLayout.stepWidth}
                completed={completed}
                pending={pending}
                ready={ready}
                scope={scopes[step.id]}
                publishTarget={publishTarget}
                completedStatusMinHeight={
                  completedStatusMinHeight
                }
                onScopeChange={scopeSetter}
                onChangePublishTarget={
                  handleChangePublishTarget
                }
                onCompletedStatusHeightChange={(height) =>
                  handleCompletedStatusHeightChange(
                    step.id,
                    height
                  )
                }
                onComplete={() => completeStep(step.id)}
              />
            </Group>
          );
        })}
      </Group>
    </Box>
  );
}

type PublishStepCardProps = {
  step: PublishStep;
  stepNumber: number;
  stepWidth: number;
  completed: boolean;
  pending: boolean;
  ready: boolean;
  scope: PublishScope;
  publishTarget: PublishTarget;
  completedStatusMinHeight: number;
  onScopeChange?: (scope: PublishScope) => void;
  onChangePublishTarget: (value: PublishTarget) => void;
  onCompletedStatusHeightChange: (height: number) => void;
  onComplete: () => void;
};

function PublishStepCard({
  step,
  stepNumber,
  stepWidth,
  completed,
  pending,
  ready,
  scope,
  publishTarget,
  completedStatusMinHeight,
  onScopeChange,
  onChangePublishTarget,
  onCompletedStatusHeightChange,
  onComplete,
}: PublishStepCardProps) {
  const tone = completed
    ? "var(--mantine-color-green-6)"
    : pending
      ? "var(--mantine-color-orange-6)"
      : "var(--mantine-color-asxBlue-6)";
  const isCurrentStep = ready && !completed;

  return (
    <Stack
      gap={20}
      w={stepWidth}
    >
      <Group align="center" gap={12} wrap="nowrap">
        <StepBadge
          completed={completed}
          pending={pending}
          ready={ready}
          stepNumber={stepNumber}
          tone={tone}
        />
        <Stack gap={4} style={{ minWidth: 0 }}>
          <Text
            fz={12}
            fw={700}
            lh={1}
            c="asxGray.5"
            tt="uppercase"
          >
            Step {stepNumber}
          </Text>
          <Text
            fz={19}
            fw={700}
            lh={1.15}
            c={
              isCurrentStep
                ? PUBLISH_STEP_TITLE_PRIMARY_COLOR
                : PUBLISH_STEP_TITLE_SECONDARY_COLOR
            }
          >
            {step.title}
          </Text>
        </Stack>
      </Group>

      {onScopeChange ? (
        <ScopePicker
          value={scope}
          disabled={!ready || completed}
          onChange={onScopeChange}
        />
      ) : step.id === "publish" ? (
        <PublishTargetPicker
          value={publishTarget}
          disabled={!ready || completed}
          onChange={onChangePublishTarget}
        />
      ) : null}

      <PublishStepButton
        stepId={step.id}
        label={
          completed
            ? getCompletedStepLabel(
                step.id,
                scope,
                publishTarget
              )
            : step.actionLabel
        }
        completed={completed}
        minHeight={completedStatusMinHeight}
        disabled={!ready || pending}
        onCompletedHeightChange={
          onCompletedStatusHeightChange
        }
        onClick={onComplete}
      />
    </Stack>
  );
}

type StepBadgeProps = {
  completed: boolean;
  pending: boolean;
  ready: boolean;
  stepNumber: number;
  tone: string;
};

function StepBadge({
  completed,
  pending,
  ready,
  stepNumber,
  tone,
}: StepBadgeProps) {
  const outlined = !completed && !pending && !ready;

  return (
    <Box
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
        border: outlined ? `1px solid ${tone}` : "none",
        background: outlined ? "transparent" : tone,
        color: outlined ? tone : "white",
        fontSize: 17,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {pending ? (
        <Loader color="white" size={20} />
      ) : completed ? (
        <IconCheck size={24} stroke={2.8} />
      ) : (
        stepNumber
      )}
    </Box>
  );
}

type ScopePickerProps = {
  value: PublishScope;
  disabled: boolean;
  onChange: (scope: PublishScope) => void;
};

function ScopePicker({
  value,
  disabled,
  onChange,
}: ScopePickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageChoiceRef =
    useRef<HTMLButtonElement | null>(null);
  const descendantsChoiceRef =
    useRef<HTMLButtonElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] =
    useState<CSSProperties>({
      left: 3,
      width: "calc(50% - 3px)",
    });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current;
      const selectedChoice =
        value === "page"
          ? pageChoiceRef.current
          : descendantsChoiceRef.current;

      if (!container || !selectedChoice) {
        return;
      }

      const containerRect =
        container.getBoundingClientRect();
      const selectedRect =
        selectedChoice.getBoundingClientRect();

      setIndicatorStyle({
        left: selectedRect.left - containerRect.left,
        width: selectedRect.width,
      });
    };

    updateIndicator();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateIndicator);

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateIndicator);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener(
        "resize",
        updateIndicator
      );
    };
  }, [value]);

  return (
    <Box
      ref={containerRef}
      style={{
        width: "100%",
        padding: 3,
        borderRadius: 10,
        background: disabled
          ? "rgba(255, 255, 255, 0.28)"
          : "rgba(255, 255, 255, 0.4)",
        border: "1px solid var(--mantine-color-asxGray-5)",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "minmax(max-content, 1fr) minmax(max-content, 1fr)",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 3,
          bottom: 3,
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          borderRadius: 8,
          border: disabled
            ? "1px solid var(--mantine-color-asxGray-4)"
            : "1px solid var(--mantine-color-asxGray-5)",
          background: disabled
            ? "rgba(255, 255, 255, 0.72)"
            : "var(--mantine-color-asxBlue-0)",
          boxShadow: disabled
            ? "none"
            : "0 1px 4px rgba(15, 23, 42, 0.1)",
          transition:
            "left 180ms ease, width 180ms ease",
          pointerEvents: "none",
        }}
      />
      <ScopeChoice
        choiceRef={pageChoiceRef}
        label="Page"
        selected={value === "page"}
        disabled={disabled}
        onClick={() => onChange("page")}
      />
      <ScopeChoice
        choiceRef={descendantsChoiceRef}
        label="Page & Children"
        selected={value === "descendants"}
        disabled={disabled}
        onClick={() => onChange("descendants")}
      />
    </Box>
  );
}

type ScopeChoiceProps = {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  choiceRef: Ref<HTMLButtonElement>;
};

function ScopeChoice({
  label,
  selected,
  disabled,
  onClick,
  choiceRef,
}: ScopeChoiceProps) {
  return (
    <UnstyledButton
      ref={choiceRef}
      disabled={disabled}
      onClick={onClick}
      style={{
        minHeight: 36,
        paddingInline: 12,
        borderRadius: 8,
        border: "1px solid transparent",
        background: "transparent",
        color: disabled
          ? selected
            ? "var(--mantine-color-asxGray-6)"
            : "var(--mantine-color-asxGray-5)"
          : selected
            ? "var(--mantine-color-asxBlue-8)"
            : "var(--mantine-color-asxGray-7)",
        fontSize: 14,
        fontWeight: 400,
        textAlign: "center",
        cursor: disabled ? "default" : "pointer",
        position: "relative",
        zIndex: 1,
        flex: "1 1 0",
        minWidth: "max-content",
      }}
    >
      {label}
    </UnstyledButton>
  );
}

type PublishTargetPickerProps = {
  value: PublishTarget;
  disabled: boolean;
  onChange: (value: PublishTarget) => void;
};

function PublishTargetPicker({
  value,
  disabled,
  onChange,
}: PublishTargetPickerProps) {
  const selected =
    publishTargetOptions.find(
      (option) => option.value === value
    ) ?? publishTargetOptions[0];
  const [opened, setOpened] = useState(false);

  const handleChange = (nextValue: PublishTarget) => {
    onChange(nextValue);
    setOpened(false);
  };

  return (
    <Menu
      shadow="md"
      width="target"
      position="bottom-end"
      offset={4}
      withinPortal={false}
      opened={opened}
      onChange={setOpened}
    >
      <Menu.Target>
        <UnstyledButton
          disabled={disabled}
          style={{
            width: "100%",
            height: 44,
            paddingInline: 12,
            borderRadius: 10,
            background: "white",
            border:
              "1px solid var(--mantine-color-asxGray-4)",
            color: disabled
              ? "var(--mantine-color-asxGray-6)"
              : "var(--mantine-color-asxGray-8)",
            cursor: disabled ? "default" : "pointer",
          }}
        >
          <Group justify="space-between" wrap="nowrap">
            <Text fz={14} fw={400}>
              {selected.label}
            </Text>
            <IconChevronDown size={18} stroke={1.6} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown
        px={12}
        py={12}
        onClick={(event) => event.stopPropagation()}
      >
        <MegamenuColumnLayout>
          {publishTargetOptions.map((option) => (
            <MegamenuCommandItem
              key={option.value}
              selected={option.value === selected.value}
              closeParentMegamenu={false}
              onClick={() => handleChange(option.value)}
            >
              <MegamenuCommandLabel>
                {option.label}
              </MegamenuCommandLabel>
            </MegamenuCommandItem>
          ))}
        </MegamenuColumnLayout>
      </Menu.Dropdown>
    </Menu>
  );
}

type PublishStepButtonProps = {
  stepId: PublishStepId;
  label: string;
  completed: boolean;
  minHeight: number;
  disabled: boolean;
  onCompletedHeightChange: (height: number) => void;
  onClick: () => void;
};

function PublishStepButton({
  stepId,
  label,
  completed,
  minHeight,
  disabled,
  onCompletedHeightChange,
  onClick,
}: PublishStepButtonProps) {
  const completedStatusContentRef =
    useRef<HTMLDivElement | null>(null);
  const showPublishDetailsLink =
    completed && stepId === "publish";

  useLayoutEffect(() => {
    if (!completed || !completedStatusContentRef.current) {
      return;
    }

    const element = completedStatusContentRef.current;
    const updateHeight = () => {
      onCompletedHeightChange(
        Math.ceil(
          element.scrollHeight +
            PUBLISH_COMPLETE_STATUS_VERTICAL_PADDING
        )
      );
    };

    updateHeight();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateHeight);

    resizeObserver?.observe(element);

    return () => {
      resizeObserver?.disconnect();
    };
  }, [completed, label, onCompletedHeightChange]);

  if (completed) {
    return (
      <Group
        justify="center"
        h={minHeight}
        w="100%"
        px={8}
        py={6}
        style={{
          borderRadius: 8,
          border: PUBLISH_COMPLETE_STATUS_BORDER,
          background: PUBLISH_COMPLETE_STATUS_BACKGROUND,
          color: PUBLISH_COMPLETE_STATUS_TEXT,
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1.2,
          overflow: "hidden",
          transition: "height 150ms ease-out",
        }}
      >
        <Group
          ref={completedStatusContentRef}
          gap={6}
          align="flex-start"
          wrap="nowrap"
          w="100%"
          style={{ minWidth: 0 }}
        >
          <IconCheck
            size={17}
            stroke={2.4}
            style={{ flexShrink: 0 }}
          />
          <Box
            style={{
              flex: 1,
              minWidth: 0,
              textAlign: "left",
              overflowWrap: "anywhere",
            }}
          >
            <Box component="span">{label}</Box>
            {showPublishDetailsLink ? (
              <UnstyledButton
                onClick={() =>
                  console.log("View publish details")
                }
                style={{
                  display: "block",
                  marginTop: 4,
                  color:
                    "var(--mantine-color-asxBlue-8)",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                View publish details
              </UnstyledButton>
            ) : null}
          </Box>
        </Group>
      </Group>
    );
  }

  return (
    <Button
      variant="light"
      color="asxBlue"
      disabled={disabled}
      onClick={onClick}
      fullWidth
      radius={8}
      size="sm"
      c="asxGray.8"
      fz={15}
      fw={500}
      styles={{
        root: {
          height: minHeight,
          border: "1px solid var(--mantine-color-asxBlue-2)",
          transition: "height 150ms ease-out",
        },
      }}
    >
      {label}
    </Button>
  );
}
