import Image from 'next/image';


export const Home = {
  Section: function ({ id, className = '', children, ...props }) {
    return (
      <div id={id} className={`${className} home__section py-4 flex ${!className.includes('flex-row') && 'flex-col'} gap-4`}>
        {/* {header && <Home.Header>{header}</Home.Header>} */}
        {children}
      </div>
    )
  },

  Header: function ({ className = '', children, title }) {
    const sizes = ['text-sm', 'text-md', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl'];
    const hasSize = sizes.some(size => className.includes(size));

    // if the header does not have a size class, add text-3xl
    return (
      <h1 className={`${className} home__header text-primary ${!hasSize && 'text-3xl'} text-center font-bold`}>
        {children || title}
      </h1>
    )
  },

  ImgPlaceholder: function ({ className = '', children, mdWidth = 'w-3/5', mdHeight, aspectRatio = 'aspect-[2/1]', text, ...props }) {

    return (
      <div className={`${className} flex justify-center items-center m-auto p-4 w-full ${aspectRatio} bg-info tb-3 md:m-auto md:${mdWidth}`}>
        <span className=''>{text || 'big picture thing'}</span>
      </div>
    )
  },

  Actions: {
    Card: function ({ className = '', children, header, text, img, first, ...props }) {
      return (
        <div className={`relative ${className} action-card ${!className.includes('flex-row') && 'flex-col'} justify-center m-auto px-4 py-8 items-center max-w-md min-h-16 bg-neutral rounded-lg`}>
          {/* {children} */}

          <RearImage />

          {/* {first === 'img' && (
            <img
              src={ img || 'https://roll20.net/v3/assets/img/icons/icon-sign-up.png'}
              alt=""
              className="action-card__img max-w-[60%] border"
            />
          )} */}

          <Home.Header className='action-card__header w-fit border text-2xl'>
            {header || '{header}'}
          </Home.Header>

          {/* {first !== 'img' && (
            <img
              src={ img || 'https://roll20.net/v3/assets/img/icons/icon-sign-up.png'}
              alt=""
              className="action-card__img w-20"
            />
          )} */}

          <p className='action-card__text text-center'>
            {children || 'chest meat order biggest seems reason frighten tent electric season fence guard belt chair cloud famous structure women thank income log ten parts careful'}
          </p>
        </div>
      )
    }
  }
}

function RearImage({className = ''}) {
  return (
    <img
      className='absolute top-0 left-0 p-2 max-w-full max-h-full'
      src='/images/008-spellbook-1.png'/>
  )
}