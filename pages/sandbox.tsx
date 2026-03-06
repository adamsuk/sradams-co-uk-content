import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import sandboxes from '../components/sandbox';
import SideBar from '../components/SideBar';

interface SandboxItemProps {
  item: { title?: string };
}

function SandboxItem({ item }: SandboxItemProps) {
  return (
    <button type="button">
      <h4>{item.title}</h4>
    </button>
  );
}

interface SandboxProps {
  className?: string;
}

function Sandbox({ className = '' }: SandboxProps) {
  const [itemIndex, setItemIndex] = useState(0);
  const [sandbox, setSandbox] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (router.query?.component) {
      const index = sandboxes.findIndex(
        (item) => item.slug === router.query.component,
      );
      if (index !== -1) {
        setItemIndex(index);
      }
    }
  }, [router.query]);

  const changeRouting = ({ index, items }: { index: number; items: typeof sandboxes }) => {
    if (items[index]?.slug) {
      router.push(`/sandbox/?component=${items[index].slug}`, undefined, {
        shallow: true,
      });
    }
  };

  const Component = (
    { index, items }: { index: number; items: typeof sandboxes },
  ) => items[index].component;
  const ComponentProps = { sandbox, setSandbox };

  return (
    <div className="flex-1 pt-7">
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
}

export default Sandbox;
