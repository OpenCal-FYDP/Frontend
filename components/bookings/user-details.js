// This is the details on the sidebar that shows up on the bookings page. It will show user name or team name and their
// details there.

export default function UserDetails(props) {
    return (
        <>
            <div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex">
                        <div>
                            <h4 className="text-lg font-bold">{props.username}</h4>
                            <p className="mt-1">
                                {props.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}