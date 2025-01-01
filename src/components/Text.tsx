import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Decimal from "decimal.js";
import IconSpan from "./IconSpan";

// Only allow optional hyphen at beginning, optional digits
// and one optional decimal point anywhere in the string
const regex = /^-?\d*\.?\d*$/;

const adornCSS: React.CSSProperties = {
  color: "#ffffff22",
  userSelect: "auto",
};

export default function Text({
  disabled,
  hidden,
  label,
  xs,
  value,
  onChange,
  error,
  baseAmount,
  baseAdornment = "",
  adornment = "ABC",
}: {
  disabled?: boolean;
  hidden?: boolean;
  label: string;
  xs?: boolean;
  value: Decimal | undefined;
  onChange: (value: Decimal | undefined) => void;
  error: boolean;
  baseAmount?: Decimal;
  baseAdornment?: string;
  adornment?: string;
}) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [stringValue, setStringValue] = useState<string>("");
  const [hover, setHover] = useState<boolean>(false);

  useEffect(() => {
    if (value === undefined) setStringValue("");
    else setStringValue(value.toFixed());
    setMounted(true);
  }, [value]);

  useEffect(() => {
    if (!mounted) return;
    if (regex.test(stringValue)) {
      // Allow trailing decimal point when typing
      if (stringValue.endsWith(".")) return;
      try {
        onChange(new Decimal(stringValue));
      } catch {
        onChange(undefined);
      }
    } else onChange(undefined);
  }, [mounted, onChange, stringValue]);

  const helperText = disabled ? (
    <>{label}</>
  ) : (
    <>
      {label}{" "}
      <IconSpan
        icon="📋"
        title="Paste Number from Clipboard"
        hover={hover}
        onClick={
          () =>
            navigator.clipboard
              .readText()
              .then((text) => regex.test(text) && setStringValue(text))
              .catch(() => {}) // Ignore error
        }
      />{" "}
      <IconSpan
        icon="📑"
        title="Copy This Number to Clipboard"
        hover={hover}
        onClick={
          () => navigator.clipboard.writeText(stringValue).catch(() => {}) // Ignore error
        }
      />{" "}
      <IconSpan
        icon="❌"
        title="Clear This Field"
        hover={hover}
        onClick={() => setStringValue("")}
      />
    </>
  );

  return (
    <TextField
      disabled={disabled}
      label={
        baseAmount && baseAdornment ? (
          <span style={adornCSS}>
            {baseAmount?.toFixed()} {baseAdornment}
          </span>
        ) : undefined
      }
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      error={error}
      helperText={helperText}
      sx={hidden ? { display: "none" } : xs ? { maxWidth: 147 } : undefined}
      variant="outlined"
      value={stringValue}
      onChange={(e) => setStringValue(e.target.value)}
      onBlur={() => value === undefined && setStringValue("")}
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <sup style={adornCSS}>{adornment}</sup>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
