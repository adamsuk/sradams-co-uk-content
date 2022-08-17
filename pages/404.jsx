import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

function Custom404({ className = '' }) {
  return (
    <div className={cn(className, 'relative top-1/2 translate-y-[-50%]')}>
      <div className="justify-center items-center w-full p-3 md:p-7">
        <div className="flex flex-col m-auto text-center content-center md:max-w-[35%]">
          <div className="text-[10rem]">😭</div>
          <br />
          <h1>Uh oh ...</h1>
          <br />
          <div>
            You&apos;ve either clicked a TBC link or chanced it with a path that
            doesn&apos;t exist.
          </div>
          <div>Either way no page here.</div>
        </div>
      </div>
    </div>
  );
}

Custom404.defaultProps = {
  className: '',
};

Custom404.propTypes = {
  className: PropTypes.string,
};

export default Custom404;
