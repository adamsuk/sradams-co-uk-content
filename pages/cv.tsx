import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import axios from 'axios';
import { BsPrinterFill, BsChevronDown, BsChevronUp } from 'react-icons/bs';

import env from '../default-env';
import { theme } from '../tailwind.config';
import Loader from '../components/Loader';
import NavBar from '../components/NavBar';

const fonts = Object.keys(theme.fontSize);

interface CvSectionProps {
  title?: string;
  content: string;
  collapsable?: boolean;
  baseFontSize?: number;
  level?: number;
}

const CvSection = ({
  title, content, collapsable = false, baseFontSize = 6, level = 1,
}: CvSectionProps) => {
  const [collapsed, setCollapsed] = useState(collapsable);
  const [headerFont, setHeaderFont] = useState('2xl');

  useEffect(() => {
    const fontSize = baseFontSize - (level - 1);
    if (fontSize >= 3 && fontSize <= fonts.length) {
      setHeaderFont(fonts[fontSize]);
    }
  }, [baseFontSize, level]);

  const toggleCollapsable = () => {
    if (collapsable) {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="select-none pb-2 pt-1">
      {title && (
        <div
          tabIndex={0}
          onClick={toggleCollapsable}
          onKeyPress={toggleCollapsable}
          role="button"
          className={`${collapsable ? 'cursor-pointer' : ''} flex w-full text-${headerFont} font-bold pb-1 print:text-sm print:font-semibold`}
        >
          <div className="w-full">
            {title}
          </div>
          <div className="m-auto print:hidden">
            {(collapsable && collapsed)
              && <BsChevronDown size={24} />}
            {(collapsable && !collapsed)
              && <BsChevronUp size={24} />}
          </div>
        </div>
      )}
      <Markdown
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePlugins={[rehypeRaw] as any}
        className={`${collapsed ? 'hidden' : 'shown'} prose dark:prose-invert whitespace-no-wrap max-w-full print:hidden`}
        disallowedElements={['h2']}
      >
        {content}
      </Markdown>
      <hr />
      <Markdown
        className="hidden prose whitespace-no-wrap print:[&_img]:hidden max-w-full print:text-2xs print:block"
        disallowedElements={['h2', 'hr']}
      >
        {level === 1 ? `---\n\n${content}` : content}
      </Markdown>
    </div>
  );
};

interface CvMeta {
  title?: string;
  collapsable?: boolean;
  level?: number;
}

interface CvItem {
  name: string;
  meta: CvMeta;
  content: string;
}

const Cv = () => {
  const [cv, setCv] = useState<CvItem[]>([]);
  const [tldr, setTldr] = useState<CvItem | undefined>();
  const [pp, setPp] = useState<CvItem | undefined>();
  const [meta, setMeta] = useState<CvItem | undefined>();
  const print = () => {
    window.print();
  };
  const githubProfile = env.NEXT_PUBLIC_GITHUB_PROFILE;

  useEffect(() => {
    axios
      .get(`${env.NEXT_PUBLIC_CMS_URL}/cv`)
      .then((response) => {
        const raw: CvItem[] = response.data.filter((section: CvItem) => section.meta);
        const rawMeta = raw.filter((section) => section.name === 'blog.md');
        if (rawMeta) {
          setMeta(rawMeta[0]);
        }
        const newCv = raw.filter((section) => section.name !== 'blog.md');
        setCv(newCv.filter((item) => !['TL;DR', 'Personal Profile'].includes(item.meta.title || '')));
        setTldr(newCv.find((item) => item.meta.title === 'TL;DR'));
        setPp(newCv.find((item) => item.meta.title === 'Personal Profile'));
      });
  }, []);

  return (
    <div className={cn('flex flex-col max-w-7xl m-auto pb-4 pt-8 px-4 print:p-2 print:text-black', { 'h-full': !cv })}>
      {cv.length ? (
        <>
          <div className="flex justify-end pt-1 print:hidden">
            <BsPrinterFill className="cursor-pointer" onClick={print} size={24} />
          </div>
          <h1 className="text-center text-3xl print:text-xl print:pt-1 print:text-black">
            {meta?.meta?.title}
          </h1>
          <NavBar className="hidden print:block" />
          {tldr && <CvSection content={tldr.content} />}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex-1 basis-1/2">
              {pp && <CvSection content={pp.content} />}
            </div>
            {githubProfile && (
              <div className="flex-1">
                <img
                  alt="ME!"
                  className="mx-auto rounded-full items-center justify-center"
                  src={`https://github.com/${githubProfile}.png`}
                />
              </div>
            )}
          </div>
          {cv?.map((el) => (
            <CvSection
              key={el.meta.title}
              content={el.content}
              collapsable={el.meta?.collapsable}
              level={el.meta?.level}
              title={el.meta.title}
            />
          ))}
        </>
      ) : <Loader />}
    </div>
  );
};

export default Cv;
