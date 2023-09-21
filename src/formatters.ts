export function formatDate2(inputDate: Date): string {
  const date = inputDate;
  const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with '0' if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (months are zero-based) and pad with '0' if needed
  const year = String(date.getFullYear()); // Get the year

  return `${day}-${month}-${year}`;
}
export function formatTimeSpent(timeInSeconds: number): string {
  const hours = Math.floor(timeInSeconds / 3600); // Calculate hours
  const minutes = Math.floor((timeInSeconds % 3600) / 60); // Calculate minutes

  let formattedTime = "";

  if (hours > 0) {
    formattedTime += `${hours}h`;
  }

  if (minutes > 0) {
    formattedTime += `${minutes}m`;
  }

  // If both hours and minutes are 0, show "0m"
  if (formattedTime === "") {
    formattedTime = "0m";
  }

  return formattedTime;
}
