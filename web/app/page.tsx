import { redirect } from "next/navigation"

// const getUserDetails = async () => {
//   const session = await getServerSession(authOptions);
//   return session;
// };


export default async function Home() {


  if (false) {
    redirect('/home')
  }

  return redirect('/signin')
}
