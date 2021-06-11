import { parseQAString } from './parser'

test('q1 in example', () => {
  expect(parseQAString('q1:=a1')).toEqual([
    {
      answers: ['a1'],
      question: 'q1',
      type: 'exact-match'
    }
  ])
})

test('q2 in example', () => {
  expect(parseQAString('q2:=a1:=a2')).toEqual([
    {
      answers: ['a1', 'a2'],
      question: 'q2',
      type: 'exact-match'
    }
  ])
})

test('q3 in example', () => {
  expect(parseQAString('q3:-a1:-a2:-a3:=1')).toEqual([
    {
      answers: ['1'],
      question: 'q3',
      selections: ['a1', 'a2', 'a3'],
      type: 'exact-match-selection'
    }
  ])
})

test('q4 in example', () => {
  expect(parseQAString('q4:-a1:-a2:-a3:=1:=2')).toEqual([
    {
      answers: ['1', '2'],
      question: 'q4',
      selections: ['a1', 'a2', 'a3'],
      type: 'exact-match-selection'
    }
  ])
})
