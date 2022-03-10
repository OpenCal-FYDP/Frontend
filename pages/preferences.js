import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'
/* This example requires Tailwind CSS v2.0+ */
import { useSession, getSession } from 'next-auth/react'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import Select from 'react-select'
import { data } from 'autoprefixer'
import Link from 'next/link'
import { DateTime, Interval, Duration } from 'luxon'
import { client } from "twirpscript";
import { nodeHttpTransport } from "twirpscript/dist/node/index.js";
import {GetUserProfile, SetUserProfile, SetAvailability, GetAvailability} from "../clients/preference-management/service.pb.js";
import {GetTeam, GetUser, UpdateUser} from "../clients/identity/service.pb.js"
//client.rpcTransport = nodeHttpTransport;
//Basically we'd call the api that gives us the availability timestrings and use it to populate the start and end times for a person's working hours
const availabilityDefaults = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
}

const selectTimes = [
    {value: "00:00:00", label: "00:00:00"},
    {value: "00:30:00", label: "00:30:00"},
    {value: "01:00:00", label: "01:00:00"},
    {value: "01:30:00", label: "01:30:00"},
    {value: "02:00:00", label: "02:00:00"},
    {value: "02:30:00", label: "02:30:00"},
    {value: "03:00:00", label: "03:00:00"},
    {value: "03:30:00", label: "03:30:00"},
    {value: "04:00:00", label: "04:00:00"},
    {value: "04:30:00", label: "04:30:00"},
    {value: "05:00:00", label: "05:00:00"},
    {value: "05:30:00", label: "05:30:00"},
    {value: "06:00:00", label: "06:00:00"},
    {value: "06:30:00", label: "06:30:00"},
    {value: "07:00:00", label: "07:00:00"},
    {value: "07:30:00", label: "07:30:00"},
    {value: "08:00:00", label: "08:00:00"},
    {value: "08:30:00", label: "08:30:00"},
    {value: "09:00:00", label: "09:00:00"},
    {value: "09:30:00", label: "09:30:00"},
    {value: "10:00:00", label: "10:00:00"},
    {value: "10:30:00", label: "10:30:00"},
    {value: "11:00:00", label: "11:00:00"},
    {value: "11:30:00", label: "11:30:00"},
    {value: "12:00:00", label: "12:00:00"},
    {value: "12:30:00", label: "12:30:00"},
    {value: "13:00:00", label: "13:00:00"},
    {value: "13:30:00", label: "13:30:00"},
    {value: "14:00:00", label: "14:00:00"},
    {value: "14:30:00", label: "14:30:00"},
    {value: "15:00:00", label: "15:00:00"},
    {value: "15:30:00", label: "15:30:00"},
    {value: "16:00:00", label: "16:00:00"},
    {value: "16:30:00", label: "16:30:00"},
    {value: "17:00:00", label: "17:00:00"},
    {value: "17:30:00", label: "17:30:00"},
    {value: "18:00:00", label: "18:00:00"},
    {value: "18:30:00", label: "18:30:00"},
    {value: "19:00:00", label: "19:00:00"},
    {value: "19:30:00", label: "19:30:00"},
    {value: "20:00:00", label: "20:00:00"},
    {value: "20:30:00", label: "20:30:00"},
    {value: "21:00:00", label: "21:00:00"},
    {value: "21:30:00", label: "21:30:00"},
    {value: "22:00:00", label: "22:00:00"},
    {value: "22:30:00", label: "22:30:00"},
    {value: "23:00:00", label: "23:00:00"},
    {value: "23:30:00", label: "23:30:00"}

]

const notificationSettings = [
    {value: "Off", label: "Off"},
    {value: "Email notifications", label: "Email notifications"}
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Preferences(props) {
    const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true)
    const [autoUpdateApplicantDataEnabled, setAutoUpdateApplicantDataEnabled] = useState(false)
    const [availabilities, setAvailabilities] = useState([])
    const [availToDay, setAvailToDay] = useState(availabilityDefaults)
    const [userFromIdentity, setUserFromIdentity] = useState({email: false})
    const { data: session, status } = useSession()
    const [teams, setTeams] = useState([])
    const email = session? session.user.email: "";
    const [calendars, setCalendars] = useState([{value: email, label: email}])

    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const loading = status === 'loading'
    const now = DateTime.now();
    let dates = [];
    for(let i = 1; i <= 7; i++){
        let dayOfWeek = now.set({weekday: i});
        dates.push(dayOfWeek);
    }
    //console.log(dates);
    function updateAvailability(day,startOrEndTime, value){
        let hours = Number(value.substring(0,2));
        let minutes = Number(value.substring(3,5));
        let seconds = Number(value.substring(6))
        let time = new Date(value);
        let date = DateTime.now();
        let avail = date.set({weekday: day, hour: hours, minute: minutes, second: seconds});
        let availabilityUpdated = availabilities;
        let sameDay = []; //array of start and end date for current date
        if(startOrEndTime === "start"){
            //replace smaller instance of that day with the one from value
            for(let i = 0; i < availabilityUpdated.length; i++){
                let dayInAvail = DateTime.fromSeconds(Number(availabilityUpdated[i]));
                if(dayInAvail.weekday === day){
                    sameDay.push(dayInAvail.toSeconds());
                }
            }
            if(sameDay.length > 1){
                let min = Math.min(...sameDay);
                let index = availabilityUpdated.indexOf(min.toString());
                availabilityUpdated[index] = min.toString();

            } else{
                availabilityUpdated.push(avail.toSeconds().toString());
            }
        } else {
            //replace smaller instance of that day with the one from value
            for(let i = 0; i < availabilityUpdated.length; i++){
                let dayInAvail = DateTime.fromSeconds(Number(availabilityUpdated[i]));
                if(dayInAvail.weekday === day){
                    sameDay.push(dayInAvail.toSeconds());
                }
            }
            if(sameDay.length > 1){
                let max = Math.max(...sameDay);
                let index = availabilityUpdated.indexOf(max.toString());
                availabilityUpdated[index] = max.toString();
            } else{
                availabilityUpdated.push(avail.toSeconds().toString());
            }
        }
        setAvailabilities(availabilityUpdated);
    }

    function updateAvailToDay(avail){
        let availToDayUpdated = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        };
        for(let i = 0; i < avail.length; i++){
            let tmp = DateTime.fromSeconds(Number(avail[i]));
            availToDayUpdated[weekdays[tmp.weekday - 1]].push(avail[i]);
        }
        setAvailToDay(availToDayUpdated);
    }
    
    async function getProfile(){
        client.baseURL = "http://localhost:8080";
        const profile = await GetUserProfile({
            email: "test@test2.com",
        });
        
        //console.log(profile);
    }

    async function sendUpdatedAvailToServer(email){
        //console.log(availabilities);
        client.baseURL = "http://localhost:8080";
        let sortedAvail = availabilities.sort();
        await SetAvailability({
            email: email,
            timeAvailability: sortedAvail
        })
    }
    async function getAvailabilities(email){
        client.baseURL = "http://localhost:8080";
        const avail = await GetAvailability({
            email: email
        });
        const sortedAvail = avail.timeAvailability.sort();
        updateAvailToDay(sortedAvail);
        setAvailabilities(sortedAvail);
    }
    
    async function initialAPICalls(email){
        //Preferences Management
        //TODO:
        //this part was to auto populate the meeting availability section with existing data, but it's kind of a pain to show it in the UI so I'm leaving that as a TODO
        client.baseURL = "http://localhost:8080";
        const avail = await GetAvailability({
            email: email
        });
        const sortedAvail = avail.timeAvailability.sort();
        updateAvailToDay(sortedAvail);
        setAvailabilities(sortedAvail);

        //Identity Service 
        client.baseURL = "http://localhost:8081";
        const user = await GetUser({
            email: email,
            username: email
        });
        setUserFromIdentity(user);
        if(user){
            const team = await GetTeam({teamID: user.teamID}, () => {console.log("got team")}, () => {console.log("couldn't get team")});
            if(team){
                setTeams([{teamName: team.teamName, teamID: user.teamID}]);
            }
        }
    }
    useEffect(() => {
        initialAPICalls(email);
    }, []);
    // When rendering client side don't display anything until loading is complete
    if (typeof window !== 'undefined' && loading) return null

    // If no session exists, display access denied message
    if (!session) { return <Layout><AccessDenied /></Layout> }

    // If session exists, display content
    return (
        <Layout>
            <div>
                {/* Content area */}
                <div>
                    <div className="max-w-4xl mx-auto flex flex-col md:px-8 xl:px-0">
                        <main className="flex-1">
                            <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
                                <div className="pt-10 pb-16">
                                    <div className="px-4 sm:px-6 md:px-0">
                                        <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
                                    </div>
                                    <div className="px-4 sm:px-6 md:px-0">
                                        <div className="py-6">    
                                            <div className="mt-10 divide-y divide-gray-200">
                                                <div className="space-y-2">
                                                    <h2 className="text-xl leading-6 font-bold text-gray-900">Meeting Availability</h2>
                                                    <p className="max-w-2xl text-sm text-gray-500">
                                                        Define ranges of when you are available on a recurring basis.
                                                    </p>
                                                </div>
                                                <div className="mt-6">
                                                    <dl className="divide-y divide-gray-200">
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Monday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(1,"start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(1,"end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Tuesday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(2,"start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(2,"end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Wednesday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(3,"start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(3,"end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Thursday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(4,"start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(4,"end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Friday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(5,"start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes}  onChange={e => updateAvailability(5,"end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Saturday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(6,"start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(6,"end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Sunday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability(7,"start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes}  onChange={e => updateAvailability(7,"end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500"></dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                onClick={e => sendUpdatedAvailToServer(email)}
                                                            >
                                                                Update Availability
                                                            </button>
                                                            </dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                            </div>

                                            <div className="mt-10 divide-y divide-gray-200">
                                                <div className="space-y-2">
                                                <h2 className="text-xl leading-6 font-bold text-gray-900">Notification Settings</h2>
                                                    <p className="max-w-2xl text-sm text-gray-500">
                                                        Manage how you are notified before your events.
                                                    </p>
                                                </div>
                                                <div className="mt-6">
                                                    <dl className="divide-y divide-gray-200">
                                                        <span className="ml-3"><Select options={notificationSettings}/></span>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500"></dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            >
                                                                Update Notification Settings
                                                            </button>
                                                            </dd>
                                                        </div>
                                                        
                                                    </dl>
                                                </div>
                                            </div>

                                            <div className="mt-10 divide-y divide-gray-200">
                                                <div className="space-y-2">
                                                <h2 className="text-xl leading-6 font-bold text-gray-900">Calendars</h2>
                                                    <p className="max-w-2xl text-sm text-gray-500">
                                                        Configure how OpenCal integrates with your calendars.
                                                    </p>
                                                </div>
                                                <div className="mt-6">
                                                    <dl className="divide-y divide-gray-200">
                                                        <span className="ml-3"><Select options={calendars}/></span>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500"></dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            >
                                                                Update Calendar Settings
                                                            </button>
                                                            </dd>
                                                        </div>
                                                        
                                                    </dl>
                                                </div>
                                            </div>

                                            <div className="mt-10 divide-y divide-gray-200">
                                                <div className="space-y-2">
                                                <h2 className="text-xl leading-6 font-bold text-gray-900">Teams</h2>
                                                    <p className="max-w-2xl text-sm text-gray-500">
                                                        Manage your teams.
                                                    </p>
                                                </div>
                                                <div className="mt-6">
                                                    <dl className="divide-y divide-gray-200">
                                                        {teams.map((team) => {
                                                            let teamPath = "/team/" + team.teamID; //this should be teamID, will update once I have the GetTeam API built
                                                            return (
                                                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                    <dt className="text-sm font-medium text-gray-500"><Link href="team/[teamID]" as={teamPath}><a>{team.teamName}</a></Link></dt>
                                                                    <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                    </dd>
                                                                </div>
                                                            );
                                                        })}
                                                        
                                                        {teams.length === 0? <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500"></dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <Link href="team/create">
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                    >
                                                                        Create a team
                                                                    </button>
                                                                </Link>
                                                            </dd>
                                                        </div>: <div></div>}
                                                        
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context){
    //call apis to get data for preferences
    const session = await getSession(context);
    /*console.log(session);
    //console.log(session.data);
    client.baseURL = "http://localhost:8081";
    const user = await GetUser({
        email: session.user.email
    })*/
    //console.log(user)
    return {
        props: {
          session: session
          //email: user
        }
    }
}