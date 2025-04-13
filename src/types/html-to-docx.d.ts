declare module 'html-to-docx' {
  interface HTMLtoDOCXOptions {
    table?: {
      row?: {
        cantSplit?: boolean;
      };
    };
    footer?: boolean;
    pageNumber?: boolean;
    title?: string;
    [key: string]: any;
  }

  function HTMLtoDOCX(
    html: string,
    headerHTML: string | null,
    options?: HTMLtoDOCXOptions
  ): Promise<Blob>;

  export = HTMLtoDOCX;
} 