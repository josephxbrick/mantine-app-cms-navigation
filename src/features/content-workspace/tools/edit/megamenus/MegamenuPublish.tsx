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
import {
  PUBLISH_MOUSE_AWAY_CLOSE_GRACE_MS,
  isPublishStepId,
  normalizePublishFlowState,
  publishFlowState,
  resetPublishFlowState,
} from "./publishWizardState";
import type {
  PublishScope,
  PublishStepId,
  PublishTarget,
} from "./publishWizardState";

type PublishStep = {
  id: PublishStepId;
  title: string;
};

type PublishStepLayout = {
  stepWidth: number;
  stepGap: number;
};

const PUBLISH_STEP_PENDING_MS = 3350;
const PUBLISH_REVEAL_DURATION_MS = 300;
const PUBLISH_CLEAR_DURATION_MS = 250;
const PUBLISH_CLEAR_ENABLE_DELAY_MS = 500;
const PUBLISH_STEP_START_DELAY_MS = PUBLISH_REVEAL_DURATION_MS;
const PUBLISH_STEP_GAP = 48;
const PUBLISH_STEP_MAX_WIDTH = 400;
const PUBLISH_REVEAL_TRANSITION = `${PUBLISH_REVEAL_DURATION_MS}ms ease-out`;
const PUBLISH_CLEAR_TRANSITION = `${PUBLISH_CLEAR_DURATION_MS}ms ease-out`;
const PUBLISH_VERTICAL_PADDING = 32;
const PUBLISH_COMPLETE_STATUS_BACKGROUND =
  "var(--mantine-color-green-0)";
const PUBLISH_COMPLETE_STATUS_BORDER =
  "1px solid var(--mantine-color-green-4)";
const PUBLISH_COMPLETE_STATUS_TEXT =
  "var(--mantine-color-asxGray-8)";
const PUBLISH_COMPLETE_STATUS_VERTICAL_PADDING = 12;
const PUBLISH_PENDING_STATUS_BACKGROUND =
  "var(--mantine-color-asxGray-1)";
const PUBLISH_PENDING_STATUS_BORDER =
  "1px solid var(--mantine-color-asxGray-4)";
const PUBLISH_STEP_TITLE_PRIMARY_COLOR = "asxGray.9";
const PUBLISH_STEP_TITLE_SECONDARY_COLOR = "asxGray.6";
const PUBLISH_CONTROL_GAP = 30;
const PUBLISH_TARGET_CONTROL_MIN_WIDTH = 240;
const PUBLISH_TARGET_CONTROL_MAX_WIDTH = 400;
const PUBLISH_START_BUTTON_HORIZONTAL_PADDING = 44;
const PUBLISH_START_BUTTON_WIDTH_TRANSITION =
  "width 133ms ease-out";
const PUBLISH_CONTROLS_MAX_WIDTH = 1200;

const publishSteps: PublishStep[] = [
  {
    id: "check-in",
    title: "Check In",
  },
  {
    id: "mark",
    title: "Mark for Publish",
  },
  {
    id: "publish",
    title: "Publish Marked Pages",
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
    stepWidth: Math.min(stepWidth, PUBLISH_STEP_MAX_WIDTH),
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
  "publish-check-in-site": "Check In Site",
  "publish-mark-site": "Mark Site for Publish",
  "publish-site": "Publish Site",
  "publish-page": "Publish",
};

function getCommandId(
  stepId: PublishStepId,
  scope: PublishScope
) {
  if (stepId === "check-in") {
    if (scope === "site") {
      return "publish-check-in-site";
    }

    return scope === "page"
      ? "publish-check-in-page"
      : "publish-check-in-descendants";
  }

  if (stepId === "mark") {
    if (scope === "site") {
      return "publish-mark-site";
    }

    return scope === "page"
      ? "publish-mark-page"
      : "publish-mark-descendants";
  }

  return scope === "site" ? "publish-site" : "publish-page";
}

function getCompletedStepLabel(
  stepId: PublishStepId,
  scope: PublishScope,
  publishTarget: PublishTarget
) {
  if (stepId === "check-in") {
    if (scope === "site") {
      return "Every page in the site is checked in.";
    }

    return scope === "page"
      ? "This page is checked in."
      : "This page and its children are checked in.";
  }

  if (stepId === "mark") {
    if (scope === "site") {
      return "Every page in the site is marked.";
    }

    return scope === "page"
      ? "This page is marked."
      : "This page and its children are marked.";
  }

  const selectedTarget =
    publishTargetOptions.find(
      (option) => option.value === publishTarget
    ) ?? publishTargetOptions[0];

  return scope === "site"
    ? `Every page in the site was published to ${selectedTarget.label}.`
    : `All marked pages were published to ${selectedTarget.label}.`;
}

function getPendingStepLabel(
  stepId: PublishStepId,
  scope: PublishScope,
  publishTarget: PublishTarget
) {
  if (stepId === "check-in") {
    if (scope === "site") {
      return "Checking in every page in the site.";
    }

    return scope === "page"
      ? "Checking in this page."
      : "Checking in this page and its children.";
  }

  if (stepId === "mark") {
    if (scope === "site") {
      return "Marking every page in the site for publish.";
    }

    return scope === "page"
      ? "Marking this page for publish."
      : "Marking this page and its children for publish.";
  }

  const selectedTarget =
    publishTargetOptions.find(
      (option) => option.value === publishTarget
    ) ?? publishTargetOptions[0];

  return scope === "site"
    ? `Publishing every page in the site to ${selectedTarget.label}.`
    : `Publishing all marked pages to ${selectedTarget.label}.`;
}

function getWaitingStepLabel(
  stepId: PublishStepId,
  scope: PublishScope,
  publishTarget: PublishTarget
) {
  if (stepId === "check-in") {
    if (scope === "site") {
      return "Every page in the site will be checked in.";
    }

    return scope === "page"
      ? "This page will be checked in."
      : "This page and its children will be checked in.";
  }

  if (stepId === "mark") {
    if (scope === "site") {
      return "Every page in the site will be marked for publish.";
    }

    return scope === "page"
      ? "This page will be marked for publish."
      : "This page and its children will be marked for publish.";
  }

  const selectedTarget =
    publishTargetOptions.find(
      (option) => option.value === publishTarget
    ) ?? publishTargetOptions[0];

  return scope === "site"
    ? `Every page in the site will publish to ${selectedTarget.label}.`
    : `All marked pages will publish to ${selectedTarget.label}.`;
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

function isPublishTarget(
  value: string
): value is PublishTarget {
  return publishTargetOptions.some(
    (option) => option.value === value
  );
}

type MegamenuPublishProps = {
  sitePublishTarget: string;
  showSiteScope: boolean;
};

export default function MegamenuPublish({
  sitePublishTarget,
  showSiteScope,
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
  const [runStarted, setRunStarted] = useState(
    () =>
      publishFlowState.completedSteps.size > 0 ||
      Object.keys(publishFlowState.pendingUntil).length > 0
  );
  const [sequenceActive, setSequenceActive] = useState(
    () =>
      publishFlowState.completedSteps.size > 0 ||
      Object.keys(publishFlowState.pendingUntil).length > 0
  );
  const [clearingResults, setClearingResults] =
    useState(false);
  const [clearResultsEnabled, setClearResultsEnabled] =
    useState(() => completedSteps.has("publish"));
  const [stepLayout, setStepLayout] =
    useState<PublishStepLayout>(() =>
      getPublishStepLayout(
        320 * publishSteps.length +
          PUBLISH_STEP_GAP *
            (publishSteps.length + 1)
      )
    );
  const [statusMinHeight, setStatusMinHeight] =
    useState(40);
  const statusHeightsRef = useRef<
    Partial<Record<PublishStepId, number>>
  >({});
  const wizardComplete = completedSteps.has("publish");

  const scopes: Record<PublishStepId, PublishScope> = {
    "check-in": checkInScope,
    mark: checkInScope,
    publish: checkInScope,
  };

  const handleStatusHeightChange = (
    stepId: PublishStepId,
    height: number
  ) => {
    statusHeightsRef.current[stepId] = height;

    const nextMinHeight = Math.max(
      40,
      ...Object.values(
        statusHeightsRef.current
      ).filter((value): value is number =>
        typeof value === "number"
      )
    );

    setStatusMinHeight((current) =>
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

    publishFlowState.markScope = checkInScope;
    setMarkScope(checkInScope);

    if (stepId === "publish") {
      publishFlowState.runInProgress = false;
      publishFlowState.mouseAwayCloseDisabledUntil =
        Date.now() + PUBLISH_MOUSE_AWAY_CLOSE_GRACE_MS;
    }
  }

  function resetPublishWizard() {
    const nextScope = checkInScope;
    const nextPublishTarget = publishTarget;
    const nextPublishTargetChanged =
      publishFlowState.publishTargetChanged;

    pendingTimeoutsRef.current.forEach((timeoutId) =>
      window.clearTimeout(timeoutId)
    );
    pendingTimeoutsRef.current = [];
    pendingUntilRef.current = {};
    statusHeightsRef.current = {};
    resetPublishFlowState(
      nextPublishTarget,
      nextScope,
      nextPublishTargetChanged
    );
    setCompletedSteps(new Set());
    setPendingSteps(new Set());
    setCheckInScope(nextScope);
    setMarkScope(nextScope);
    setPublishTarget(nextPublishTarget);
    setRunStarted(false);
    setSequenceActive(false);
    setStatusMinHeight(40);
    setClearResultsEnabled(false);
  }

  useEffect(() => {
    if (!wizardComplete) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setClearResultsEnabled(true);
    }, PUBLISH_CLEAR_ENABLE_DELAY_MS);

    pendingTimeoutsRef.current.push(timeoutId);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [wizardComplete]);

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

  const handleChangeScope = (scope: PublishScope) => {
    publishFlowState.checkInScope = scope;
    publishFlowState.markScope = scope;
    setCheckInScope(scope);
    setMarkScope(scope);
  };

  useEffect(() => {
    if (showSiteScope || checkInScope !== "site") {
      return;
    }

    handleChangeScope("page");
  }, [showSiteScope, checkInScope]);

  const handleStartRun = () => {
    if (runStarted || completedSteps.has("publish")) {
      return;
    }

    setRunStarted(true);
    publishFlowState.runInProgress = true;
    publishFlowState.mouseAwayCloseDisabledUntil = 0;
    const timeoutId = window.setTimeout(() => {
      setSequenceActive(true);
    }, PUBLISH_STEP_START_DELAY_MS);

    pendingTimeoutsRef.current.push(timeoutId);
  };

  const handleClearResults = () => {
    if (!clearResultsEnabled || clearingResults) {
      return;
    }

    setClearingResults(true);
    const timeoutId = window.setTimeout(() => {
      resetPublishWizard();
      setClearingResults(false);
    }, PUBLISH_CLEAR_DURATION_MS);

    pendingTimeoutsRef.current.push(timeoutId);
  };

  function startStep(stepId: PublishStepId) {
    if (
      pendingSteps.has(stepId) ||
      completedSteps.has(stepId)
    ) {
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

  useEffect(() => {
    if (
      !sequenceActive ||
      completedSteps.has("publish") ||
      pendingSteps.size > 0
    ) {
      return;
    }

    const nextStep = publishSteps.find(
      (step) =>
        !completedSteps.has(step.id) &&
        isStepReady(step.id, completedSteps)
    );

    if (!nextStep) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startStep(nextStep.id);
    }, 220);

    pendingTimeoutsRef.current.push(timeoutId);
  }, [
    completedSteps,
    pendingSteps,
    checkInScope,
    publishTarget,
    sequenceActive,
  ]);

  const hasRunStarted =
    !clearingResults &&
    (runStarted ||
      completedSteps.size > 0 ||
      pendingSteps.size > 0);
  const activeStepId = hasRunStarted
    ? publishSteps.find((step) =>
        pendingSteps.has(step.id)
      )?.id ??
      publishSteps.find(
        (step) =>
          !completedSteps.has(step.id) &&
          isStepReady(step.id, completedSteps)
      )?.id ??
      null
    : null;

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
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PublishWizardControls
          scope={checkInScope}
          publishTarget={publishTarget}
          showSiteScope={showSiteScope}
          disabled={
            wizardComplete
              ? !clearResultsEnabled
              : hasRunStarted
          }
          mode={clearResultsEnabled ? "clear" : "start"}
          onScopeChange={handleChangeScope}
          onChangePublishTarget={handleChangePublishTarget}
          onStart={handleStartRun}
          onClearResults={handleClearResults}
        />
        <Box
          style={{
            display: "grid",
            gridTemplateRows: hasRunStarted ? "1fr" : "0fr",
            marginTop: hasRunStarted
              ? "var(--mantine-spacing-xl)"
              : 0,
            opacity: hasRunStarted ? 1 : 0,
            transition:
              `grid-template-rows ${
                clearingResults
                  ? PUBLISH_CLEAR_TRANSITION
                  : PUBLISH_REVEAL_TRANSITION
              }, ` +
              `margin-top ${
                clearingResults
                  ? PUBLISH_CLEAR_TRANSITION
                  : PUBLISH_REVEAL_TRANSITION
              }, ` +
              `opacity ${
                clearingResults
                  ? PUBLISH_CLEAR_TRANSITION
                  : PUBLISH_REVEAL_TRANSITION
              }`,
          }}
        >
          <Box style={{ minHeight: 0, overflow: "hidden" }}>
            <Stack gap="xl">
              <Box
                aria-hidden="true"
                h={1}
                w="100%"
                bg="asxGray.4"
              />
              <Group
                align="stretch"
                wrap="nowrap"
                style={{ gap: stepLayout.stepGap }}
              >
                {publishSteps.map((step, index) => {
                  const completed = completedSteps.has(step.id);
                  const pending = pendingSteps.has(step.id);
                  return (
                    <Group key={step.id} gap={0} wrap="nowrap">
                      <PublishStepCard
                        step={step}
                        stepNumber={index + 1}
                        stepWidth={stepLayout.stepWidth}
                        completed={completed}
                        pending={pending}
                        active={activeStepId === step.id}
                        scope={scopes[step.id]}
                        publishTarget={publishTarget}
                        statusMinHeight={statusMinHeight}
                        onStatusHeightChange={(height) =>
                          handleStatusHeightChange(
                            step.id,
                            height
                          )
                        }
                      />
                    </Group>
                  );
                })}
              </Group>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

type PublishWizardControlsProps = {
  scope: PublishScope;
  publishTarget: PublishTarget;
  showSiteScope: boolean;
  disabled: boolean;
  mode: "start" | "clear";
  onScopeChange: (scope: PublishScope) => void;
  onChangePublishTarget: (value: PublishTarget) => void;
  onStart: () => void;
  onClearResults: () => void;
};

function PublishWizardControls({
  scope,
  publishTarget,
  showSiteScope,
  disabled,
  mode,
  onScopeChange,
  onChangePublishTarget,
  onStart,
  onClearResults,
}: PublishWizardControlsProps) {
  const buttonLabel =
    mode === "clear" ? "Clear Results" : "Start";
  const buttonLabelMeasureRef =
    useRef<HTMLSpanElement | null>(null);
  const [buttonWidth, setButtonWidth] = useState<
    number | undefined
  >();

  useLayoutEffect(() => {
    const labelElement = buttonLabelMeasureRef.current;

    if (!labelElement) {
      return;
    }

    setButtonWidth(
      Math.ceil(
        labelElement.getBoundingClientRect().width
      ) + PUBLISH_START_BUTTON_HORIZONTAL_PADDING
    );
  }, [buttonLabel]);

  return (
    <Stack gap={14}>
      <Text fz={18} fw={700} c="asxGray.9">
        Publish Now
      </Text>
      <Box
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          gap: PUBLISH_CONTROL_GAP,
          width: "100%",
          maxWidth: PUBLISH_CONTROLS_MAX_WIDTH,
          flexWrap: "nowrap",
        }}
      >
        <Stack
          gap={6}
          style={{
            flex: "0 0 auto",
            width: "max-content",
          }}
        >
          <Text fz="md" fw={500} c="asxGray.7">
            Choose Check-in Scope
          </Text>
          <ScopePicker
            value={scope}
            showSiteScope={showSiteScope}
            disabled={disabled}
            onChange={onScopeChange}
          />
        </Stack>
        <Stack
          gap={6}
          style={{
            flex: "1 1 0",
            minWidth: PUBLISH_TARGET_CONTROL_MIN_WIDTH,
            maxWidth: PUBLISH_TARGET_CONTROL_MAX_WIDTH,
          }}
        >
          <Text fz="md" fw={500} c="asxGray.7">
            Choose Publishing Target
          </Text>
          <PublishTargetPicker
            value={publishTarget}
            disabled={disabled}
            onChange={onChangePublishTarget}
          />
        </Stack>
        <Box style={{ position: "relative", flexShrink: 0 }}>
          <Box
            component="span"
            ref={buttonLabelMeasureRef}
            style={{
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "nowrap",
              fontSize: "var(--mantine-font-size-md)",
              fontWeight: 700,
              pointerEvents: "none",
            }}
          >
            {buttonLabel}
          </Box>
          <Button
            color="asxBlue"
            disabled={disabled}
            onClick={
              mode === "clear" ? onClearResults : onStart
            }
            h={44}
            px={22}
            radius={10}
            fz="md"
            fw={700}
            style={{
              width: buttonWidth,
              transition: PUBLISH_START_BUTTON_WIDTH_TRANSITION,
              whiteSpace: "nowrap",
            }}
          >
            {buttonLabel}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
}

type PublishStepCardProps = {
  step: PublishStep;
  stepNumber: number;
  stepWidth: number;
  completed: boolean;
  pending: boolean;
  active: boolean;
  scope: PublishScope;
  publishTarget: PublishTarget;
  statusMinHeight: number;
  onStatusHeightChange: (height: number) => void;
};

function PublishStepCard({
  step,
  stepNumber,
  stepWidth,
  completed,
  pending,
  active,
  scope,
  publishTarget,
  statusMinHeight,
  onStatusHeightChange,
}: PublishStepCardProps) {
  const tone = completed
    ? "var(--mantine-color-green-6)"
    : pending
      ? "var(--mantine-color-orange-6)"
      : "var(--mantine-color-asxBlue-6)";
  const isCurrentStep = active && !completed;

  return (
    <Stack
      gap="xl"
      w={stepWidth}
    >
      <Group align="center" gap={12} wrap="nowrap">
        <StepBadge
          completed={completed}
          pending={pending}
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

      <PublishStepStatus
        stepId={step.id}
        label={
          completed
            ? getCompletedStepLabel(
                step.id,
                scope,
                publishTarget
              )
            : pending || active
              ? getPendingStepLabel(
                  step.id,
                  scope,
                  publishTarget
                )
              : getWaitingStepLabel(
                  step.id,
                  scope,
                  publishTarget
                )
        }
        completed={completed}
        active={active}
        minHeight={statusMinHeight}
        onStatusHeightChange={onStatusHeightChange}
      />
    </Stack>
  );
}

type StepBadgeProps = {
  completed: boolean;
  pending: boolean;
  stepNumber: number;
  tone: string;
};

function StepBadge({
  completed,
  pending,
  stepNumber,
  tone,
}: StepBadgeProps) {
  const outlined = !completed && !pending;

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
  showSiteScope: boolean;
  disabled: boolean;
  onChange: (scope: PublishScope) => void;
};

function ScopePicker({
  value,
  showSiteScope,
  disabled,
  onChange,
}: ScopePickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageChoiceRef =
    useRef<HTMLButtonElement | null>(null);
  const descendantsChoiceRef =
    useRef<HTMLButtonElement | null>(null);
  const siteChoiceRef =
    useRef<HTMLButtonElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] =
    useState<CSSProperties>({
      left: 3,
      width: "calc(50% - 3px)",
    });
  const [indicatorReady, setIndicatorReady] =
    useState(false);
  const indicatorMeasuredRef = useRef(false);
  const indicatorReadyFrameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current;
      const selectedChoice =
        value === "page"
          ? pageChoiceRef.current
          : value === "descendants"
            ? descendantsChoiceRef.current
            : showSiteScope
              ? siteChoiceRef.current
              : pageChoiceRef.current;

      if (!container || !selectedChoice) {
        return;
      }

      const containerRect =
        container.getBoundingClientRect();
      const selectedRect =
        selectedChoice.getBoundingClientRect();

      const nextIndicatorStyle = {
        left: selectedRect.left - containerRect.left,
        width: selectedRect.width,
      };

      if (!indicatorMeasuredRef.current) {
        indicatorMeasuredRef.current = true;
        setIndicatorReady(false);
        setIndicatorStyle(nextIndicatorStyle);

        if (indicatorReadyFrameRef.current !== null) {
          window.cancelAnimationFrame(
            indicatorReadyFrameRef.current
          );
        }

        indicatorReadyFrameRef.current =
          window.requestAnimationFrame(() => {
            indicatorReadyFrameRef.current = null;
            setIndicatorReady(true);
          });
        return;
      }

      setIndicatorStyle(nextIndicatorStyle);
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
      if (indicatorReadyFrameRef.current !== null) {
        window.cancelAnimationFrame(
          indicatorReadyFrameRef.current
        );
      }
      window.removeEventListener(
        "resize",
        updateIndicator
      );
    };
  }, [value, showSiteScope]);

  return (
    <Box
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "max-content",
        padding: 3,
        borderRadius: 10,
        background: disabled
          ? "rgba(255, 255, 255, 0.28)"
          : "rgba(255, 255, 255, 0.4)",
        border: "1px solid var(--mantine-color-asxGray-5)",
        position: "relative",
        display: "flex",
        alignItems: "center",
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
          transition: indicatorReady
            ? "left 133ms ease-out, width 133ms ease-out"
            : "none",
          pointerEvents: "none",
        }}
      />
      <ScopeChoice
        choiceRef={pageChoiceRef}
        label="This Page"
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
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: showSiteScope ? "1fr" : "0fr",
          opacity: showSiteScope ? 1 : 0,
          transition:
            "grid-template-columns 220ms ease-out, opacity 220ms ease-out",
        }}
      >
        <Box style={{ minWidth: 0, overflow: "hidden" }}>
          <ScopeChoice
            choiceRef={siteChoiceRef}
            label="Site"
            selected={value === "site"}
            disabled={disabled || !showSiteScope}
            onClick={() => onChange("site")}
          />
        </Box>
      </Box>
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
        paddingInline: "var(--mantine-spacing-xl)",
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
        fontSize: "var(--mantine-font-size-md)",
        fontWeight: 400,
        textAlign: "center",
        cursor: disabled ? "default" : "pointer",
        position: "relative",
        zIndex: 1,
        flex: "0 0 auto",
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
              "1px solid var(--mantine-color-asxGray-5)",
            color: disabled
              ? "var(--mantine-color-asxGray-6)"
              : "var(--mantine-color-asxGray-8)",
            cursor: disabled ? "default" : "pointer",
          }}
        >
          <Group justify="space-between" wrap="nowrap">
            <Text fz="md" fw={400}>
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

type PublishStepStatusProps = {
  stepId: PublishStepId;
  label: string;
  completed: boolean;
  active: boolean;
  minHeight: number;
  onStatusHeightChange: (height: number) => void;
};

function PublishStepStatus({
  stepId,
  label,
  completed,
  active,
  minHeight,
  onStatusHeightChange,
}: PublishStepStatusProps) {
  const statusContentRef =
    useRef<HTMLDivElement | null>(null);
  const showPublishDetailsLink =
    completed && stepId === "publish";

  useLayoutEffect(() => {
    if (!statusContentRef.current) {
      return;
    }

    const element = statusContentRef.current;
    const updateHeight = () => {
      onStatusHeightChange(
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
  }, [label, onStatusHeightChange]);

  return (
    <Group
      justify="center"
      h={minHeight}
      w="100%"
      px={8}
      py={6}
      style={{
        borderRadius: 8,
        border: completed
          ? PUBLISH_COMPLETE_STATUS_BORDER
          : PUBLISH_PENDING_STATUS_BORDER,
        background: completed
          ? PUBLISH_COMPLETE_STATUS_BACKGROUND
          : PUBLISH_PENDING_STATUS_BACKGROUND,
        color: completed
          ? PUBLISH_COMPLETE_STATUS_TEXT
          : "var(--mantine-color-asxGray-8)",
        fontSize: "var(--mantine-font-size-md)",
        fontWeight: active || completed ? 500 : 400,
        lineHeight: 1.2,
        overflow: "hidden",
        opacity: 1,
        transition:
          "height 150ms ease-out, background-color 150ms ease-out, border-color 150ms ease-out, opacity 150ms ease-out",
      }}
    >
      <Group
        ref={statusContentRef}
        gap={6}
        align="flex-start"
        wrap="nowrap"
        w="100%"
        style={{ minWidth: 0 }}
      >
        {completed ? (
          <IconCheck
            size={17}
            stroke={2.4}
            style={{ flexShrink: 0 }}
          />
        ) : null}
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
                color: "var(--mantine-color-asxBlue-8)",
                fontSize: "var(--mantine-font-size-md)",
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
