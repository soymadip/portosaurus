
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { usePluginData } from '@docusaurus/useGlobalData';
import { iconMap } from '@site/src/config/iconMappings';
import DocCardList from '@theme/DocCardList';

import { FaBook } from 'react-icons/fa';
import styles from './styles.module.css';



function indexNotes() {
  const context = require.context(`@site/notes`, true, /index\.mdx?$|\.mdx?$/);

  return context.keys()
    .filter(path => {

      // Skip root index file
      if (path === './index.md' || path === './index.mdx') {
        return false;
      }

      const pathParts = path.split('/');
      const isTopLevelFile = pathParts.length === 2 && !path.match(/index\.mdx?$/);
      const isTopLevelDir = pathParts.length === 3 && path.match(/index\.mdx?$/);

      // Keep only top-level files & dirs 
      return isTopLevelFile || isTopLevelDir;

    }).map(path => {
      const pathParts = path.split('/');
      const isTopLevelFile = pathParts.length === 2;
      
      // Extract directory or filename
      const slug = isTopLevelFile 
        ? path.replace('./', '').replace(/\.mdx?$/, '')
        : pathParts[1];
      
      const { frontMatter } = context(path);

      const title = frontMatter.title || slug.charAt(0).toUpperCase() + slug.slice(1);
      const language = frontMatter.language
        ? frontMatter.language.toLowerCase().replace(/ /g, "").replace(/[\s-]/g, "")
        : slug.toLowerCase() || title.toLowerCase();
      const position = frontMatter.sidebar_position || 999;

      return {
        title,
        language,
        link: slug,
        position
      };

    }).sort((a, b) => a.position - b.position);
}


export default function NoteCards({ buttonText = 'Open Note' }) {
  const notes = indexNotes();
  const { path: docsBasePath } = usePluginData('docusaurus-plugin-content-docs');

  return (
    <div className={styles.notesGrid} role="list" aria-label="Notes collection"> {
      notes.map(({ title, language, link }, index) => {

        const noteUrl = useBaseUrl(`${docsBasePath}/${link}`);
        const { icon: Icon = FaBook, color = 'var(--ifm-color-primary)' } = iconMap[language] || iconMap[title.toLowerCase()] || {};

        return (
          <div 
            key={title} 
            className={`${styles.noteCard} note-card`}
            style={{ '--card-index': index }}
            role="listitem"
            id={`note-${link}`}
          >
            <div 
              className={styles.noteIcon}
              style={{ color }}
              aria-hidden="true"
            >
              <Icon />
            </div>
            <h3 className={styles.noteTitle}>{title}</h3>
            <Link 
              className="button button--primary" 
              to={noteUrl}
              aria-label={`Open ${title} note`}
            >
              {buttonText}
            </Link>
          </div>
        );
      })}
    </div>
  );
}


// List Topics inside Individual Notes
export function TopicList({
  description = 'Click on the links below to explore the topics.',
  style = { 
    marginTop: '-2.5rem',
    marginBottom: '2.5rem',
    textAlign: 'center'
  }
}) {
  return (
    <>
      <p 
        style={style}
        dangerouslySetInnerHTML={{__html: description}} // Well we are giving it only HTML :)
      />
      <DocCardList/>
    </>
  );
}