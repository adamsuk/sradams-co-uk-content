// TODO: sort out a11y
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { VscClose, VscChevronRight, VscChevronDown } from 'react-icons/vsc';

function SideBar({
  children,
  childrenProps = {},
  sidebarItems,
  SidebarItem,
  error,
  className,
  index = 0,
  changeRouting,
}) {
  const [sideActive, setSideActive] = useState(true);
  const [itemIndex, setItemIndex] = useState(index);
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const router = useRouter();

  const mobileSize = 768;
  const maxSize = 2300;

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
  }, []);

  useEffect(() => {
    if (error) {
      router.push('/404');
    }
  }, [error]);

  const toggleSide = () => {
    setSideActive(!sideActive);
  };

  const changeItem = (i, isSmallScreen = false) => () => {
    setItemIndex(i);
    if (changeRouting) {
      changeRouting({ index: i, items: sidebarItems });
    }
    if (isSmallScreen) {
      toggleSide();
    }
  };

  useEffect(() => {
    setItemIndex(index);
  }, [index]);

  const Component = children({ index: itemIndex, items: sidebarItems });

  return (
    <div className={cn(className, 'h-full')}>
      {!sideActive && (
        <>
          <div className="hidden lg:block z-30 items-center justify-center lg:fixed rounded-r-lg bg-gray-200 dark:bg-gray-700">
            <button type="button">
              <VscChevronRight size={36} onClick={toggleSide} />
            </button>
          </div>
          <div className="visible lg:hidden z-30 items-center justify-center fixed rounded-r-lg bg-gray-200 dark:bg-gray-700">
            <button type="button">
              <VscChevronDown size={36} onClick={toggleSide} />
            </button>
          </div>
        </>
      )}
      <div
        className={`${
          windowSize.width > maxSize ? '' : 'flex flex-wrap flex-col'
        } h-full mb-auto md:flex-row md:px-0 max-w-screen w-full justify-between ${
          sideActive ? 'lg:flex-row' : 'mx-auto'
        }`}
      >
        <div
          className={`${
            sideActive ? 'visible h-dvh' : 'hidden'
          } md:max-w-[500px] md:w-2/5 w-full overflow-y-hidden`}
        >
          <div
            className="md:fixed flex flex-col overflow-y rounded-r-lg bg-gray-200 h-full dark:bg-gray-800 md:h-[80%] md:max-w-[500px] md:w-2/5 w-full p-3"
          >
            {sideActive && (
              <>
                <div className="flex w-full items-end justify-end">
                  <button type="button">
                    <VscClose size={36} onClick={toggleSide} />
                  </button>
                </div>
                <div className="flex-1 h-full w-full overflow-y-scroll no-scrollbar items-center text-center">
                  {sidebarItems.map((item, i) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={`blog-${i}-div1`}
                      className={`hover:bg-white hover:dark:bg-gray-600 p-2 ${
                        i === sidebarItems.length - 1
                          ? ''
                          : 'border-b-4 border-gray-300'
                      }`}
                    >
                      <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={`blog-${i}-div2`}
                        className=""
                        onClick={changeItem(
                          i,
                          windowSize.width <= mobileSize,
                        )}
                      >
                        <SidebarItem item={item} index={i} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div
          className={`${
            sideActive ? 'hidden md:block' : ''
          } flex-1 flex-col max-w-screen w-full mx-auto items-center overflow-y-hidden pb-4 px-4 max-w-7xl`}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {typeof Component === 'function' ? (
            React.isValidElement(Component()) ? (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Component {...childrenProps} />
            ) : (
              Component()
            )
          ) : (
            Component
          )}
        </div>
      </div>
    </div>
  );
}

SideBar.defaultProps = {
  childrenProps: {},
  error: null,
  className: '',
  index: 0,
  changeRouting: null,
};

SideBar.propTypes = {
  children: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  childrenProps: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  sidebarItems: PropTypes.array.isRequired,
  SidebarItem: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.bool,
  className: PropTypes.string,
  index: PropTypes.number,
  changeRouting: PropTypes.func,
};

export default SideBar;
