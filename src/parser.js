export class QAString extends String {
  /**
   * QAStringをエスケープします。
   * @param {string} qaString - QAString。
   * @returns {QAString} QAString。
   */
  static escape (qaString) {
    const result = new QAString(
      qaString.replace(/:-/g, '[:__colon_hyphen__:]')
    )
    return result
  }

  /**
   * QAStringをフォーマットします。
   * @returns {QAString} QAString。
   */
  format () {
    return new QAString(
      this
        .toString()
        .replace(/\r?\n/g, '\n')
        .split('\n')
        .filter(v => v !== '' && v[0] !== '#')
        .join('\n')
        .replace(/\n:-/g, ':-')
        .replace(/\n:=/g, ':=')
    )
  }

  /**
   * QAStringをアンエスケープします。
   * @param {string} qaString - QAString。
   * @returns {QAString} QAString。
   */
  static unescape (qaString) {
    const result = new QAString(
      qaString
        .replace(/\[:__colon_equal__:\]/g, ':=')
        .replace(/\[:__colon_hyphen__:\]/g, ':-')
        .replace(/\[:__colon_plus__:\]/g, ':+')
        .replace(/\[:__empty__:\]/g, '')
    )
    return result
  }

  /**
   * アイテムの配列を返します。
   * @returns {{ content: any, type: string }[]} アイテムの配列。
   */
  get items () {
    return this
      .toString()
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
      .map(v => {
        if (v.type === 'qa') {
          return {
            content: v.content.split(':='),
            type: v.type
          }
        } else {
          return v
        }
      })
      .filter(v => v.type !== 'qa' || v.content.length >= 2)
      .map(v => {
        if (v.type === 'qa') {
          return {
            content: [v.content[0].split(':-'), v.content.slice(1, v.content.length)],
            type: v.type
          }
        } else {
          return v
        }
      })
      .map(v => {
        if (v.type === 'fill') {
          const matches = v.content.match(/\(\(.+?\)\)/g)
          let text = v.content
          matches.forEach((match, i) => {
            text = text.replace(match, `(${i + 1})`)
          })
          const answers = matches.map(v => v.replace(/(^\(\(|\)\)$)/g, ''))

          return {
            content: {
              answers,
              text
            },
            type: v.type
          }
        } else if (v.type === 'qa') {
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
        } else if (v.type === 'section' || v.type === 'text') {
          return {
            content: v.content,
            type: v.type
          }
        }

        return {}
      })
  }
}

export function qasUnescape (qas) {
  return qas.map(qa => {
    if (qa.content.type === 'exact-match') {
      return {
        content: {
          answers: qa.content.answers.map(answer => answer.replace(/\[:__colon_hyphen__:\]/g, ':-')),
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
          selections: qa.content.selections.map(selection => selection.replace(/\[:__colon_hyphen__:\]/g, ':-')),
          type: qa.content.type
        },
        type: qa.type
      }
    }

    return {}
  })
}
