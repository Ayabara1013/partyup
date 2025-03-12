



export function Modal({ className, children }) {
  return (
    <>
      <button className="btn" onClick={() => document.getElementById('modal_template').showModal()}>open modal</button>
          
      <dialog id="modal_template" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">

          {/* if there is a button in form, it will close the modal */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          

          <div className="tb1">
            {/* <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click on ✕ button to close</p> */}

            {children}
          </div>

          <div className='modal-action'>
              <button className='btn btn-primary'>accept</button>
              <form method="dialog" className='flex gap-2'>
                <button className='btn'>close</button>
              </form>
          </div>
        </div>

        {/* for closing when clicking outside the box */}
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}