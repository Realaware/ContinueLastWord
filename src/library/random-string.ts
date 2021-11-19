export default function RandomString(length: number) {
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const all = lowers + lowers.toUpperCase() + numbers;

  var result = "";

  for (let i = 0; i < length; i++) {
    result += all[Math.floor(Math.random() * all.length)];
  }

  return result;
}
