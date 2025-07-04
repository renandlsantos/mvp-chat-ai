declare module 'next/dist/lib/metadata/types/metadata-interface' {
  export interface ResolvingMetadata {}
  export interface ResolvingViewport {}
}

// Extend Next.js page props to include our custom properties
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};