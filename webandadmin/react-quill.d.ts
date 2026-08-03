// src/react-quill.d.ts
declare module 'react-quill' {
    import * as React from 'react';
    
    export interface ReactQuillProps {
      theme?: string;
      value?: string;
      onChange?: (content: string, delta: any, source: string, editor: any) => void;
      modules?: { [key: string]: any };
      formats?: string[];
      placeholder?: string;
      readOnly?: boolean;
      className?: string;
    }
  
    export default class ReactQuill extends React.Component<ReactQuillProps, any> {
      focus(): void;
      blur(): void;
      getEditor(): any;
    }
  }