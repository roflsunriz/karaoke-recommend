import { expect, test } from 'bun:test'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

test('installed React renderer initializes and renders with compatible React', () => {
  expect(renderToString(createElement('span', null, 'runtime compatible'))).toBe(
    '<span>runtime compatible</span>',
  )
})
