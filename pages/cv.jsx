/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import axios from 'axios';
import { BsPrinterFill, BsChevronDown, BsChevronUp } from 'react-icons/bs';

import env from '../default-env';
import { theme } from '../tailwind.config';

const fonts = Object.keys(theme.fontSize);

const CvSection = ({
  title, content, collapsable = false, baseFontSize = 6, level = 1,
}) => {
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
    <div className="select-none pb-2 pt-1 print:py-0">
      <div
        tabIndex="0"
        onClick={toggleCollapsable}
        onKeyPress={toggleCollapsable}
        role="button"
        className={`${collapsable ? 'cursor-pointer' : ''} flex w-full text-${headerFont} font-bold pb-1 print:text-sm print:font-semibold print:pb-0`}
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
      <Markdown
        rehypePlugins={[rehypeRaw]}
        parserOptions={{ commonmark: true }}
        className={`${collapsed ? 'hidden' : 'shown'} prose dark:prose-invert whitespace-no-wrap max-w-full print:hidden`}
      >
        {content}
      </Markdown>
      <hr className="mt-1 print:hidden" />
      <Markdown className="hidden prose whitespace-no-wrap max-w-full print:text-2xs print:block">
        {level === 1 ? `---\n\n${content}` : content}
      </Markdown>
    </div>
  );
};

CvSection.defaultProps = {
  collapsable: false,
  baseFontSize: 6,
  level: 1,
};

CvSection.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  collapsable: PropTypes.bool,
  baseFontSize: PropTypes.number,
  level: PropTypes.number,
};

const Cv = ({ grav, className }) => {
  const print = () => {
    window.print();
  };
  return (
    <div className={className}>
      <div className="flex flex-col max-w-7xl m-auto pb-4 pt-8 px-4 print:p-5 print:text-black">
        <h1 className="text-center text-3xl print:text-xl print:pt-1 print:text-black">
          {grav?.header?.title}
        </h1>
        <div className="flex justify-end pt-1 print:hidden">
          <BsPrinterFill className="cursor-pointer" onClick={print} size={24} />
        </div>
        {grav?.children.map((el) => (
          <CvSection
            content={el.content}
            collapsable={el.header?.collapsable}
            level={el.header?.level}
            title={el.header.title}
          />
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const grav = await axios
    .get(`${env.NEXT_PUBLIC_CMS_URL}/cv?return-as=json`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return {
    props: {
      grav,
    },
  };
}

Cv.defaultProps = {
  className: '',
};

Cv.propTypes = {
  className: PropTypes.string,
  grav: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    children: PropTypes.array,
    header: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
};

export default Cv;
