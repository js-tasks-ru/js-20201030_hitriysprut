/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (arguments.length === 1) return string;
  let newStrArr = [];
  let counter = 0;
  let previous = '';
  for (let symbol of string) {
    if (previous === symbol) counter++;
    else {
      previous = symbol;
      counter = 0
    }
    if (counter < size) newStrArr.push(symbol);
  }
  return newStrArr.join('');
}
