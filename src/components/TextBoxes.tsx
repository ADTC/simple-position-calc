import Box from "@mui/material/Box";

export default function TextBoxes({ children }: { children: React.ReactNode }) {
  return <Box sx={{ display: "flex", gap: 2, margin: 1 }}>{children}</Box>;
}
