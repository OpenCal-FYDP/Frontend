export default function TeamDetails(props) {
    return (
        <>
            <div className="mt-5 bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex">
                        <div className="mr-4 flex-shrink-0">
                            <img
                                className="h-16 w-16 border border-gray-300 bg-white text-gray-300"
                                preserveAspectRatio="none"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 200 200"
                                aria-hidden="true"
                                src={props.team.image}
                            >
                            </img>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold">{props.team.name}</h4>
                            <p className="mt-1">
                                {props.team.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}