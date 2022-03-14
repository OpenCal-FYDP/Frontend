// This is the details on the sidebar that shows up on the bookings page. It will show user name or team name and their
// details there.
import { Fragment, useEffect, useRef, useState } from 'react'

export default function UserDetails(props) {
    const [team, setTeam] = useState({teamName: ""});
    const[user, setUser] = useState({image: "", name:"", email:""});
    useEffect(() => {
        setUser(props.user);
        setTeam(props.team);
    },[props, setUser, setTeam])
    return (
        <>{team? 
        <div>
            <div className="px-4 py-5 sm:p-6">
                <div className="flex">
                    <div>
                        <h4 className="text-lg font-bold">{team.teamName}</h4>
                    </div>
                </div>
            </div>
        </div>: 
        <div>
            <div className="px-4 py-5 sm:p-6">
                <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                        {user? 
                        <img
                            className="h-16 w-16 border border-gray-300 bg-white text-gray-300"
                            preserveAspectRatio="none"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 200 200"
                            aria-hidden="true"
                            src={user.image}
                        >
                        </img>
                        :
                        <div></div>
                        }
                        
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">{user.name}</h4>
                        <p className="mt-1">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        }
            

        </>
    )
}