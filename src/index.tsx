import React from 'react';

const scaleProp = '--rftv-scale';

const useLayoutEffect =
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
    ? React.useLayoutEffect
    : React.useEffect;

type Props = {
  width: number;
  height: number;
  minZoom?: number;
  maxZoom?: number;
  as?: string;
  autoRotateAt?: number;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export function FitToViewport({
  children,
  width,
  height,
  minZoom = 0,
  maxZoom = 1,
  as: T = 'div',
  autoRotateAt,
  style,
  ...props
}: Props) {
  return React.createElement(
    T,
    {
      ...props,
      style: {
        width,
        height,
        minWidth: width,
        minHeight: height,
        transform: `scale(var(${scaleProp}))`,
        ...style,
      },
    },
    <GenerateScaleVar
      width={width}
      height={height}
      minZoom={minZoom}
      maxZoom={maxZoom}
      autoRotateAt={autoRotateAt}
    />,
    <AutoRotateStyle breakpoint={autoRotateAt} />,
    children
  );
}

function AutoRotateStyle({ breakpoint }: { breakpoint: number | undefined }) {
  return breakpoint ? (
    <style
      children={`
@media ${rotateMediaQuery(breakpoint)} {
  html {
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 100vh;
    height: 100vw;
    overflow-x: hidden;
    position: absolute;
    top: 100%;
    left: 0;
  }
}`}
    />
  ) : null;
}

function GenerateScaleVar({
  width,
  height,
  minZoom = 0,
  maxZoom = 1,
  autoRotateAt,
}: {
  width: number;
  height: number;
  minZoom?: number;
  maxZoom?: number;
  autoRotateAt: number | undefined;
}) {
  const js = `
(function() {
  ${setScaleProp.toString()}
  setScaleProp(
    ${width},
    ${height},
    ${minZoom},
    ${maxZoom},
    ${autoRotateAt},
    "${rotateMediaQuery(autoRotateAt)}",
    "${scaleProp}"
  )  
})()`;
  useLayoutEffect(() => {
    function resetScale() {
      setScaleProp(
        width,
        height,
        minZoom,
        maxZoom,
        autoRotateAt,
        rotateMediaQuery(autoRotateAt),
        scaleProp
      );
    }
    resetScale();
    window.addEventListener('resize', resetScale);
    return () => {
      window.removeEventListener('resize', resetScale);
    };
  }, [width, height, minZoom, maxZoom, autoRotateAt]);
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

function setScaleProp(
  width: number,
  height: number,
  minZoom: number,
  maxZoom: number,
  autoRotateAt: number | undefined,
  mediaQuery: string,
  scaleProp: string
) {
  var root = document.documentElement;
  var rotate = autoRotateAt && window.matchMedia(mediaQuery).matches;

  var vw = rotate ? root.clientHeight : root.clientWidth;
  var vh = rotate ? root.clientWidth : root.clientHeight;
  var scale = Math.max(minZoom, Math.min(maxZoom, vw / width, vh / height));
  root.style.setProperty(scaleProp, scale.toString());
}

function rotateMediaQuery(breakpoint?: number) {
  return `screen and (max-width: ${breakpoint}px) and (orientation: portrait)`;
}
