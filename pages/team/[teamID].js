import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { useSession, getSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AccessDenied from '../../components/access-denied'
import { uuid } from 'uuidv4';
import { client } from "twirpscript";
import {GetTeam, GetUser, UpdateUser, UpdateTeam} from "../../clients/identity/service.pb.js"
export default function team(){
    const router = useRouter();
    const teamData = { teamID: router.query.teamID, teamName: "", teamMembers: [] }; //need to set this up to be populated from GetTeam API
    const { data: session, status } = useSession();
    const email = session? session.user.email: "";
    const [teamMembers, setTeamMembers] = useState([email]); //let this be an empty array for now,
    const [teamMemberToAdd, setTeamMemberToAdd] = useState("");
    const [teamName, setTeamName] = useState(""); //let this be an empty array for now,
    const [teamID, setTeamID] = useState(router.query.teamID);
    const loading = status === 'loading'
    // When rendering client side don't display anything until loading is complete

    async function addMemberToTeamOnServer(member, id){
        client.baseURL = "http://localhost:8081";
        await UpdateUser({
            username: member,
            email: member,
            teamID: id
        }).then(() => {}, () => {console.log("can't add " + member + " to team")})
    }
    async function createTeam(){
        client.baseURL = "http://localhost:8081";
        let creatingTeamID = await uuid();
        await UpdateTeam({
            teamID: creatingTeamID,
            teamName: teamName,
            teamMembers: teamMembers
        }).then(() => {
            teamMembers.map((member) => addMemberToTeamOnServer(member, creatingTeamID))
        })
        return creatingTeamID;
    }

    async function editUserTeamStatus(member, id){
        //if id is "" I think that will remove the user from the team
        client.baseURL = "http://localhost:8081";
        await UpdateUser({
            username: member,
            email: member,
            teamID: id
        }).then(() => {}, () => {console.log("can't update " + member + "'s team status")})
    }

    async function editTeam(teamName, id){
        client.baseURL = "http://localhost:8081";
        let teamInfo = await GetTeam({
            teamID: id
        }).then(async (res) => {
            let membersToRemove = res.teamMembers.filter(item => !teamMembers.includes(item));
            await UpdateTeam({
                teamID: id,
                teamName: teamName,
                teamMembers: teamMembers
            }).then(() => {
                membersToRemove.map((member) => editUserTeamStatus(member, ""));
            })
        })
        
    }

    async function leaveTeam(teamName, id, member){
        client.baseURL = "http://localhost:8081";
        let teamInfo = await GetTeam({
            teamID: id
        }).then(async (res) => {
            await UpdateTeam({
                teamID: id,
                teamName: teamName,
                teamMembers: teamMembers
            }).then(() => {
                editUserTeamStatus(member, "");
            })
        })
        
    }

    useEffect(() => {
        client.baseURL = "http://localhost:8081";
        if(router.query.teamID !== "create"){
            GetTeam({
                teamID: router.query.teamID
            }).then((res) => {
                setTeamName(res.teamName);
                setTeamMembers(res.teamMembers);
            })
        }
    }, [session])
    if (typeof window !== 'undefined' && loading) return null

    // If no session exists, display access denied message
    if (!session) { return <Layout><AccessDenied /></Layout> }

    // If session exists, display content
    return (
        <Layout>
            {teamData.teamID === "create"?
                <div>
                {/* Content area */}
                <div>
                    <div className="max-w-4xl mx-auto flex flex-col md:px-8 xl:px-0">

                        <main className="flex-1">
                            <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
                                <div className="pt-10 pb-16">
                                    <div className="px-4 sm:px-6 md:px-0">
                                        <h1 className="text-3xl font-extrabold text-gray-900">Create a Team</h1>
                                    </div>
                                    <div className="px-4 sm:px-6 md:px-0">
                                        <div className="py-6">
                                            {/* Description list with inline editing */}
                                            
                                            <div className="mt-10">
                                                <div className="space-y-2">
                                                    <h2 className="text-xl leading-6 font-bold text-gray-900">Meeting Availability</h2>
                                                    <p className="max-w-2xl text-sm text-gray-500">
                                                        Teams allow you to organize events for your organization.
                                                    </p>
                                                </div>
                                                <div className="mt-6">
                                                    <div className="pb-6">
                                                        <label htmlFor="team-name" className="block text-sm font-medium text-gray-700">
                                                        Team Name
                                                        </label>
                                                        <div className="mt-1">
                                                        <input
                                                            name="team-name"
                                                            id="team-name"
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            placeholder="Your Team Name"
                                                            onChange={e => setTeamName(e.target.value)}
                                                        />
                                                        </div>
                                                    </div>
                                                    <dl className="divide-y divide-gray-200 pb-6">
                                                        {teamMembers.map((member, index) => {
                                                            return (
                                                            <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                <dt className="text-sm font-medium text-gray-500">
                                                                    {member}
                                                                </dt>
                                                                <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                    {member === email? 
                                                                        <Link href={"../preferences"}>
                                                                            <button
                                                                                type="button"
                                                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                                onClick={e => {
                                                                                    let tmp = teamMembers;
                                                                                    tmp.splice(index, 1);
                                                                                    setTeamMembers([...tmp]);
                                                                                }}
                                                                            >
                                                                            Leave Team
                                                                            </button>
                                                                        </Link>
                                                                    :
                                                                        <button
                                                                            type="button"
                                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                            onClick={e => {
                                                                                let tmp = teamMembers;
                                                                                tmp.splice(index, 1);
                                                                                setTeamMembers([...tmp]);
                                                                            }}
                                                                        >
                                                                        Remove Member
                                                                        </button>
                                                                    }
                                                                </dd>
                                                            </div> );
                                                        })
                                                        }
                                                        <label htmlFor="add-member" className="block text-sm font-medium text-gray-700 py-2">
                                                        Add a Team Member
                                                        </label>
                                                        <div className="mt-1 py-2">
                                                        <input
                                                            type="email"
                                                            name="add-member"
                                                            id="team-name"
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            placeholder="yourteammember@gmail.com"
                                                            onChange={e => setTeamMemberToAdd(e.target.value)}
                                                        />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            onClick={e => {
                                                                let tmp = teamMembers;
                                                                tmp.push(teamMemberToAdd);
                                                                setTeamMembers([...tmp]);
                                                            }}
                                                        >
                                                        Add Team Member
                                                    </button>
                                                    </dl>
                                                    {/*onClick should do an API call to create the team and then update the teamPath with the teamID obtained via the API call*/}
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        onClick={teamName === ""? () => {} : () => createTeam().then((res) => router.push("/team/" + res))}
                                                    >
                                                        Create Team
                                                    </button>
                                                    
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
            :<div>
            {/* Content area */}
            <div>
                <div className="max-w-4xl mx-auto flex flex-col md:px-8 xl:px-0">

                    <main className="flex-1">
                        <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
                            <div className="pt-10 pb-16">
                                <div className="px-4 sm:px-6 md:px-0">
                                    <h1 className="text-3xl font-extrabold text-gray-900">Edit/Leave Team</h1>
                                </div>
                                <div className="px-4 sm:px-6 md:px-0">
                                    <div className="py-6">
                                        {/* Description list with inline editing */}
                                        
                                        <div className="mt-10">
                                            <div className="space-y-2">
                                                <h2 className="text-xl leading-6 font-bold text-gray-900">Meeting Availability</h2>
                                                <p className="max-w-2xl text-sm text-gray-500">
                                                    Teams allow you to organize events for your organization.
                                                </p>
                                            </div>
                                            <div className="mt-6">
                                                <div className="pb-6">
                                                    <label htmlFor="team-name" className="block text-sm font-medium text-gray-700">
                                                    Team Name
                                                    </label>
                                                    <div className="mt-1">
                                                    <input
                                                        name="team-name"
                                                        id="team-name"
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="Your Team Name"
                                                        value={teamName}
                                                        readOnly
                                                        onChange={e => setTeamName(e.target.value)}
                                                    />
                                                    </div>
                                                </div>
                                                <dl className="divide-y divide-gray-200 pb-6">
                                                    {teamMembers.map((member, index) => {
                                                        return (
                                                        <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">
                                                                {member}
                                                            </dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                {member === email?
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                        onClick={async (e) => {
                                                                            let tmp = teamMembers;
                                                                            tmp.splice(index, 1);
                                                                            console.log(tmp);
                                                                            setTeamMembers([...tmp]);
                                                                            leaveTeam(teamName, teamID, member);
                                                                            router.push("../preferences");
                                                                        }}
                                                                    >
                                                                    Leave Team
                                                                    </button>
                                                                :
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                    onClick={e => {
                                                                        let tmp = teamMembers;
                                                                        tmp.splice(index, 1);
                                                                        setTeamMembers([...tmp]);
                                                                    }}
                                                                >
                                                                Remove Member
                                                                </button>
                                                                }
                                                                    
                                                            </dd>
                                                        </div> );
                                                    })
                                                    }
                                                    <label htmlFor="add-member" className="block text-sm font-medium text-gray-700 py-2">
                                                    Add a Team Member
                                                    </label>
                                                    <div className="mt-1 py-2">
                                                    <input
                                                        type="email"
                                                        name="add-member"
                                                        id="team-name"
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="yourteammember@gmail.com"
                                                        onChange={e => setTeamMemberToAdd(e.target.value)}
                                                    />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        onClick={e => {
                                                            let tmp = teamMembers;
                                                            tmp.push(teamMemberToAdd);
                                                            setTeamMembers([...tmp]);
                                                        }}
                                                    >
                                                    Add Team Member
                                                </button>
                                                </dl>
                                                <span>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        onClick={e => {teamName === ""? () => {} : editTeam(teamName, teamID)}}
                                                    >
                                                        Edit Team
                                                    </button>
                                                    {/*<Link href={"../preferences"}>
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            onClick={e => {teamName === ""? {} : console.log("team/" + teamName)}}
                                                        >
                                                            Delete Team
                                                        </button>
                                                    </Link>*/}
                                                </span>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>}
            
        </Layout>
    )
}

export async function getServerSideProps(context){
    //call apis to get data for preferences
    return {
        props: {
          session: await getSession(context),
        },
    }
}