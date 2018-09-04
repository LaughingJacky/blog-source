const Remarkable = require('remarkable');
const hljs = require('highlight.js/lib/highlight');

const beautifyCode = (code, language = 'javascript') => {
  ['javascript', 'bash'].forEach((langName) => {
    // Using require() here because import() support hasn't landed in Webpack yet
    const langModule = require(`highlight.js/lib/languages/${langName}`);
    hljs.registerLanguage(langName, langModule);
  });
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && hljs.getLanguage(language));
  // Highlight only if the language is valid.
  const highlighted = validLang ? hljs.highlight(language, code).value : code;
  // Render the highlighted code with `hljs` class.
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

const extractId = (text = '') => {
  let id;
  const link = text.match(/<a.*>(.*)<\/a>/);
  if (link) {
    [id] = link;
  } else {
    // Extract Chinese and English wordings
    const temp = text.match(/[\u4e00-\u9fa5\S]+/g);
    if (temp) {
      id = temp.join('');
    }
  }
  return id;
};

const getContent = (mdFile) => {
  const toc = [];
  const md = new Remarkable({
    highlight(str, lang) {
      return beautifyCode(str, lang);
    },
  });

  md.renderer.rules.heading_open = (tokens, idx) => {
    const id = extractId(tokens[idx + 1].content);
    toc.push(id);
    return `<h${tokens[idx].hLevel} id=${id}>`;
  };

  const html = md.render(mdFile);
  return { html, toc };
};

const getFirstParagraph = (content) => {
  const introduction = content.match(/[\n]+(.*)[\n]/);
  return introduction[1].substring(0, 140);
};

module.exports = {
  getContent,
  getFirstParagraph,
};
