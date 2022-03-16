import React, { Component, useEffect, useState } from "react";
import { useRouter } from 'next/router'

import sandboxes from "../components/sandbox";
import SideBar from '../components/SideBar'

const Sandbox = ({ className }) => {
  const [itemIndex, setItemIndex] = useState(0);
  const [sandbox, setSandbox] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (router.query?.component) {
      const index = sandboxes.findIndex(item => item.slug === router.query.component)
      if (index !== -1) {
        setItemIndex(index)
      }
    }
  }, [router.query])

  const SandboxItem = ({ item, index }) => (
    <button type="button">
      <h4>{item.title}</h4>
    </button>
  )

  const changeRouting = ({ index, items }) => {
    if (items[index]?.slug) {
      router.push(`/sandbox/?component=${items[index].slug}`, undefined, { shallow: true })
    }
  }

  const Component = ({ index, items }) => items[index].component;
  const ComponentProps = { sandbox, setSandbox };

  return (
    <div className="pt-7">
      <h1 className="text-center">🚧 Under Construction 🚧</h1>
      <SideBar
        childrenProps={ComponentProps}
        sidebarItems={sandboxes}
        SidebarItem={SandboxItem}
        error={false}
        className={className}
        index={itemIndex}
        changeRouting={changeRouting}
      >
        {Component}
      </SideBar>
  </div>
  );
};

export default Sandbox
