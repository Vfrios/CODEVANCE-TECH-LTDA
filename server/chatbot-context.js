import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const contextPath = fileURLToPath(new URL('./chatbot-context.md', import.meta.url));
const MAX_CONTEXT_SECTIONS = 3;
const STOP_WORDS = new Set([
  'a', 'ao', 'aos', 'as', 'com', 'da', 'das', 'de', 'do', 'dos', 'e', 'em',
  'me', 'meu', 'minha', 'o', 'os', 'para', 'por', 'qual', 'que', 'se', 'um',
  'uma', 'voce', 'voces',
]);

let cachedContext;

function parseSections(markdown) {
  const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  return headings.map((heading, index) => {
    const start = heading.index + heading[0].length;
    const end = headings[index + 1]?.index ?? markdown.length;
    const content = markdown.slice(start, end).trim();
    const keywordLine = content.match(/^Palavras-chave:\s*(.+)$/m)?.[1] ?? '';

    return {
      title: heading[1].trim(),
      content,
      searchableText: `${heading[1]} ${content}`,
      keywords: tokenize(keywordLine),
    };
  });
}

function tokenize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .match(/[\p{L}\p{N}]+/gu)
    ?.filter((word) => word.length > 2 && !STOP_WORDS.has(word)) ?? [];
}

async function loadContext() {
  const fileInfo = await stat(contextPath);
  if (
    cachedContext?.modifiedAt === fileInfo.mtimeMs &&
    cachedContext.size === fileInfo.size
  ) {
    return cachedContext.sections;
  }

  const markdown = await readFile(contextPath, 'utf8');
  const sections = parseSections(markdown);
  if (sections.length === 0) {
    throw new Error('O arquivo de contexto do chatbot não contém seções.');
  }

  cachedContext = { modifiedAt: fileInfo.mtimeMs, size: fileInfo.size, sections };
  return sections;
}

function rankSection(section, queryWords) {
  const sectionWords = new Set(tokenize(section.searchableText));
  const titleWords = new Set(tokenize(section.title));
  let score = 0;

  for (const word of queryWords) {
    if (section.keywords.includes(word)) score += 4;
    if (titleWords.has(word)) score += 3;
    if (sectionWords.has(word)) score += 1;
  }

  return score;
}

export async function getRelevantContext(query, dynamicSections = []) {
  const sections = [...await loadContext(), ...dynamicSections];
  const queryWords = [...new Set(tokenize(query))];
  const rankedSections = sections
    .map((section, index) => ({ section, index, score: rankSection(section, queryWords) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, MAX_CONTEXT_SECTIONS);

  const selectedSections = rankedSections.length > 0
    ? rankedSections.map(({ section }) => section)
    : [sections[0]];

  return selectedSections
    .map(({ title, content }) => `### ${title}\n${content}`)
    .join('\n\n');
}
