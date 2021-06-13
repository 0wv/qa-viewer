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
    .map(v => v.split(':+'))
    .map(v => {
      if (v.length === 2) {
        return {
          content: v[1],
          type: v[0]
        }
      } else if (v.length === 1) {
        return {
          content: v[0],
          type: 'qa'
        }
      }

      return {}
    })
    .map((v) => ({
      content: v.content.split(':='),
      type: v.type
    }))
    .filter((v) => v.content.length >= 2)
    .map((v) => ({
      content: [v.content[0].split(':-'), v.content.slice(1, v.content.length)],
      type: v.type
    }))
    .map((v) => {
      const answers = v.content[1]
      const question = v.content[0][0]

      if (v.content[0].length >= 2) {
        const selections = v.content[0].slice(1, v.content[0].length)

        return {
          content: {
            answers,
            question,
            selections,
            type: 'exact-match-selection'
          },
          type: v.type
        }
      } else {
        return {
          content: {
            answers,
            question,
            type: 'exact-match'
          },
          type: v.type
        }
      }
    })
}

export function qaEscape (qaString) {
  return qaString.replace(/:-/g, '[:__colon_hyphen__:]')
}

export function qasUnescape (qas) {
  // eslint-disable-next-line array-callback-return
  return qas.map((qa) => {
    if (qa.content.type === 'exact-match') {
      return {
        content: {
          answers: qa.content.answers.map((answer) => answer.replace(/\[:__colon_hyphen__:\]/g, ':-')),
          question: qa.content.question.replace(/\[:__colon_hyphen__:\]/g, ':-'),
          type: qa.content.type
        },
        type: qa.type
      }
    } else if (qa.content.type === 'exact-match-selection') {
      return {
        content: {
          answers: qa.content.answers,
          question: qa.content.question.replace(/\[:__colon_hyphen__:\]/g, ':-'),
          selections: qa.content.selections.map((selection) => selection.replace(/\[:__colon_hyphen__:\]/g, ':-')),
          type: qa.content.type
        },
        type: qa.type
      }
    }
  })
}
