/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  switch (param) {
    case 'desc':
      return sortStringsWithLocales(-1, arr);
    case 'asc' :
      return sortStringsWithLocales(1, arr);
  }
  console.error('wrong param. set "asc" or "desc" to sort!');
  return arr;
}

function sortStringsWithLocales(direction, arr, locales = ['ru', 'en']) {
  return [...arr].sort((a, b) => direction * a.localeCompare(b, locales, {caseFirst: 'upper'}));
}
