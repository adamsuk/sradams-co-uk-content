import React, { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from 'next/router'

import { VscClose, VscChevronRight, VscChevronDown } from "react-icons/vsc";

const SideBar = ({children, childrenProps={}, sidebarItems, SidebarItem, error, className, index = 0, changeRouting}) => {
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
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  useLayoutEffect(() => {
    if (error) {
      router.push('/404')
    }
  }, [error])

  const toggleSide = () => {
    setSideActive(!sideActive);
  }

  const changeItem = (i, isSmallScreen=false) => () => {
    setItemIndex(i)
    if (changeRouting) {
      changeRouting({ index: i, items: sidebarItems })
    }
    if (isSmallScreen) {
      toggleSide()
    }
  }
  
  useEffect(() => {
    setSideActive(true);
  }, [router])

  useEffect(() => {
    setItemIndex(index);
  }, [index])

  const Component = children({ index: itemIndex, items: sidebarItems });

  return (
    <div className={className}>
      {(!sideActive) &&
        <>
          <div className="hidden lg:block z-30 items-center justify-center lg:fixed rounded-r-lg bg-gray-200 dark:bg-gray-700">
            <button>
              <VscChevronRight size={36} onClick={toggleSide}/>
            </button>
          </div>
          <div className="visible lg:hidden z-30 items-center justify-center fixed rounded-r-lg bg-gray-200 dark:bg-gray-700">
            <button>
              <VscChevronDown size={36} onClick={toggleSide}/>
            </button>
          </div>
        </>
      }
      <div className={`${(windowSize.width > maxSize) ? '' : 'flex flex-wrap flex-col'} mb-auto md:flex-row md:px-0 max-w-screen w-full justify-between ${sideActive ? "lg:flex-row" : "mx-auto"}`}>
        <div className={`${sideActive ? "visible" : "hidden"} md:max-w-[500px] md:w-2/5 w-full overflow-y-hidden`}>
          <div className={'md:fixed flex flex-col overflow-y rounded-r-lg bg-gray-200 dark:bg-gray-800 max-h-[80%] h-[80%] md:max-w-[500px] md:w-2/5 w-full p-3'}>
            {(sideActive) && 
              <>
                <div className={'flex w-full items-end justify-end'}>
                  <button>
                    <VscClose size={36} onClick={toggleSide}/>
                  </button>
                </div>
                <div className="flex-1 h-full w-full overflow-y-scroll no-scrollbar items-center text-center">
                  {sidebarItems.map((item, index) => (
                    <div key={`blog-${index}-div1`} className={`hover:bg-white hover:dark:bg-gray-600 p-2 ${index==(sidebarItems.length - 1) ? "" : "border-b-4 border-gray-300"}`}>
                      <div key={`blog-${index}-div2`} className="">
                        <a key={`blog-${index}-a`} onClick={changeItem(index, (windowSize.width <= mobileSize))}>
                          <SidebarItem
                            item={item}
                            index={index}
                          />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            }
          </div>
        </div>
        <div className={`${sideActive ? "hidden md:block" : ""} flex-1 flex-col max-w-screen w-full mx-auto items-center overflow-y-hidden pb-4 px-4 max-w-7xl`}>
          {(typeof Component === "function" ?
              React.isValidElement(Component()) ? <Component {...childrenProps}/> : Component()
            : Component)}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
