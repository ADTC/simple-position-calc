import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

export default function Text({
  label,
  xs,
  value,
  onChange,
  error,
}: {
  label: string;
  xs?: boolean;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  error: boolean;
}) {
  const [stringValue, setStringValue] = useState<string>("");

  useEffect(() => {
    if (value === undefined) setStringValue("");
    else setStringValue(value?.toString() ?? "");
  }, [value]);

  useEffect(() => {
    // Only allow optional hyphen at beginning, optional digits
    // and one optional decimal point anywhere in the string
    if (/^-?\d*\.?\d*$/.test(stringValue)) {
      const numberValue = parseFloat(stringValue);

      if (isNaN(numberValue)) onChange(undefined);
      else onChange(numberValue);
      //
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
