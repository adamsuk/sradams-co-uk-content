import React from 'react';
import Play from './Play';
import Pause from './Pause';
import Next from './Next';
import Previous from './Previous';
import Shuffle from './Shuffle';

export default {
  title: 'Components/Sandbox/Icons',
  parameters: {
    layout: 'centered',
  },
};

const iconStyle = {
  height: '100px',
  width: '100px',
  fill: 'white',
  stroke: 'black',
  strokeWidth: '4',
};

export function PlayIcon() {
  return <Play style={iconStyle} />;
}
export function PauseIcon() {
  return <Pause style={iconStyle} />;
}
export function NextIcon() {
  return <Next style={iconStyle} />;
}
export function PreviousIcon() {
  return <Previous style={iconStyle} />;
}
export function ShuffleIcon() {
  return <Shuffle style={iconStyle} />;
}

export function AllIcons() {
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div>
        <Play style={iconStyle} />
        <p>Play</p>
      </div>
      <div>
        <Pause style={iconStyle} />
        <p>Pause</p>
      </div>
      <div>
        <Previous style={iconStyle} />
        <p>Previous</p>
      </div>
      <div>
        <Next style={iconStyle} />
        <p>Next</p>
      </div>
      <div>
        <Shuffle style={iconStyle} />
        <p>Shuffle</p>
      </div>
    </div>
  );
}
