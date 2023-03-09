import React from "react";

const LayoutNesterSymbol = Symbol("next-nested-layout");

type LayoutProperties = { [LayoutNesterSymbol]: true };
type Layout = (props: {
  children: JSX.Element;
}) => JSX.Element | (JSX.Element & LayoutProperties);

type ComponentWithLayout<T> = React.FC<T> & {
  getLayout: Layout;
};

function Root<T extends JSX.IntrinsicAttributes>({
  Component,
  pageProps,
}: {
  Component: React.FC<T> | ComponentWithLayout<T>;
  pageProps: T;
}) {
  const CastComponent = Component as React.FC<T>;

  if ("getLayout" in Component) {
    return Component.getLayout({ children: <CastComponent {...pageProps} /> });
  } else {
    return <CastComponent {...pageProps} />;
  }
}

function createLayout<T>(
  Component: React.FC<T>,
  Layout: Layout,
  Parent?: Layout
) {
  const _Layout = (
    LayoutNesterSymbol in Layout
      ? Layout
      : (props: { children: JSX.Element }) => {
          const CastLayout = Layout as React.FC<{ children: JSX.Element }>;
          return <CastLayout>{props.children}</CastLayout>;
        }
  ) as Layout;

  const NestedLayout = Parent
    ? ({ children }: { children: JSX.Element }) =>
        Parent({ children: Layout({ children }) })
    : _Layout;

  (NestedLayout as unknown as LayoutProperties)[LayoutNesterSymbol] = true;

  (Component as ComponentWithLayout<T>).getLayout = NestedLayout;

  return [Component, NestedLayout] as const;
}

export { Root, createLayout as createPersistentLayout };
