


export function FeatureAccordion({ className }) {
  return (
    <div className={`${className} feature-accordion flex-col-2`}>
      <AccordionListing title={'play any game'}>
        Upload your own or choose from our Marketplace full of talented artists.
      </AccordionListing>

      <AccordionListing title={'play from anywhere'}>
        Hundreds of sheets to automatically track and calculate character information, or build your own.
      </AccordionListing>

      <AccordionListing title={'play with anyone'}>
        Automate tedious game mechanics: get hundreds of options you can add with one click.
      </AccordionListing>

      <AccordionListing title={'play any time'}>
        pot bigger rate free real brown edge camp drove stopped finish ask purpose especially length dinner call donkey press four handle make slip influence
      </AccordionListing>

      <AccordionListing title={'play for free'}>
        felt broke magnet queen so over warm slip column construction in daily planning oxygen studied unknown visitor love duck lovely difficulty layers liquid imagine
      </AccordionListing>

    </div>
  )
}


function AccordionListing({ className, title, children }) {
  return (
    <div className={`${className} collapse collapse-plus bg-neutral`}>
      <input type="radio" name="feature-accordion" checked="checked" /> 
      <div className="collapse-title text-xl font-medium">
        {title || '{title}'}
      </div>

      <div className="collapse-content"> 
        {children || '{children}'}
      </div>
    </div>
  )
}