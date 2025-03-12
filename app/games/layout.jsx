import {DaisyFooter} from '@components/footer/footer';
import {GameManagerProvider} from "@app/(contexts)/gameManager";

export default function Layout({children}) {
  return (
    <>
      <GameManagerProvider>
        {children}
      </GameManagerProvider>
      <DaisyFooter/>
    </>
  )
}