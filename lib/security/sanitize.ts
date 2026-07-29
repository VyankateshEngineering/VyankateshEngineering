import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(input: string): string {
  if (!input) return input;
  return sanitizeHtml(input, {
    allowedTags: [], // Strip all tags by default for generic input
    allowedAttributes: {},
  });
}

export function sanitizeHtmlContent(html: string): string {
  if (!html) return html;
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
      a: ['href', 'name', 'target', 'rel']
    },
    allowedIframeHostnames: ['www.youtube.com']
  });
}
