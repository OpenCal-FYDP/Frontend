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
import urls from "../clients/client-urls.json"
//client.rpcTransport = nodeHttpTransport;
//Basically we'd call the api that gives us the availability timestrings and use it to populate the start and end times for a person's working hours

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Preferences(props) {

    const [teamMembers, setTeamMembers] = useState(props.team.teamMembers)
    const [teams, setTeams] = useState([{teamName: props.team.teamName, teamID: props.teamID}])
    
    const { data: session, status } = useSession()
    const email = session? session.user.email: "";
    const loading = status === 'loading'
    
    /*async function initialAPICalls(email){
        client.baseURL = urls.identity;
        await GetUser({
            email: email,
            username: email
        }).then(async (res) => {
            if(res){
                const team = await GetTeam({teamID: res.teamID}, () => {console.log("got team")}, () => {console.log("couldn't get team")});
                if(team){
                    setTeams([{teamName: team.teamName, teamID: res.teamID}]);
                    setTeamMembers(team.teamMembers);
                }
            }
        }, () => {
            console.log("error in GetUser")
        });
    }*/
    /*useEffect(() => {
        initialAPICalls(email);
    }, [session, setTeams, setTeamMembers]);*/
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
                                        <h1 className="text-3xl font-extrabold text-gray-900">Dashboards</h1>
                                    </div>
                                    <div className="px-4 sm:px-6 md:px-0">
                                        <div className="py-6">    
                                            <div className="mt-10 divide-y divide-gray-200">
                                                <div className="mt-6">
                                                    <h2 className="text-xl leading-6 font-bold text-gray-900">Your Calendar</h2>
                                                    <dl className="divide-y divide-gray-200">
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <Link href="/user/self">
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                >
                                                                    Your dashboard
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </dl>
                                                </div>
                                                <div className="mt-6">
                                                    <h2 className="text-xl leading-6 font-bold text-gray-900">Team Members Calendars</h2>
                                                    <dl className="divide-y divide-gray-200">
                                                        {teamMembers.map((member) => {
                                                            if(member !== email){
                                                                let path = "/user/"+ member
                                                                return (
                                                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                        <Link href={path}>
                                                                            <button
                                                                                type="button"
                                                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                            >
                                                                                {member}s dashboard
                                                                            </button>
                                                                        </Link>
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </dl>
                                                </div>
                                                <div className="mt-6">
                                                    <h2 className="text-xl leading-6 font-bold text-gray-900">Team Calendar</h2>
                                                    <dl className="divide-y divide-gray-200">
                                                        {teams.map((team) => {
                                                            let path = "/teamCalendar/"+ team.teamID
                                                            return (
                                                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                    <Link href={path}>
                                                                        <button
                                                                            type="button"
                                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                        >
                                                                            {team.teamName} dashboard
                                                                        </button>
                                                                    </Link>
                                                                </div>
                                                            );
                                                        })}
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
    const session = await getSession(context);
    client.baseURL = urls.identity;
    let teamID;
    let team;
    await GetUser({
        email: session.user.email,
        username: session.user.email
    }).then(async (res) => {
        if(res){
            teamID = res.teamID;
            team = await GetTeam({teamID: res.teamID}, () => {console.log("got team")}, () => {console.log("couldn't get team")});

        }
    }, () => {
        console.log("error in GetUser")
    });
    return {
        props: {
          session: session,
          teamID: teamID,
          team: team
        }
    }
}