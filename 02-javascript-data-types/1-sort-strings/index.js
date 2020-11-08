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

function sortStringsWithLocales(direction, arr, locales = ['ru','en']) {
  return [...arr].sort((a, b) => direction * compareStringsWithLocales(a, b, locales));
}

function compareStringsWithLocales(str1, str2, locales) {
  const shorterStr = str1.length < str2.length ? str1 : str2;
  for (let index = 0; index < shorterStr.length; index++) {
    const result = str1[index].localeCompare(str2[index], locales, {caseFirst: 'upper'});
    if (result !== 0) return result;
  }
  return str1 === shorterStr ? -1 : 1;
}


}
*/
