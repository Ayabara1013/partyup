import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

export default function Page() {
  if (cookies().get('currentGame')) {
    redirect('/game/current');
  } else {
    redirect('/home');
  }
}