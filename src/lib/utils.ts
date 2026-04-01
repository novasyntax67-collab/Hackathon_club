export function cn(...inputs: any[]) {
  return inputs
    .filter(Boolean)
    .map((input) => {
      if (typeof input === "string") return input;
      if (typeof input === "object") {
        return Object.entries(input)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(" ");
      }
      return "";
    })
    .join(" ")
    .trim();
}
