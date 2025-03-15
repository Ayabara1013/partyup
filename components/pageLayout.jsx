import Link from "next/link";

export default function PageLayout({children, title, backHref}) {
  console.log(backHref);
  return (
    <div className="h-full w-full center routePage">
      <div className="h-full w-1/2 gap-4 border center flex-col">
        <div className="pageTitle center vertical border">
          <h1 className="text-3xl text-center">{title}</h1>
        </div>
        <div className="pageContent border flex flex-col">
          {children}
        </div>
        <div className="pageBack center vertical border">
          {(backHref) && <Link className="btn w-full" href={backHref}>Back</Link>}
        </div>
      </div>
    </div>
  )
}