import TextField from "@mui/material/TextField";

export default function Text({
  id,
  label,
  xs,
}: {
  id: string;
  label: string;
  xs?: boolean;
}) {
  return (
    <TextField
      id={id}
      label={label}
      sx={xs ? { maxWidth: 106 } : undefined}
      type="number"
      variant="standard"
    />
  );
}
