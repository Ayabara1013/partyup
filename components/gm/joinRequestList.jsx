export default function JoinRequestList({game}) {
  let requestButtons = [];
  let index = 0;
  for (let req of game.requests) {
    function acceptOnClick() {

    }
    console.log(req)
    requestButtons.push(
      <button key={index} onClick={acceptOnClick}
              className={`btn btn-primary button-breakpoints m-auto w-1/2 md:px-6 txt-3xl`}>{req.uName}</button>
    )
    index++;
  }

  return (
    <div className='__players-list__list flex flex-row flex-wrap gap-2 mt-5'>
      {requestButtons}
    </div>
  )
}