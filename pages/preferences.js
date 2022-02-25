import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'
/* This example requires Tailwind CSS v2.0+ */
import { useSession } from 'next-auth/react'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import Select from 'react-select'
import { data } from 'autoprefixer'

const tabs = [
    { name: 'General', href: '#', current: true },
    { name: 'Password', href: '#', current: false },
    { name: 'Notifications', href: '#', current: false },
    { name: 'Plan', href: '#', current: false },
    { name: 'Billing', href: '#', current: false },
    { name: 'Team Members', href: '#', current: false },
]

//Basically we'd call the api that gives us the availability timestrings and use it to populate the start and end times for a person's working hours
const availabilityDefaults = {
    monday: {start: "", end: ""},
    tuesday: {start: "", end: ""},
    wednesday: {start: "", end: ""},
    thursday: {start: "", end: ""},
    friday: {start: "", end: ""},
    saturday: {start: "", end: ""},
    sunday: {start: "", end: ""}
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
    {value: "None", label: "None"},
    {value: "At time of event", label: "At time of event"},
    {value: "5 minutes before", label: "5 minutes before"},
    {value: "10 minutes before", label: "10 minutes before"},
    {value: "15 minutes before", label: "15 minutes before"},
    {value: "30 minutes before", label: "30 minutes before"},
    {value: "1 hour before", label: "1 hour before"}
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Preferences() {
    const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true)
    const [autoUpdateApplicantDataEnabled, setAutoUpdateApplicantDataEnabled] = useState(false)
    const [availabilities, setAvailabilities] = useState(availabilityDefaults)
    const { data: session, status } = useSession()
    const [teams, setTeams] = useState(["TestTeam"])

    const email = session? session.user.email: "";
    const [calendars, setCalendars] = useState([{value: email, label: email}]);
    const loading = status === 'loading'

    function updateAvailability(day, startOrEndTime, value){
        let availabilityUpdated = availabilities;
        availabilityUpdated[day][startOrEndTime] = value;
        setAvailabilities(availabilityUpdated);
        console.log(availabilities);
    }
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
                        {/*<div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 flex">
                            <div className="flex-1 flex justify-between px-4 md:px-0">
                                <div className="flex-1 flex">
                                    <form className="w-full flex md:ml-0" action="#" method="GET">
                                        <label htmlFor="mobile-search-field" className="sr-only">
                                            Search
                                        </label>
                                        <label htmlFor="desktop-search-field" className="sr-only">
                                            Search
                                        </label>
                                        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                                <SearchIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <input
                                                name="mobile-search-field"
                                                id="mobile-search-field"
                                                className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:hidden"
                                                placeholder="Search"
                                                type="search"
                                            />
                                            <input
                                                name="desktop-search-field"
                                                id="desktop-search-field"
                                                className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
                                                placeholder="Search jobs, applicants, and more"
                                                type="search"
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="ml-4 flex items-center md:ml-6">
                                    <button
                                        type="button"
                                        className="bg-white rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        <span className="sr-only">View notifications</span>
                                    </button>
                                </div>
                            </div>
                        </div> */}

                        <main className="flex-1">
                            <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
                                <div className="pt-10 pb-16">
                                    <div className="px-4 sm:px-6 md:px-0">
                                        <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
                                    </div>
                                    <div className="px-4 sm:px-6 md:px-0">
                                        <div className="py-6">
                                            {/* Tabs */}
                                            {/*<div className="lg:hidden">
                                                <label htmlFor="selected-tab" className="sr-only">
                                                    Select a tab
                                                </label>
                                                <select
                                                    id="selected-tab"
                                                    name="selected-tab"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                                                    defaultValue={tabs.find((tab) => tab.current).name}
                                                >
                                                    {tabs.map((tab) => (
                                                        <option key={tab.name}>{tab.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="hidden lg:block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="-mb-px flex space-x-8">
                                                        {tabs.map((tab) => (
                                                            <a
                                                                key={tab.name}
                                                                href={tab.href}
                                                                className={classNames(
                                                                    tab.current
                                                                        ? 'border-purple-500 text-purple-600'
                                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                                                )}
                                                            >
                                                                {tab.name}
                                                            </a>
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>*/}

                                            {/* Description list with inline editing */}
                                            
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
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("monday", "start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("monday", "end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Tuesday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("tuesday", "start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("tuesday", "end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Wednesday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("wednesday", "start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("wednesday", "end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Thursday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("thursday", "start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("thursday", "end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Friday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("friday", "start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes}  onChange={e => updateAvailability("friday", "end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Saturday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("saturday", "start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("saturday", "end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500">Sunday</dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <span className="ml-3"><Select options={selectTimes} onChange={e => updateAvailability("sunday", "start", e.value)}/></span>
                                                                <span className="ml-3"> - </span>
                                                                <span className="ml-3"><Select options={selectTimes}  onChange={e => updateAvailability("sunday", "end", e.value)}/></span>
                                                            </dd>
                                                        </div>
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500"></dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                                        Manage when you are notified before your events.
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
                                                            let teamPath = "/team/" + team;
                                                            return (
                                                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                    <dt className="text-sm font-medium text-gray-500"><a href={teamPath}>{team}</a></dt>
                                                                    <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                    </dd>
                                                                </div>
                                                            );
                                                        })}
                                                        
                                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                            <dt className="text-sm font-medium text-gray-500"></dt>
                                                            <dd className="mt-1 flex flex-wrap items-center text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                >
                                                                    Create a team
                                                                </button>
                                                            </dd>
                                                        </div>
                                                        
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