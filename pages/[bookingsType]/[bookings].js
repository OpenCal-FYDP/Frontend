import { useSession, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from '../../components/access-denied'
import CalendarWeekView from '../../components/bookings/calendar-week-view'
import UserDetails from '../../components/bookings/user-details'
import NewEvent from '../../components/bookings/new-event'
import { useRouter } from 'next/router'
import TeamDetails from '../../components/bookings/team-details'
import { GetTeam, GetUser } from "../../clients/identity/service.pb.js"
import { GetAvailability } from "../../clients/preference-management/service.pb.js";
import { GetUsersGcalEvents, GetTeamssGcalEvents } from "../../clients/cal-management/service.pb.js";
import Layout from '../../components/layout'
import { client } from "twirpscript";
import urls from "../../clients/client-urls.json"

function Sidebar(props) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { bookingsType, bookings, newEvent } = router.query
    // TODO: Check route here and figure out whether to put Team-details or user-details
    if (newEvent) {
        if(bookingsType === "teamCalendar"){
            return (<NewEvent email={session.user.email} attendees={props.team.teamMembers}></NewEvent>)
        }
        else {
            return (<NewEvent email={bookings} attendees={[session.user.email, props.user]}></NewEvent>)
        }
    }
    if (bookingsType === "user") {
        if (bookings == session.user.email) {
            return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <UserDetails userEmail={session.user ? session.user.email : "Invalid user. Can't get session.user"}></UserDetails>
                </div>
            )
        } else {
            return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <UserDetails userEmail={props.user ? props.user.email : "No such user"}></UserDetails>
                </div>
            )
        }
    } else if (bookingsType === "teamCalendar") {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <TeamDetails
                    teamName={props.team ? props.team.teamName : "Invalid team name " + bookings}
                    teamID={props.team ? props.team.teamID : ""}
                    teamMembers={props.team ? props.team.teamMembers.join(", ") : ""}
                ></TeamDetails>
            </div>
        )
    } else {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p>Invalid bookings type in route: {bookingsType}</p>
            </div>
        )
    }
}

function sortDates(dates) {
    let datesTmp = [];
    dates.forEach(date => {
        datesTmp.push(Number(date));
    })
    datesTmp.sort(function (a, b) {
        //https://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers-correctly
        return a - b;
    });
    let datesTmpStr = [];
    datesTmp.forEach(date => {
        datesTmpStr.push(date.toString());
    })
    return datesTmpStr;
}

export default function Page(props) {

    const { data: session, status } = useSession()
    const router = useRouter()
    const { bookingsType, bookings } = router.query
    const loading = status === 'loading'

    const [user, setUser] = useState(props.user)
    const [email, setEmail] = useState(props.email)
    const [team, setTeam] = useState(props.team)
    const [availabilities, setAvailabilities] = useState(props.availabilities)
    const [calendarEvents, setCalendarEvents] = useState(props.calendarEvents)
    const [userCalEvents, setUserCalEvents] = useState(props.userCalEvents)
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

    /*if (bookingsType == "user") {
        getUserCalendarEvents(bookings);
        getUserAvailability(bookings);
        getUserGcalEvents(bookings);
    } else if (bookingsType == "teamCalendar") {
        getTeamCalendarEvents(bookings);
        getTeamGcalEvents(bookings);
    }*/
    /*useEffect(() => {
        if (bookingsType == "user") {
            //getUserCalendarEvents(bookings);
        } else if (bookingsType == "teamCalendar") {
            //getTeamCalendarEvents(bookings);
        }
        }, [router])*/

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
                            <CalendarWeekView user={session.user} calendarEvents={calendarEvents} availabilities={availabilities} userCalEvents={userCalEvents}></CalendarWeekView>
                        </section>

                        {/* Secondary column (hidden on smaller screens) */}
                        <aside className="hidden lg:block lg:flex-shrink-0 lg:order-first">
                            <div className="h-full relative flex flex-col w-96 border-r border-gray-200 bg-white overflow-y-auto">
                                {/* Your content */}
                                <Sidebar team={team} user={user}></Sidebar>
                            </div>
                        </aside>
                    </main>
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context, props) {

    //call apis to get data for preferences
    //console.log("HERE");
    const bookingsType = context.params.bookingsType;
    let bookings = context.params.bookings;
    const session = await getSession(context);
    if (bookings == "self") {
        bookings = session.user.email;
    }

    async function getUserAvailability(userEmail) {
        client.baseURL = urls.preference_management;
        userEmail = userEmail.replace("%40", "@") // sanitize the converted @ sign
        const avail = await GetAvailability({
            email: userEmail
        });
        const sortedAvail = sortDates(avail.timeAvailability);
        if (sortedAvail.length % 2 === 1) {
            sortedAvail.pop(); //we want 2 availabilities per day, a start time and an end time
        }
        return sortedAvail;
        //console.log(sortedAvail)
    }

    async function getUserGcalEvents(userEmail) {
        client.baseURL = urls.calendar_management;
        let res = await GetUsersGcalEvents({
            username: userEmail,
            email: userEmail
        });
        let events = [];
        res.eventIntervals.map((eventInterval) => {
            events.push(eventInterval.split("-"));
        });
        for (let i = 0; i < events.length; i++) {
            events[i][0] = Number(events[i][0]); //convert to numbers so that DateTime.FromSeconds can be called on them
            events[i][1] = Number(events[i][1]);
        }
        return events;
    }

    async function getTeamGcalEvents(teamID) {
        client.baseURL = urls.calendar_management;
        let res = await GetTeamssGcalEvents({
            teamID: teamID
        })
        let events = [];
        res.eventIntervals.map((eventInterval) => {
            events.push(eventInterval.split("-"));
        });
        for (let i = 0; i < events.length; i++) {
            events[i][0] = Number(events[i][0]); //convert to numbers so that DateTime.FromSeconds can be called on them
            events[i][1] = Number(events[i][1]);
        }
        return events;
    }

    async function getTeamDetails(teamID) {
        client.baseURL = urls.identity;
        return await GetTeam({
            teamID: teamID,
        });
    }

    async function getUserDetails(userEmail) {
        userEmail = userEmail.replace("%40", "@")
        client.baseURL = urls.identity;
        let response = await GetUser({
            email: userEmail,
            username: userEmail
        });
        if (response.oathToken) {
            delete response.oathToken
        }
        return response;
    }

    let userCalEvents = await getUserGcalEvents(session.user.email);
    if (bookingsType == "user"){
        let user = await getUserDetails(bookings);
        let userEvents = await getUserGcalEvents(bookings);
        let userAvailability_0 = await getUserAvailability(bookings);
        let userAvailability_1 =  await getUserAvailability(session.user.email);
        let userAvailability = [userAvailability_0, userAvailability_1];
        return { props: {
            session: session,
            calendarEvents: userEvents,
            user: user,
            availabilities: userAvailability,
            userCalEvents: userCalEvents
            }}
        } else{
        let teamEvents = await getTeamGcalEvents(bookings);
        let team = await getTeamDetails(bookings);
        let userAvailability = [];
        for(let i = 0; i < team.teamMembers.length; i++){
            let memberAvail = await getUserAvailability(team.teamMembers[i]);
            userAvailability.push(memberAvail);
        }
        return { props: {
            session: session,
            calendarEvents: teamEvents,
            team: team,
            availabilities: userAvailability,
            userCalEvents: userCalEvents
        }}
    }
}
