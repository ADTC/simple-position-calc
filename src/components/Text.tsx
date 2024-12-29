import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Decimal from "decimal.js";

export default function Text({
  label,
  xs,
  value,
  onChange,
  error,
}: {
  label: string;
  xs?: boolean;
  value: Decimal | undefined;
  onChange: (value: Decimal | undefined) => void;
  error: boolean;
}) {
  const [stringValue, setStringValue] = useState<string>("");

  useEffect(() => {
    if (value === undefined) setStringValue("");
    else setStringValue(value.toFixed());
  }, [value]);

  useEffect(() => {
    // Only allow optional hyphen at beginning, optional digits
    // and one optional decimal point anywhere in the string
    if (/^-?\d*\.?\d*$/.test(stringValue)) {
      // Allow trailing decimal point when typing
      if (stringValue.endsWith(".")) return;
      try {
        onChange(new Decimal(stringValue));
      } catch {
        onChange(undefined);
      }
    } else onChange(undefined);
  }, [onChange, stringValue]);

  return (
    <TextField
      error={error}
      helperText={label}
      sx={xs ? { maxWidth: 130 } : undefined}
      variant="outlined"
      value={stringValue}
      onChange={(e) => setStringValue(e.target.value)}
      onBlur={() => value === undefined && setStringValue("")}
    />
  );
}
