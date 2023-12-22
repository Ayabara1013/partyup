import '@styles/blocks.scss';



export const Blocks = {
  Section: function ({ id, className = '', header, children, ...props }) {
    return (
      <div id={id} className={`${className} flex ${!className.includes('flex-row') && 'flex-col'} b1`}>
        {children}
      </div>
    )
  },

  Header: function ({ className = '', children, title }) {
    const sizes = ['text-sm', 'text-md', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl'];
    const hasSize = sizes.some(size => className.includes(size));

    return (
      <h1 className={`${className} ${!hasSize && 'text-3xl'} text-center font-bold`}>
        {children || title}
      </h1>
    )
  },

  TextBlock: function ({ className = '', children, ...props }) {
    return (
      <div className={`${className} b2`}>
        {children}
      </div>
    )
  },

  // search elements -----------------------------------------------------------
  SearchFilter: function ({ className = '', list = true, children, onClick, ...props }) {
    const sizes = ['btn-xs', 'btn-sm', 'btn-md', 'btn-lg', 'btn-wide', 'btn-block', 'btn-circle', 'btn-square'];
    const variants = ['btn-primary', 'btn-secondary', 'btn-ghost', 'btn-link', 'btn-error', 'btn-warning', 'btn-success', 'btn-info'];

    const hasSize = sizes.some(size => className.includes(size));
    const hasVariant = variants.some(variant => className.includes(variant));

    const FilterButton = () => {
      return (
        <button
          className={`btn ${className} ${(!hasVariant) && 'btn-primary'} ${!hasSize && 'btn-sm'}`}
          onClick={onClick}
        >
          {children}
        </button>
      )
    }

    return (
      <>
        {list
          ? <li><FilterButton /></li>
          : <FilterButton />
        }
      </>
    )
  },
  // ---------------------------------------------------------------------------
}