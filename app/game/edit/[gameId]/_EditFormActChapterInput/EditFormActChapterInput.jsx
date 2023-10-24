import { ui } from "@/util/ui";


export default function EditFormActChapterInput({ game }) {
  let { hasActs, hasChapters, maxActs, maxChapters, currentAct, currentChapter } = game
  const onCheck = (e) => {
    let toggleId = e.target.value
    if (e.target.checked) {
      ui.editGame[`max${ toggleId }s`].element().removeAttribute('disabled');
      ui.editGame[`current${ toggleId }`].element().removeAttribute('disabled');
    } else {
      ui.editGame[`max${ toggleId }s`].element().setAttribute('disabled', true);
      ui.editGame[`current${ toggleId }`].element().setAttribute('disabled', true);
    }
  }

  const maxActOnChange = (e) => {
    let currentElement = ui.editGame.currentAct.element();
    currentElement.max = e.target.value;
    if (currentElement.value > currentElement.max) currentElement.value = currentElement.max;
  }
  const maxChapterOnChange = (e) => {
    let currentElement = ui.editGame.currentChapter.element();
    currentElement.max = e.target.value;
    if (currentElement.value > currentElement.max) {
    }
    currentElement.value = currentElement.max;
    currentActOnChange();
  }

  const currentActOnChange = () => {
    ui.editGame.currentChapter.element().value = 1;
  }

  return (
    <div className="center w-full">
      <div className="flex flex-col w-10/12">
        <div className="center w-full gap-4">
          <InputWrapper label="Does your game use acts? (Max Acts)"  checked={ true }>
            <input type="checkbox" className="checkbox h-full join-item" value="Act" onChange={ onCheck }
                   id={ ui.editGame.hasActs.id } defaultChecked={ hasActs }/>
            <input type="number" className="input input-bordered w-full join-item"
                   id={ ui.editGame.maxActs.id } min={ 1 } onChange={ maxActOnChange } disabled={ !hasActs }
                   placeholder="Count" defaultValue={ maxActs }/>
          </InputWrapper>
          <InputWrapper label="Does your game use chapters? (Max Chapters)" checked={ true }>
            <input type="checkbox" className="checkbox h-full join-item" value="Chapter" onChange={ onCheck }
                   id={ ui.editGame.hasChapters.id } defaultChecked={ hasChapters }/>
            <input type="number" className="input input-bordered w-full join-item" id={ ui.editGame.maxChapters.id }
                   min={ 1 } onChange={ maxChapterOnChange } disabled={ !hasChapters } placeholder="Count"
                   defaultValue={ maxChapters }/>
          </InputWrapper>
        </div>
        <div className="center w-full gap-4">
          <InputWrapper label="Current Act:">
            <input type="number" placeholder="Count" defaultValue={ currentAct } className="input input-bordered w-full"
                   id={ ui.editGame.currentAct.id } min={ 1 } max={ maxActs } onChange={ currentActOnChange }
                   disabled={ !hasActs }/>
          </InputWrapper>
          <InputWrapper label="Current Chapter:">
            <input type="number" placeholder="Count" defaultValue={ currentChapter }
                   className="input input-bordered w-full" id={ ui.editGame.currentChapter.id } min={ 1 }
                   max={ maxChapters } disabled={ !hasChapters }/>
          </InputWrapper>
        </div>

      </div>
    </div>
  )
}

function InputWrapper({ label, checked, children }) {
  return (

    <div className="form-control w-1/2">
      <label className="label">
        <span className="label-text">{ label }</span>
      </label>
      { checked
        ? <div className="join center vertical w-full"> { children }</div>
        : children
      }
    </div>
  )

}