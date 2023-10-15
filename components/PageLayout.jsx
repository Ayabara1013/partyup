import { useRouter } from "next/navigation";

export default function PageLayout({ children, title, backHref }) {
  const { push } = useRouter();

  function backOnClick() {
    push(backHref)
  }

  return (
    <div className="h-full w-full center routePage hidden">
      <div className="h-full w-1/2 gap-4 border center flex-col">
        <div className="pageTitle center vertical border">
          <h1 className="text-3xl text-center">{ title }</h1>
        </div>
        <div className="pageContent border flex flex-col">
          { children }
        </div>
        <div className="pageBack center vertical border">
          { (backHref) && <button className="btn w-full" onClick={ backOnClick }>Back</button> }
        </div>
      </div>
    </div>
  )
}