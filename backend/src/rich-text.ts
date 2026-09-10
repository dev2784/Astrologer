import sanitizeHtml from 'sanitize-html';

export function cleanRichText(value: string | null | undefined) {
  if (value == null) return value;
  return sanitizeHtml(value, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: { a: ['href', 'title'], '*': ['class', 'style'], li: ['data-list'] },
    allowedClasses: { '*': ['ql-align-center', 'ql-align-right', 'ql-align-justify', 'ql-indent-*', 'ql-size-*', 'ql-font-*'] },
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(\d+,\s*\d+,\s*\d+\)$/],
        'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgb\(\d+,\s*\d+,\s*\d+\)$/],
        'text-align': [/^(left|right|center|justify)$/],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
  });
}

export function cleanPuja<T extends { about?: string | null; benefits?: string | null; samagri?: string | null }>(puja: T): T {
  return { ...puja, about: cleanRichText(puja.about), benefits: cleanRichText(puja.benefits), samagri: cleanRichText(puja.samagri) };
}
