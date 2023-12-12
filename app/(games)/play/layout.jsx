import { PlayProvider } from "@/app/(games)/play/PlayContext";

export default function Layout({children}) {
  return (
    <PlayProvider>
      {children}
    </PlayProvider>
  )
}