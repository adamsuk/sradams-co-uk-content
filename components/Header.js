import Link from "next/link";
import { Menu } from '@headlessui/react'

export default function Header(props) {
  const menuItems = [
    { title: "Blog", url: "/blog" },
    { title: "Sandbox", url: "/sandbox" },
    { title: "CV", url: "/cv" }
  ];
  return (
    <header
      className={`fixed w-full overflow-x-scroll no-scrollbar backdrop-filter backdrop-blur-lg bg-white/50 z-20 trasition ease-in-out duration-500 print:hidden`}
    >
      <div className="max-w-7xl mx-auto ">
        <div
          className={`flex max-w-screen-xl py-2 mx-auto items-center justify-between px-4 trasition ease-in-out duration-500`}
        >
          <Link href="/">
            <a
              className="hidden md:block text-xl font-bold tracking-tighter pr-8"
            >
              Scott Adams
            </a>
          </Link>
          <nav>
            <ul className="flex items-center justify-end">
            {menuItems?.map((item) => {
              if (item.options) {
                return (
                <Menu as="li" key={item?.title}>
                  <Menu.Button key={item?.title} className="inline-flex justify-center w-full px-2 lg:px-6">
                    {item?.title}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y">
                  <div className="px-1 py-1">
                    <Menu.Item onClick={() => (console.log('hi there'))}>
                      {(opts) => {
                        return (
                        <a
                          className="uppercase px-2 lg:px-6 py-2 text-md border-b-2 border-transparent hover:border-indigo-400 leading-[22px] md:px-3 text-gray-800 hover:text-indigo-500"
                        >
                          hi there
                        </a>
                      )}}
                    </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                    <Menu.Item onClick={() => (console.log('erm'))}>
                      {(opts) => {
                        return (
                        <a
                          className="uppercase px-2 lg:px-6 py-2 text-md border-b-2 border-transparent hover:border-indigo-400 leading-[22px] md:px-3 text-gray-800 hover:text-indigo-500"
                        >
                          erm
                        </a>
                      )}}
                    </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              )} else {
                return (<li key={item?.title}>
                  <Link href={item?.url}>
                    <a className="uppercase px-2 lg:px-6 py-2 border-b-2 border-transparent leading-[22px] md:px-3">
                      {item?.title}
                    </a>
                  </Link>
                </li>
              )}
            })}
            </ul>
          </nav>
          <Link href="/">
            <a
              className="visible md:hidden text-xl font-bold tracking-tighter pl-2"
            >
              SA
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
