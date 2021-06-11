export function convertQAString (qaString) {
  return qaString
    .replace(/\r?\n/g, '\n')
    .split('\n')
    .filter((v) => v !== '' && v[0] !== '#')
    .join('\n')
}

export function parseQAString (qaString) {
  return convertQAString(qaString)
    .split('\n')
    .map((v) => v.split(':='))
    .filter((v) => v.length >= 2)
    .map((v) => [v[0].split(':-'), v.slice(1, v.length)])
    .map((v) => {
      const answers = v[1]
      const question = v[0][0]

      if (v[0].length >= 2) {
        const selections = v[0].slice(1, v[0].length)

        return {
          answers,
          question,
          selections,
          type: 'exact-match-selection'
        }
      } else {
        return {
          answers,
          question,
          type: 'exact-match'
        }
      }
    })
}
