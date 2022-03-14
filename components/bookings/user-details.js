// This is the details on the sidebar that shows up on the bookings page. It will show user name or team name and their
// details there.

export default function UserDetails(props) {
    return (
        <>{props.team? 
        <div>
            <div className="px-4 py-5 sm:p-6">
                <div className="flex">
                    <div>
                        <h4 className="text-lg font-bold">{props.team.teamName}</h4>
                    </div>
                </div>
            </div>
        </div>: 
        <div>
            <div className="px-4 py-5 sm:p-6">
                <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                        {props.user? 
                        <img
                            className="h-16 w-16 border border-gray-300 bg-white text-gray-300"
                            preserveAspectRatio="none"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 200 200"
                            aria-hidden="true"
                            src={props.user.image}
                        >
                        </img>
                        :
                        <div></div>
                        }
                        
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">{props.user.name}</h4>
                        <p className="mt-1">
                            {props.user.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        }
            

        </>
    )
}