import Box from "@mui/material/Box";

export default function TextBoxes({ children }: { children: React.ReactNode }) {
  return <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>{children}</Box>;
}
