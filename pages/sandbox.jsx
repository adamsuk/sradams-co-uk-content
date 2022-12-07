import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import sandboxes from '../components/sandbox';
import SideBar from '../components/SideBar';

function SandboxItem({ item }) {
  return (
    <button type="button">
      <h4>{item.title}</h4>
    </button>
  );
}

SandboxItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
};

function Sandbox({ className }) {
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

  const changeRouting = ({ index, items }) => {
    if (items[index]?.slug) {
      router.push(`/sandbox/?component=${items[index].slug}`, undefined, {
        shallow: true,
      });
    }
  };

  const Component = ({ index, items }) => items[index].component;
  const ComponentProps = { sandbox, setSandbox };

  return (
    <div className="h-full pt-7">
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

Sandbox.defaultProps = {
  className: '',
};

Sandbox.propTypes = {
  className: PropTypes.string,
};

export default Sandbox;
