export default function TeamDetails(props) {
    return (
        <>
            <div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex">
                        <div>
                            <h4 className="text-lg font-bold">Team Name</h4>
                            <h4 className="text-lg">{props.teamName}</h4>
                            {/* <p className="mt-1">
                                {props.teamID}
                            </p> */}
                            <br></br>
                            <h4 className="text-lg font-bold">Team Members</h4>
                            <p className="mt-1">
                                ({props.teamMembers})
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}