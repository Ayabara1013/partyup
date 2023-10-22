import Link from 'next/link';

export default function Dir({ children }) {
  return (
    <div>
      { children }
    </div>
  );
}


Dir.home = ({ children, className }) => {
  return (
    <Link className={ className } href='/home'>
      { (children) ? children : 'Home' }
    </Link>
  );
}

Dir.game = {
  create: ({ children, className }) => {
    return (
      <Link className={ className } href='/game/create'>
        { (children) ? children : 'Create Game' }
      </Link>
    );
  },
  current: ({ children, className, disabled, gameId }) => {
    return (
      (disabled) ? <button className={ className } disabled>Continue Last Game</button> :
        <Link className={ className } href={ `/game/${ gameId }` } disabled={ disabled }>
          { (children) ? children : 'Continue Last Game' }
        </Link>
    );
  },
  public: ({ children, className }) => {
    return (
      <Link className={ className } href='/game/public'>
        { (children) ? children : 'Join Public Games' }
      </Link>
    );
  },
}
Dir.user = {
  active: ({ children, className }) => {
    return (
      <Link className={ className } href='/user/activeGames'>
        { (children) ? children : 'Current Active Games' }
      </Link>
    );
  },
}
Dir.test = {
  chat:({ children, className }) => {
    return (
        <Link className={className} href='/test-page'>
          {(children) ? children : 'test page'}
        </Link>
    );
  },
}