import { InfinitySpin } from 'react-loader-spinner';

const FullPageSpinner = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <InfinitySpin width="200" color="#4F46E5" />
      <span>{text}</span>
    </div>
  );
};

export default FullPageSpinner;