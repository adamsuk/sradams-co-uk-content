import React, { useState, useEffect } from "react";
import { VscClose, VscChevronRight, VscChevronDown } from "react-icons/vsc";
import { useMediaQuery } from 'react-responsive'
import sandboxes from "../components/sandbox";

const Sandbox = (props) => {
  const [sideActive, setSideActive] = useState(true);
  const [index, setIndex] = useState(0);

  // figure out if its a large screen
  // TODO: link to tailwind breakpoints
  const isDesktopOrLaptop = useMediaQuery(
    { minDeviceWidth: 768 },
  )

  const toggleSide = () => {
    setSideActive(!sideActive);
  }

  const changeSandbox = (i, isSmallScreen=false) => () => {
    setIndex(i);
    if (isSmallScreen) {
      toggleSide()
    }
  }

  const Component = sandboxes[index].component;

  return (
    <>
      <div className="pt-7">
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
      </div>
      <div className={`relative container mb-auto flex flex-wrap flex-col md:flex-row md:px-0 max-w-screen w-full justify-between ${sideActive ? "lg:flex-row" : "md:max-w-7xl mx-auto"}`}>
        <div className={`${sideActive ? "visible" : "hidden"} relative md:w-2/5 w-full overflow-y-hidden`}>
          <div className="fixed flex flex-col overflow-y rounded-r-lg bg-gray-200 dark:bg-gray-700 max-h-[80%] h-[80%] md:w-1/3 w-full p-3">
            {(sideActive) && 
              <>
                <div className="flex w-full items-end justify-end">
                  <button>
                    <VscClose size={36} onClick={toggleSide}/>
                  </button>
                </div>
                <div className="flex-1 h-full overflow-y-scroll no-scrollbar items-center text-center">
                  {sandboxes.map((post, index) => (
                    <div key={`${post.title}-div1`} className='py-2'>
                      <div key={`${post.title}-div2`}>
                        <a key={`${post.title}-a`} onClick={changeSandbox(index, !isDesktopOrLaptop)}>
                          <button type="button">
                            <h4>{post.title}</h4>
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            }
          </div>
        </div>
        <div className={`${sideActive ? "hidden md:block" : ""} flex-1 flex-col max-w-screen w-full mx-auto items-center overflow-y-hidden pb-4 px-7`}>
          <Component props={props}/>
        </div>
      </div>
    </>
  );
};

export default Sandbox
