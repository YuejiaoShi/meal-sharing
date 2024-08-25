// Handle date or dateime formatting
export default function handleFormatDateOrDatetime(
  fieldToFormat,
  value,
  format,
  res
) {
  const parsedDate = new Date(value);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      error: `Invalid date format for '${fieldToFormat}'. Use ${format === "date" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:MM:SS"} format.`,
    });
  }
  return parsedDate
    .toISOString()
    .slice(0, format === "date" ? 10 : 19)
    .replace("T", " ");
}
