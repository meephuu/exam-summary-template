import type { MDXComponents } from 'mdx/types'
import { CLTSimulator } from '../interactive/CLTSimulator'
import { ExampleWidget } from '../interactive/ExampleWidget'
import { NormalArea } from '../interactive/NormalArea'
import { Callout, Def, Example, Tip, Warn } from './Callout'
import { Compare, CompareItem } from './Compare'
import { Solution } from './Solution'

/**
 * Components every chapter's MDX can use without importing them.
 * Register new shared components (and every new widget) here.
 */
export const mdxComponents: MDXComponents = {
  // content boxes
  Callout,
  Def,
  Example,
  Warn,
  Tip,
  Solution,
  Compare,
  CompareItem,
  // widgets
  ExampleWidget,
  NormalArea,
  CLTSimulator,
}
