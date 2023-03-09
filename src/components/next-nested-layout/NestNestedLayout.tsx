
import type { NextComponentType, NextPageContext } from "next";
import React from "react";

const LayoutNesterSymbol = Symbol("layout-nester");

type LayoutGetterProperties = { [LayoutNesterSymbol]: true };
type LayoutGetter = (
  component: JSX.Element
) => JSX.Element & LayoutGetterProperties;

type ComponentWithLayout<T, U> = NextComponentType<NextPageContext, T, U> & {
  getLayout: LayoutGetter;
};

type NextComponent<T = { children: JSX.Element }> = NextComponentType<
  NextPageContext,
  unknown,
  T
>;

function Root<T extends JSX.IntrinsicAttributes>({
  Component,
  pageProps,
}: {
  Component: NextComponent<T> | ComponentWithLayout<T, any>;
  pageProps: T;
}) {
  if ("getLayout" in Component) {
    return Component.getLayout(<Component {...pageProps} />);
  } else {
    const CastComponent = Component as NextComponent<T>;
    return <CastComponent {...pageProps} />;
  }
}

function createPersistentLayout<T, U>(
  Component: NextComponentType<NextPageContext, T, U>,
  Layout: NextComponent | LayoutGetter,
  Parent?: LayoutGetter
) {
  const LayoutGetter = (
    LayoutNesterSymbol in Layout
      ? Layout
      : (page: JSX.Element) => {
          const CastLayout = Layout as NextComponent;
          return <CastLayout>{page}</CastLayout>;
        }
  ) as LayoutGetter;

  const NestedLayoutGetter = Parent
    ? (page: JSX.Element) => Parent(LayoutGetter(page))
    : LayoutGetter;

  (NestedLayoutGetter as unknown as LayoutGetterProperties)[
    LayoutNesterSymbol
  ] = true;

  (Component as ComponentWithLayout<T, U>).getLayout = NestedLayoutGetter;

  return [Component, NestedLayoutGetter] as const;
}

export { Root, createPersistentLayout };
