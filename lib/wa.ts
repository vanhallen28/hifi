export function wa(number: string, msg: string): string {
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(msg);
}
