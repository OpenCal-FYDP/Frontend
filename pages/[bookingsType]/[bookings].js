import { useSession } from 'next-auth/react'
import AccessDenied from '../../components/access-denied'
import CalendarWeekView from '../../components/bookings/calendar-week-view'
import UserDetails from '../../components/bookings/user-details'
import NewEvent from '../../components/bookings/new-event'
import { useRouter } from 'next/router'
import TeamDetails from '../../components/bookings/team-details'
import { GetTeam, GetUser } from "../../clients/identity/service.pb.js"
import Layout from '../../components/layout'
import { client } from "twirpscript";
import urls from "../../clients/client-urls.json"
import { useEffect, useState } from 'react'

function Sidebar() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { bookingsType, bookings, newEvent } = router.query
    // TODO: Check route here and figure out whether to put Team-details or user-details
    if (newEvent) {
        return (<NewEvent email={bookings} ></NewEvent>)
    }
    if (bookingsType == "user") {
        if (bookings == session.user.email) {
            return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <UserDetails username={session.user.name} email={session.user.email}></UserDetails>
                </div>
            )
        } else {
            return GetUserDetails(bookings)
        }
    } else if (bookingsType == "teamCalendar") {
        return (
            GetTeamDetails(bookings)
        )
    } else {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p>Invalid bookings type in route: {bookingsType}</p>
            </div>
        )
    }
}

function GetUserDetails(userEmail) {
    if (!userEmail || userEmail == "self") {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <UserDetails email={"Loading..."} username={""}></UserDetails>
            </div>
        )
    }
    userEmail = userEmail.replace("%40", "@") // sanitize the converted @ sign
    client.baseURL = urls.identity;

    const [user, setUser] = useState(null)
    const [isLoading, setLoading] = useState(false)
    useEffect(async () => {
        setLoading(true)
        await GetUser({
            email: userEmail,
            username: userEmail,
        }).then((res) => {
            // use the result here
            setLoading(false)
            setUser(res)
            console.log("RESULT: " + res)
        })
    }, [userEmail])

    if (!user) return <p>No data for user "{userEmail}"</p>


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UserDetails email={user ? user.email : "No such user " + userEmail} username={user ? user.username : ""}></UserDetails>
        </div>
    )
}

// TODO: Do GetTeam API call!
function GetTeamDetails(teamID) {
    if (!teamID) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <TeamDetails teamname={"Invalid teamID"}></TeamDetails>
            </div>
        )
    }
    client.baseURL = urls.identity;

    const [team, setTeam] = useState(null)
    const [isLoading, setLoading] = useState(false)
    useEffect(async () => {
        setLoading(true)
        await GetTeam({
            teamID: teamID,
        }).then((res) => {
            // use the result here
            setLoading(false)
            setTeam(res)
            console.log("RESULT: " + res)
        })
    }, [teamID])

    if (!team) return <p>No team data for "{teamID}"</p>


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TeamDetails
                teamName={team ? team.teamName : "No such team " + teamID}
                teamID={team ? team.teamID : ""}
                teamMembers={team ? "Team Members: (" + team.teamMembers.join(", ") + ")" : ""}
            ></TeamDetails>
        </div>
    )
}

// TODO: list of things to merge with Mark's calendar:
// 1. Props.
// 2. New functions.
// 3. New Event button needs to direct correctly. This includes 4. routing.
// 4. Routing for new event button

export default function Page() {

    const { data: session, status } = useSession()
    const router = useRouter()
    const { bookingsType, bookings } = router.query
    const loading = status === 'loading'

    // When rendering client side don't display anything until loading is complete
    if (typeof window !== 'undefined' && loading) return null

    // If no session exists, display access denied message
    if (!session) { return <Layout><AccessDenied /></Layout> }

    // Routing:
    // If we get here from /bookings/self:
    if (bookings == "self") {
        router.push({
            pathname: '/[bookingsType]/[bookings]',
            query: { bookingsType: bookingsType, bookings: session.user.email },
        })
    }

    // If session exists, display content
    return (
        <Layout>
            <div className="h-fill flex bg-gray-50 overflow-hidden">
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    <main className="flex-1 flex overflow-hidden">
                        {/* Primary column */}
                        <section
                            aria-labelledby="primary-heading"
                            className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
                        >
                            <h1 id="primary-heading" className="sr-only">
                                Calendar view
                            </h1>

                            {/* Your content */}
                            {/* Insert calendar here! */}
                            <CalendarWeekView></CalendarWeekView>
                        </section>

                        {/* Secondary column (hidden on smaller screens) */}
                        <aside className="hidden lg:block lg:flex-shrink-0 lg:order-first">
                            <div className="h-full relative flex flex-col w-96 border-r border-gray-200 bg-white overflow-y-auto">
                                {/* Your content */}
                                <Sidebar></Sidebar>
                            </div>
                        </aside>
                    </main>
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(props) {
    //call apis to get data for preferences
    let data = "";
    return { props: { data } }
}
