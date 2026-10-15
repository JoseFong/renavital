import UserNavBar from "@/components/users/UserNavBar"

function page() {
  return (
    <>
        <UserNavBar selected="usuarios"/>
        <div className="flex flex-col gap-1 p-5">
            <h1 className="font-bold text-lg">Usuarios</h1>
        </div>
    </>
  )
}

export default page