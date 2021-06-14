import {
  convertQAString,
  parseQAString,
  qaEscape,
  qaUnescape,
  qasUnescape
} from './parser'

test('unify line feed code and ignore comment lines', () => {
  expect(convertQAString('a:=b\r\n# c:=d\r\n\r\ne:=f'))
    .toBe('a:=b\ne:=f')
})

test('q1 in example', () => {
  expect(parseQAString('q1:=a1')).toEqual([
    {
      content: {
        answers: ['a1'],
        question: 'q1',
        type: 'exact-match'
      },
      type: 'qa'
    }
  ])
})

test('q2 in example', () => {
  expect(parseQAString('q2:=a1:=a2')).toEqual([
    {
      content: {
        answers: ['a1', 'a2'],
        question: 'q2',
        type: 'exact-match'
      },
      type: 'qa'
    }
  ])
})

test('q3 in example', () => {
  expect(parseQAString('q3:-a1:-a2:-a3:=1')).toEqual([
    {
      content: {
        answers: ['1'],
        question: 'q3',
        selections: ['a1', 'a2', 'a3'],
        type: 'exact-match-selection'
      },
      type: 'qa'
    }
  ])
})

test('q4 in example', () => {
  expect(parseQAString('q4:-a1:-a2:-a3:=1:=2')).toEqual([
    {
      content: {
        answers: ['1', '2'],
        question: 'q4',
        selections: ['a1', 'a2', 'a3'],
        type: 'exact-match-selection'
      },
      type: 'qa'
    }
  ])
})

test('escape for qa', () => {
  expect(qaEscape('a:-b')).toBe('a[:__colon_hyphen__:]b')
})

test('unescape for qa', () => {
  expect(qaUnescape('[:__colon_equal__:]')).toBe(':=')
  expect(qaUnescape('[:__colon_hyphen__:]')).toBe(':-')
  expect(qaUnescape('[:__colon_plus__:]')).toBe(':+')
  expect(qaUnescape('[:__empty__:]')).toBe('')
})

test('unescape for qas', () => {
  expect(qasUnescape([
    {
      content: {
        answers: ['a[:__colon_hyphen__:]b'],
        question: 'c[:__colon_hyphen__:]d',
        type: 'exact-match'
      },
      type: 'qa'
    },
    {
      content: {
        answers: ['1'],
        question: 'e[:__colon_hyphen__:]f',
        selections: ['g[:__colon_hyphen__:]h', 'i[:__colon_hyphen__:]j'],
        type: 'exact-match-selection'
      },
      type: 'qa'
    }
  ])).toEqual([
    {
      content: {
        answers: ['a:-b'],
        question: 'c:-d',
        type: 'exact-match'
      },
      type: 'qa'
    },
    {
      content: {
        answers: ['1'],
        question: 'e:-f',
        selections: ['g:-h', 'i:-j'],
        type: 'exact-match-selection'
      },
      type: 'qa'
    }
  ])
})
