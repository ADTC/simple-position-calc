import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

export default function Text({
  label,
  xs,
  value,
  onChange,
}: {
  label: string;
  xs?: boolean;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}) {
  const [stringValue, setStringValue] = useState<string>();

  useEffect(() => {
    if (value !== undefined) setStringValue(value?.toString() ?? "");
  }, [value]);

  useEffect(() => {
    // Only allow digits and one decimal point anywhere in the string
    if (!stringValue?.match(/^\d*\.?\d*$/)) {
      onChange(undefined);
    } else {
      const numberValue = parseFloat(stringValue);
      if (!isNaN(numberValue)) {
        onChange(numberValue);
      } else {
        onChange(undefined);
      }
    }
  }, [onChange, stringValue]);

  return (
    <TextField
      error={!!stringValue && value === undefined}
      helperText={label}
      sx={xs ? { maxWidth: 130 } : undefined}
      variant="outlined"
      value={stringValue}
      onChange={(e) => setStringValue(e.target.value)}
    />
  );
}
