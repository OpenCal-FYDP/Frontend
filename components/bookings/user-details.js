// This is the details on the sidebar that shows up on the bookings page. It will show user name or team name and their
// details there.
import { Fragment, useEffect, useRef, useState } from 'react'

export default function UserDetails(props) {
    // const [user, setUser] = useState({ userName: "", userEmail: "" });
    // useEffect(() => {
    //     setUser({
    //         userName: props.userName,
    //         userEmail: props.userEmail
    //     });
    // }, [props, setUser])
    return (
        <>{
            <div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex">
                        <div>
                            <h4 className="text-lg font-bold">{props.userEmail}</h4>
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    )
}