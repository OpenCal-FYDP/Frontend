export default function TeamDetails(props) {
    return (
        <>
            <div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex">
                        <div>
                            <h4 className="text-lg font-bold">{props.teamName}</h4>
                            <p className="mt-1">
                                {props.teamID}
                            </p>
                            <p className="mt-1">
                                {props.teamMembers}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}