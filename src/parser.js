/** @typedef {{ content: any, type: string }} QAItem */

export class Prefix {
  /**
   * アイテムをトランスフォームします。
   * @param {QAItem} qaItem - アイテム。
   * @returns {QAItem} アイテム。
   */
  static transform (qaItem) {
    const result = qaItem
    return result
  }
}

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
    const result = new QAString(
      this
        .toString()
        .replace(/\r?\n/g, '\n')
        .split('\n')
        .filter(v => v !== '' && v[0] !== '#')
        .join('\n')
        .replace(/\n:-/g, ':-')
        .replace(/\n:=/g, ':=')
    )
    return result
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
   * アイテムの配列をアンエスケープします。
   * @param {QAItem[]} items - アイテムの配列。
   * @returns {QAItem[]} アイテムの配列。
   */
  static unescapeItems (items) {
    const result = items.map(item => (
      item.content.type === 'exact-match'
        ? {
            content: {
              answers: item.content.answers.map(answer => answer.replace(/\[:__colon_hyphen__:\]/g, ':-')),
              question: item.content.question.replace(/\[:__colon_hyphen__:\]/g, ':-'),
              type: item.content.type
            },
            type: item.type
          }
        : item.content.type === 'exact-match-selection'
          ? {
              content: {
                answers: item.content.answers,
                question: item.content.question.replace(/\[:__colon_hyphen__:\]/g, ':-'),
                selections: item.content.selections.map(selection => selection.replace(/\[:__colon_hyphen__:\]/g, ':-')),
                type: item.content.type
              },
              type: item.type
            }
          : {
              content: 'unexisted type.',
              type: 'error'
            }
    ))
    return result
  }

  /**
   * アイテムの配列を返します。
   * @returns {QAItem[]} アイテムの配列。
   */
  get items () {
    const result = this
      .toString()
      .split('\n')
      .map(v => v.split(':+'))
      .map(v => (
        v.length === 2
          ? {
              content: v[1],
              type: v[0]
            }
          : v.length === 1
            ? {
                content: v[0],
                type: 'qa'
              }
            : v.length >= 3
              ? {
                  content: 'too longer length. must be 1 or 2 in length.',
                  type: 'error'
                }
              : {
                  content: 'length is zero. must be 1 or 2 in length.',
                  type: 'error'
                }
      ))
      .map(v => (
        v.type === 'qa'
          ? {
              content: v.content.split(':='),
              type: v.type
            }
          : v
      ))
      .filter(v => v.type !== 'qa' || v.content.length >= 2)
      .map(v => (
        v.type in prefixMap
          ? prefixMap[v.type].transform(v)
          : v
      ))
      .map(v => (
        v.type === 'fill'
          ? (() => {
              const matches = v.content.match(/\(\(.+?\)\)/g)
              let text = v.content
              matches.forEach((match, i) => {
                text = text.replace(match, `(${i + 1})`)
              })
              const answers = matches.map(v => v.replace(/(^\(\(|\)\)$)/g, ''))
              const result = {
                content: {
                  answers,
                  text
                },
                type: v.type
              }
              return result
            })()
          : v.type === 'qa'
            ? (() => {
                const answers = v.content[1]
                const question = v.content[0][0]
                const result = v.content[0].length >= 2
                  ? (() => {
                      const selections = v.content[0].slice(1, v.content[0].length)
                      const result = {
                        content: {
                          answers,
                          question,
                          selections,
                          type: 'exact-match-selection'
                        },
                        type: v.type
                      }
                      return result
                    })()
                  : {
                      content: {
                        answers,
                        question,
                        type: 'exact-match'
                      },
                      type: v.type
                    }
                return result
              })()
            : v.type === 'section' || v.type === 'text'
              ? {
                  content: v.content,
                  type: v.type
                }
              : {
                  content: 'unexisted type.',
                  type: 'error'
                }
      ))
    return result
  }
}

export const prefixMap = {
  qa: class extends Prefix {
    static transform (qaItem) {
      const result = {
        content: [qaItem.content[0].split(':-'), qaItem.content.slice(1, qaItem.content.length)],
        type: qaItem.type
      }
      return result
    }
  }
}
