import { DaisyFooter } from '@/components/footer/Footer';

export default function Layout({children}) {
  return (
    <>
      {children}
      <DaisyFooter />
    </>
  )
}