type UndoToastProps = {
  className: string;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
}

const UndoToast: React.FC<UndoToastProps> = ({ className, setClassName }) => {
  const style: React.CSSProperties = {
    display: className ? 'flex' : 'none'
  };

  return (
    <div
      id="notification"
      className={`notification ${className}`}
      style={style}
      onAnimationEnd={(e: React.AnimationEvent<HTMLDivElement>) => {
        if (e.animationName === 'exitAd') {
          setClassName('');
        }
      }}
    >
      <p className="notify-text">Task deleted</p>
      <button id="undo-btn">Undo</button>
    </div>
  )
}

export default UndoToast;