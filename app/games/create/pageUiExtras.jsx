import {useState} from "react";

function ValidCheck({itemCheck, itemLimit}) {
  let display = 0 < itemCheck <= itemLimit ? '' : 'hidden';

  return (
    <div className={`${display} m-auto text-success font-semibold`}>good!</div>
  )
}

const parameterLimits = {
  systems: [],
  maxAllowedPlayers: 4,
}


function page({}) {
  const [params, setParams] = useState({
    name: '',
    system: '',
    maxPlayers: 0,
  })

  let displayMaxUserWarning = 'display-none';

  const handleMaxPlayerChange = (newValue) => {
    setParams((prevParams) => {
      let updatedParams = {...prevParams};
      updatedParams.maxPlayers = newValue;
      return updatedParams;
    })
  }

  return (<></>)
}

function Badge({name, className}) {
  const [state, setState] = useState('inactive'); // this could be a bool, I was just unsure if there was going to be a need for a specific 3rd option

  const handleClick = () => {
    if (state === 'inactive') setState('active');
    else if (state === 'active') setState('inactive');

    console.log(`poop`);
  }

  return (
    <button
      className={`px-4 btn ${state === 'inactive' ? 'btn-outline' : 'btn-primary'} ${className} btn-xs rounded-full`}
      onClick={handleClick}>{name || `badge`}</button>
  )
}

function SafetyChecks({safetyChecks, className}) {
  Object.keys(safetyChecks).map((item, index) => {
    return (
      <Badge name={item} index={index} key={index}/>
    )
  })

  return (
    <div className='flex gap-2'>
      {
        Object.values(safetyChecks).map((item, index) => {
          return (
            <Badge name={item} index={index} key={index}/>
          )
        })
      }
    </div>
  )
}
