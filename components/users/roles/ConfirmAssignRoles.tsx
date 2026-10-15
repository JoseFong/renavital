"use client"

import Modal from "@/components/public/Modal"
import { UserInfo, UserRoleInfo } from "@/lib/types"
import { Fragment } from "react/jsx-runtime"

function ConfirmAssignRoles({open,setOpen,usersWithNoRole,selectedUsers,role}:{open:any,setOpen:any,usersWithNoRole:UserInfo[],selectedUsers:number[],role:UserRoleInfo}) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <div className="flex flex-col gap-1">
            <h1 className="font-bold">¿Está seguro que quiere actualizar los usuarios de este rol?</h1>
            {usersWithNoRole.length>0 &&
                <Fragment>
                    <p className="font-bold">¡Los siguientes usuarios se quedarán sin rol y no podrán acceder hasta que se les asigne otro!</p>
                    {usersWithNoRole.map((u)=>(
                        <p key={u.id}>{u.username}{" "}({u.email})</p>
                    ))}
                </Fragment>
            }
        </div>
    </Modal>
  )
}

export default ConfirmAssignRoles