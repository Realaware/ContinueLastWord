const ERRORS: Array<string> = ["Failed To Join", "Already Playing", "No Players", "Failed To Find Last Character", "Unknown Room"];

export default function getError(code: number) {
  return `Error Code ${code}. (${ERRORS[code - 1]})`;
}
