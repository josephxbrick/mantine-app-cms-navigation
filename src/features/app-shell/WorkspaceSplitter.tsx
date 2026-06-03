/*
 * File purpose: Resizable splitter between the left navigation panel and the content workspace.
 *
 * Imports:
 * - Box from "@mantine/core" provides Mantine UI primitives, theme helpers, component types, or styling utilities used in this file.
 * - type { ReactNode } from "react" provides React hooks, refs, component helpers, or React-only types used in this file.
 */
import { Box } from "@mantine/core";
import type { ReactNode } from "react";

type WorkspaceSplitterProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

const DEFAULT_MIN = 260;
const DEFAULT_MAX = 100000;
const KEYBOARD_STEP = 16;

type DisplayGroupProps = {
  children: ReactNode;
  value: number;
  min: number;
  max: number;
  onPointerDown: (
    event: React.PointerEvent<HTMLDivElement>
  ) => void;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => void;
};

function DisplayGroup({
  children,
  value,
  min,
  max,
  onPointerDown,
  onKeyDown,
}: DisplayGroupProps) {
  return (
    <Box
      role="separator"
      aria-orientation="vertical"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      h="100%"
      w={9}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{
        alignSelf: "stretch",
        cursor: "col-resize",
        position: "absolute",
        left: "50%",
        top: 0,
        transform: "translateX(-50%)",
        flexShrink: 0,
        zIndex: 20,
        outline: "none",
        background: "transparent",
      }}
    >
      {children}
    </Box>
  );
}

function SplitterLine() {
  return (
    <Box
      className="workspace-splitter-line"
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        bottom: 0,
        width: 1,
        transform: "translateX(-50%)",
        borderRadius: 999,
        background: "var(--mantine-color-asxIndigo-3)",
        transition: "opacity 140ms ease, width 140ms ease",
      }}
    />
  );
}

function SplitterGrabber() {
  return (
    <Box
      className="workspace-splitter-grabber"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 9,
        height: 44,
        transform: "translate(-50%, -50%)",
        borderRadius: 999,
        border:
          "1px solid var(--mantine-color-asxIndigo-7)",
        background: "var(--mantine-color-asxGray-0)",
        transition:
          "height 140ms ease, background 140ms ease, border-color 140ms ease",
      }}
    >
      {[0, 1, 2].map((dot) => (
        <GrabberDot key={dot} index={dot} />
      ))}
    </Box>
  );
}

type GrabberDotProps = {
  index: number;
};

function GrabberDot({ index }: GrabberDotProps) {
  return (
    <Box
      style={{
        position: "absolute",
        left: "50%",
        top: 12 + index * 9,
        width: 3,
        height: 3,
        transform: "translateX(-50%)",
        borderRadius: 999,
        background: "var(--mantine-color-asxIndigo-7)",
      }}
    />
  );
}

function SplitterInteractionStyles() {
  return (
    <style>
      {`
        [role="separator"]:hover .workspace-splitter-line,
        [role="separator"]:focus-visible .workspace-splitter-line {
          width: 2px;
        }

        [role="separator"]:hover .workspace-splitter-grabber,
        [role="separator"]:focus-visible .workspace-splitter-grabber {
          height: 52px;
          background: var(--mantine-color-asxIndigo-0);
          border-color: var(--mantine-color-asxIndigo-8);
        }
      `}
    </style>
  );
}

export function WorkspaceSplitter({
  value,
  onChange,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
}: WorkspaceSplitterProps) {
  const clampValue = (nextValue: number) =>
    Math.min(Math.max(nextValue, min), max);

  const startResize = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    const startX = event.clientX;
    const startValue = value;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const resize = (moveEvent: PointerEvent) => {
      const nextValue =
        startValue + moveEvent.clientX - startX;
      onChange(clampValue(nextValue));
    };

    const stopResize = () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };

    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
  };

  const resizeWithKeyboard = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onChange(clampValue(value - KEYBOARD_STEP));
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      onChange(clampValue(value + KEYBOARD_STEP));
    }
  };

  const displayGroupProps = {
    value,
    min,
    max,
    onPointerDown: startResize,
    onKeyDown: resizeWithKeyboard,
  };

  return (
    <DisplayGroup {...displayGroupProps}>
      <SplitterLine />
      <SplitterGrabber />
      <SplitterInteractionStyles />
    </DisplayGroup>
  );
}
