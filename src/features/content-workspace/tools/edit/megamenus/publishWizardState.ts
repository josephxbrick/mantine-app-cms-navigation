/*
 * File purpose: Shared in-memory state helpers for the Publish Now wizard.
 */

export type PublishStepId =
  | "check-in"
  | "mark"
  | "publish";
export type PublishScope =
  | "page"
  | "descendants"
  | "site";
export type PublishTarget =
  | "qa"
  | "staging"
  | "production";

type PublishFlowState = {
  completedSteps: Set<PublishStepId>;
  pendingUntil: Partial<Record<PublishStepId, number>>;
  checkInScope: PublishScope;
  markScope: PublishScope;
  publishTarget: PublishTarget;
  publishTargetChanged: boolean;
  runInProgress: boolean;
  mouseAwayCloseDisabledUntil: number;
};

export const PUBLISH_MOUSE_AWAY_CLOSE_GRACE_MS = 1000;

const publishStepIds: PublishStepId[] = [
  "check-in",
  "mark",
  "publish",
];

export const publishFlowState: PublishFlowState = {
  completedSteps: new Set(),
  pendingUntil: {},
  checkInScope: "page",
  markScope: "page",
  publishTarget: "production",
  publishTargetChanged: false,
  runInProgress: false,
  mouseAwayCloseDisabledUntil: 0,
};

export function isPublishStepId(
  value: string
): value is PublishStepId {
  return publishStepIds.includes(value as PublishStepId);
}

export function resetPublishFlowState(
  publishTarget: PublishTarget = "production",
  scope: PublishScope = "page",
  publishTargetChanged = false
) {
  publishFlowState.completedSteps = new Set();
  publishFlowState.pendingUntil = {};
  publishFlowState.checkInScope = scope;
  publishFlowState.markScope = scope;
  publishFlowState.publishTarget = publishTarget;
  publishFlowState.publishTargetChanged =
    publishTargetChanged;
  publishFlowState.runInProgress = false;
  publishFlowState.mouseAwayCloseDisabledUntil = 0;
}

export function normalizePublishFlowState() {
  const now = Date.now();
  let hasPendingStep = false;

  Object.entries(publishFlowState.pendingUntil).forEach(
    ([stepId, finishTime]) => {
      if (
        !isPublishStepId(stepId) ||
        typeof finishTime !== "number" ||
        finishTime <= now
      ) {
        return;
      }

      hasPendingStep = true;
      publishFlowState.runInProgress = true;
    }
  );

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

      if (stepId === "publish") {
        publishFlowState.runInProgress = false;
        publishFlowState.mouseAwayCloseDisabledUntil = Math.max(
          publishFlowState.mouseAwayCloseDisabledUntil,
          finishTime + PUBLISH_MOUSE_AWAY_CLOSE_GRACE_MS
        );
      }
    }
  );

  if (publishFlowState.completedSteps.has("publish")) {
    publishFlowState.runInProgress = false;
    return;
  }

  if (
    hasPendingStep ||
    publishFlowState.runInProgress ||
    publishFlowState.completedSteps.size > 0
  ) {
    publishFlowState.runInProgress = true;
  }
}

export function isPublishWizardMouseAwayCloseDisabled() {
  normalizePublishFlowState();

  return (
    publishFlowState.runInProgress ||
    Date.now() <
      publishFlowState.mouseAwayCloseDisabledUntil
  );
}

export function isPublishWizardRunning() {
  normalizePublishFlowState();
  return publishFlowState.runInProgress;
}

export function getPublishWizardMouseAwayCloseDisabledRemainingMs() {
  normalizePublishFlowState();

  if (publishFlowState.runInProgress) {
    return 100;
  }

  return Math.max(
    0,
    publishFlowState.mouseAwayCloseDisabledUntil -
      Date.now()
  );
}
