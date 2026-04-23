const sanitizeHtml = require('sanitize-html');

const sanitizeLessonContent = (htmlOrMarkdown) =>
  sanitizeHtml(htmlOrMarkdown || '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'pre', 'code']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt'],
      a: ['href', 'target', 'rel'],
      code: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });

module.exports = { sanitizeLessonContent };
