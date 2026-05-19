import { Box } from "@mantine/core";

type WorkspaceSplitterProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

const DEFAULT_MIN = 260;
const DEFAULT_MAX = 100000;
const KEYBOARD_STEP = 16;

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

  return (
    <Box
      role="separator"
      aria-orientation="vertical"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      w={9}
      ml={-4}
      mr={-4}
      onPointerDown={startResize}
      onKeyDown={resizeWithKeyboard}
      style={{
        alignSelf: "stretch",
        cursor: "col-resize",
        position: "relative",
        flexShrink: 0,
        zIndex: 20,
        outline: "none",
        background: "transparent",
      }}
    >
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
          background: "var(--mantine-color-asxIndigo-6)",
          transition: "opacity 140ms ease, width 140ms ease",
        }}
      />

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
          <Box
            key={dot}
            style={{
              position: "absolute",
              left: "50%",
              top: 12 + dot * 9,
              width: 3,
              height: 3,
              transform: "translateX(-50%)",
              borderRadius: 999,
              background:
                "var(--mantine-color-asxIndigo-7)",
            }}
          />
        ))}
      </Box>

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
    </Box>
  );
}
