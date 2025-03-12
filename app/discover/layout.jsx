import { DaisyFooter } from '@components/footer/footer';

export default function Layout({children}) {
  return (
    <>
      {children}
      <DaisyFooter />
    </>
  )
}