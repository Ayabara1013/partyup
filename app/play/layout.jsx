import { PlayProvider } from "@/app/play/PlayContext";

export default function Layout({children}) {
  return (
    <PlayProvider>
      {children}
    </PlayProvider>
  )
}