'use client'

import { useRouter } from "next/navigation";

import PageLayout from "@/components/PageLayout";

import { ui } from "@/util/ui";
import { fbManagement } from "@/firebase/fbManagement";
import toast from "react-hot-toast";

export default function Page() {
  const { push } = useRouter();

  const createGameOnClick = async (e) => {
    e.target.setAttribute('disabled', true);
    let errMsg = '';
    let name = ui.createGame.name.element().value;
    let description = ui.createGame.description.element().value;
    let isPublic = false;
    let maxPlayers = parseInt(ui.createGame.maxPlayers.element().value);

    let hasActs = ui.createGame.hasActs.element().checked;
    let maxActs = parseInt(ui.createGame.maxActs.element().value);

    let hasChapters = ui.createGame.hasChapters.element().checked;
    let maxChapters = parseInt(ui.createGame.maxChapters.element().value);


    //Validate data
    if (name === '') {
      errMsg = 'Game name cannot be empty';
    }
    //Validate act numbers if applicable
    (hasActs && !maxActs) && (errMsg = 'Max Acts cannot be empty');
    (hasChapters && !maxChapters) && (errMsg = 'Max Chapters cannot be empty');

    //Set up data with conditional updates fields
    let data = {
      name,
      description,
      isPublic,
      maxPlayers,
      hasActs,
      maxActs: hasActs ? maxActs : 1,
      currentAct: 1,
      hasChapters,
      maxChapters: hasActs ? maxChapters : 1,
      currentChapter: 1,
    }
    if (errMsg !== '') {
      toast.error(errMsg);
      e.target.removeAttribute('disabled');
      return;
    }
    await fbManagement.dm.createGame(data);
    toast.error('Game Created!');
    e.target.removeAttribute('disabled');
    push('/user/activeGames');
  }

  return (
    <PageLayout title="Create a Game!" backHref="/home">
      <div className="flex flex-col">
        <CreateFormInput title={"What is the game name"} id={ui.createGame.name.id}/>
        <CreateFormInput title={"Game description (optional)"} id={ui.createGame.description.id}/>
        <CreateFormActChapter/>
        <CreateFormInput type="players" title={"Max Players:"} id={ui.createGame.maxPlayers.id}/>
      </div>
      <button className="btn mt-5" onClick={createGameOnClick}>Create Game!</button>
    </PageLayout>
  )
}

function CreateFormInput({ title, id, type }) {
  switch (type) {
    case 'players': {
      return (
        <div className="center w-full">
          <div className="form-control w-10/12">
            <label className="label">
              <span className="label-text">{title}</span>
            </label>
            <select className="select select-bordered" defaultValue="4" id={id}>
              <option value="1">1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6</option>
            </select>
          </div>
        </div>
      )
    }
    default:
      return (
        <div className="center w-full">
          <div className="form-control w-10/12">
            <label className="label">
              <span className="label-text">{title}</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full" id={id}/>
          </div>
        </div>
      )
  }
}

function CreateFormActChapter() {
  const onCheck = (e) => {
    let toggleId = e.target.value
    if (e.target.checked) {
      document.getElementById(toggleId).removeAttribute('disabled');
    } else {
      document.getElementById(toggleId).setAttribute('disabled', true);
    }
  }

  return (
    <div className="center w-full">
      <div className="center w-10/12 gap-4">
        <div className="form-control w-1/2">
          <label className="label">
            <span className="label-text">Does your game use acts?</span>
          </label>
          <div className="join center vertical w-full">
            <input type="checkbox" className="checkbox h-full join-item" value={ui.createGame.maxActs.id}
                   onChange={onCheck}
                   id={ui.createGame.hasActs.id} defaultChecked/>
            <input type="number" defaultValue={1} className="input input-bordered w-full join-item"
                   id={ui.createGame.maxActs.id} min={1} placeholder="Count"/>
          </div>
        </div>
        <div className="form-control w-1/2">
          <label className="label">
            <span className="label-text">Does your game use chapters?</span>
          </label>
          <div className="join center vertical w-full">
            <input type="checkbox" className="checkbox h-full join-item" value={ui.createGame.maxChapters.id}
                   onChange={onCheck}
                   id={ui.createGame.hasChapters.id} defaultChecked/>
            <input type="number" defaultValue={1} className="input input-bordered w-full join-item"
                   id={ui.createGame.maxChapters.id} min={1} placeholder="Count"/>
          </div>
        </div>
      </div>
    </div>
  )
}