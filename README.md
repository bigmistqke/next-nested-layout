# next-nested-layout

Utility to create persistent and nested lay-outs in next-js (without the app-directory).

Default in next-js, Layouts would re-mount on each navigation. <br/>
Next's `app`-directory has better support for persisting (nested) layouts.<br/>
But a lot of the next/react-ecosystem still revolves around the `pages`-directory.

`next-nested-layout` offers a solution to create persistent, nested layouts in the `pages`-directory.<br/>
It is a wrapper around the pattern described by [adman wathan's article](https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/).

## Quick start

Install it:

```bash
npm i next-nested-layout
# or
yarn add next-nested-layout
# or
pnpm add next-nested-layout
```

Use it:

- add `Root`-component to `_app.tsx`

```tsx
// _app.tsx
import {Root} from 'next-nested-layout'

export default (Component, pageProps) => {
   return <>
      <Root Component={Component} pageProps={pageProps}/>
   </>
}
```

- create persistent layout with `createLayout(Component, Layout)`

```tsx
// [page]/index.tsx
import {createLayout} from 'next-nested-layout'

const [Page, PageLayout] = createLayout(
  () => <> some page content </>,
  ({children}) => {
     return <>
        <h1>page</h1>
        {children}
     </>
  },
)

export {PageLayout}
export default Page
```

- nest persistent layouts with `createLayout(Component, Layout, Parent)`

```tsx
// [page]/[post]/index.tsx
import {createLayout} from 'next-nested-layout'
import {PageLayout} from '../'


const [Post, PostLayout] = createLayout(
  () => <> some post content </>,
  ({children}) => {
     return <>
        <h2>post</h2>
        {children}
     </>
  },
  PageLayout
)
export {PostLayout}
export default Post
```

- reuse layouts with `createLayout(Component, ExternalLayout)`

```tsx
// [page]/[post]/detail.tsx
import {createLayout} from 'next-nested-layout'
import {PostLayout} from './'


const [Detail] = createLayout(
  () => <> some detail content </>,
  PostLayout
)
export default Detail
```

