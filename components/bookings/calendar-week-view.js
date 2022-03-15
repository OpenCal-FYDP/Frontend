/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon } from '@heroicons/react/solid'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { DateTime, Interval, Duration } from 'luxon'
import { useRouter } from 'next/router'
import AccessDenied from '../access-denied'
import { client } from "twirpscript";
import {GetTeam, GetUser} from "../../clients/identity/service.pb.js"
import {GetUserProfile, SetUserProfile, SetAvailability, GetAvailability} from "../../clients/preference-management/service.pb.js";
import {GetUsersGcalEvents, GetTeamssGcalEvents} from "../../clients/cal-management/service.pb.js";
import urls from "../../clients/client-urls.json";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CalendarWeekView(props) {

//console.log(props.calendarEvents);
function sortDates(dates){
  let datesTmp = [];
  dates.forEach(date => {
      datesTmp.push(Number(date));
  })
  datesTmp.sort(function(a,b) {
      //https://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers-correctly
      return a - b;
  });
  let datesTmpStr = [];
  datesTmp.forEach(date => {
      datesTmpStr.push(date.toString());
  })
  return datesTmpStr;
}

async function getUserGcalEvents(userEmail){
  client.baseURL = urls.calendar_management;
  GetUsersGcalEvents({
    username: userEmail,
    email: userEmail
  }).then((res) => {
    let events = [];
    res.eventIntervals.map((eventInterval) => {
      events.push(eventInterval.split("-"));
    });
    for(let i = 0; i < events.length; i++){
      events[i][0] = DateTime.fromSeconds(Number(events[i][0])); //convert to numbers so that DateTime.FromSeconds can be called on them
      events[i][1] = DateTime.fromSeconds(Number(events[i][1]));
    }
    //console.log(events);
    setCalendarEvents(events);
  })
}

async function getTeamGcalEvents(teamID){
  client.baseURL = urls.calendar_management;
  GetTeamssGcalEvents({
    teamID: teamID
  }).then((res) => {
    let events = [];
    res.eventIntervals.map((eventInterval) => {
      events.push(eventInterval.split("-"));
    });
    for(let i = 0; i < events.length; i++){
      events[i][0] = DateTime.fromSeconds(Number(events[i][0])); //convert to numbers so that DateTime.FromSeconds can be called on them
      events[i][1] = DateTime.fromSeconds(Number(events[i][1]));
    }
    //console.log(events);
    setCalendarEvents(events);
  })
}

// TODO: define return value however you want.
async function getUserCalendarEvents(userEmail) {
  console.log("get User CalendarEvents was called")
  userEmail = userEmail.replace("%40", "@") // sanitize the converted @ sign
  // client.baseURL = "http://localhost:8080";
  client.baseURL = urls.identity;
  let teamInfo = GetUser({
      email: userEmail,
      username: userEmail,
  }).then(async (res) => {
      // use the result here
      //console.log(res);
  })
}

// TODO: define return value however you want.
async function getTeamCalendarEvents(teamID) {
  console.log("get Team CalendarEvents was called")
  // TODO: fill in API calls here by Mark
  teamID = teamID.replace("%40", "@") //not sure if we need this here tbh
  // API call here
  // client.baseURL = "http://localhost:8080";
  client.baseURL = urls.identity;
  let teamInfo = GetTeam({
      teamID: teamID,
  }).then(async (res) => {
      // use the result here
      console.log(res)
  })
}

async function getUserAvailability(userEmail){
  client.baseURL = urls.preference_management;
  userEmail = userEmail.replace("%40", "@") // sanitize the converted @ sign
  const avail = await GetAvailability({
      email: userEmail
  });
  const sortedAvail = sortDates(avail.timeAvailability);
  if(sortedAvail.length % 2 === 1){
    sortedAvail.pop(); //we want 2 availabilities per day, a start time and an end time
  }
  setAvailabilities(sortedAvail);
  //console.log(sortedAvail)
}

  const container = useRef(null)
  const containerNav = useRef(null)
  const containerOffset = useRef(null)
  //luxon datetime stuff
  const now = DateTime.now();
  const monday = now.set({weekday: 1});
  const data = { dates: [monday.toJSON()], currentMonth: now.month, currentDay: now.day.toString(), currentYear: now.year, currentWeek: now.weekNumber };
  for(let i = 1; i < 7; i++){
    let dayOfWeek = monday.plus({days: i});
    data.dates.push(dayOfWeek.toJSON());
  }
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const events = [];//[{event: "Group Meeting", start: "2022-03-07T20:00:00", end:"2022-03-07T21:00:00", eventId: 1}, {event: "406 Lecture", start: "2022-03-07T11:30:00", end: "2022-03-07T13:00:00", eventId: 2}, {start: "2022-03-08T20:00:00", end:"2022-03-08T21:00:00"}];
  //react hooks 
  const [week, setWeek] =  useState(data.currentWeek)
  const [weekDates, setWeekDates] = useState(data.dates)
  const [month, setMonth] = useState(data.currentMonth)
  const [year, setYear] = useState(data.currentYear)
  const [calendarEvents, setCalendarEvents] = useState(props.calendarEvents)
  const [availabilities, setAvailabilities] = useState(props.availabilities)

  function updateWeekOnClick(input){
    if (input === ">"){
      const now = DateTime.now();
      let weekNum = week;
      let yearNum = year;
      if(weekNum === 52){
        weekNum = 1;
        yearNum = year + 1;
      } else{
        weekNum = weekNum + 1;
      }
      let updatedWeek = now.set({weekNumber: weekNum, weekYear: yearNum});
      setWeek(updatedWeek.weekNumber);
      setMonth(updatedWeek.month);
      setYear(updatedWeek.year);
      let updatedWeekDates = [];
      for(let i = 1; i <= 7; i++){
        let day = updatedWeek.set({weekday: i});
        updatedWeekDates.push(day.toJSON());
      }
      setWeekDates(updatedWeekDates);
    } else if(input === "<"){
      let weekNum = week;
      let yearNum = year;
      if(weekNum === 1){
        weekNum = 52;
        yearNum = year - 1;
      } else{
        weekNum = weekNum - 1;
      }
      let updatedWeek = now.set({weekNumber: weekNum, weekYear: yearNum});
      setWeek(updatedWeek.weekNumber);
      setMonth(updatedWeek.month);
      setYear(updatedWeek.year);
      let updatedWeekDates = [];
      for(let i = 1; i <= 7; i++){
        let day = updatedWeek.set({weekday: i});
        updatedWeekDates.push(day.toJSON());
      }
      setWeekDates(updatedWeekDates);
    }
  }

  //Router nonsense:
  const router = useRouter()
  const { bookingsType, bookings } = router.query // bookingsType can be "user" or "teamCalendar". // bookings will be your user email or team ID
  /*if (bookingsType == "user") {
    getUserGcalEvents(bookings);
    getUserAvailability(bookings);
  } else if (bookingsType == "teamCalendar") {
    getTeamGcalEvents(bookings);
  }*/
  /*useEffect(() => {
    
  }, [])*/
  //useffect has to be above this or vercel will probably freak out
  if((bookingsType !== "user") && (bookingsType !== "teamCalendar")){
    return (<AccessDenied></AccessDenied>);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="relative z-20 flex flex-none items-center justify-between border-b border-gray-200 py-4 px-6">
        <h1 className="text-lg font-semibold text-gray-900">
          <time dateTime="2022-01">{months[month-1]} {year}</time>
        </h1>
        <div className="flex items-center">
          <div className="flex items-center rounded-md shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
              onClick={e => updateWeekOnClick("<")}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
            >
              {week === data.currentWeek? <div>Today</div>: <div>{now.set({weekNumber: week, weekYear: year}).toLocaleString(DateTime.DATE_MED)}</div>}
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
              onClick={e => updateWeekOnClick(">")}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:flex md:items-center">
            <Menu as="div" className="relative">

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="focus:outline-none absolute right-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Day view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Week view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Month view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Year view
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <Link href={{
              query: { newEvent: true, bookingsType: bookingsType, bookings: bookings },
            }}>
              <a className="focus:outline-none ml-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                New event
              </a>
            </Link>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="focus:outline-none absolute right-0 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Create event
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Go to today
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>
      <div ref={container} className="flex flex-auto flex-col overflow-auto bg-white">
        <div style={{ width: '165%' }} className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
          <div
            ref={containerNav}
            className="sticky top-0 z-10 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
          >
            <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                M <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">10</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                T <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">11</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                W{' '}
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                  12
                </span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                T <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">13</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                F <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">14</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                S <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">15</span>
              </button>
              <button type="button" className="flex flex-col items-center pt-2 pb-3">
                S <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">16</span>
              </button>
            </div>
            {/* Need to figure out how to get the current week and do a mapping */}
            <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
              <div className="col-end-1 w-14" />
              {weekDates.map((date, index) => {
                let day = DateTime.fromISO(date).day.toString();
                if(day === data.currentDay && week === data.currentWeek){
                  return (
                    <div className="flex items-center justify-center py-3">
                      <span className="flex items-baseline">
                        {weekdays[index]} <span className="ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">{day}</span>
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center justify-center py-3">
                      <span>
                        {weekdays[index]} <span className="items-center justify-center font-semibold text-gray-900">{day}</span>
                      </span>
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    12AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    1AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    2AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    3AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    4AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    5AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    6AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    7AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    8AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    9AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    10AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    11AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    12PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    1PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    2PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    3PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    4PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    5PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    6PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    7PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    8PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    9PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    10PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    11PM
                  </div>
                </div>
                <div />
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                <div className="col-start-1 row-span-full" />
                <div className="col-start-2 row-span-full" />
                <div className="col-start-3 row-span-full" />
                <div className="col-start-4 row-span-full" />
                <div className="col-start-5 row-span-full" />
                <div className="col-start-6 row-span-full" />
                <div className="col-start-7 row-span-full" />
                <div className="col-start-8 row-span-full w-8" />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
              >
                {/* 74 gives 6:00AM, 92 gives 7:30, 92 - 74 = 18 for 1.5 hours, meaning .5 hours requires 6, I don't like this weird wizardry 
                    2 gives a position of 12am, so y position comes from 2 + # of half hours past 12am * 6, if there's a better way to do this please tell me
                    col-start-3 is for wednesday meetings, the number refers to the day of the week, 2 is tuesday, 4 is thursday, etc.
                */}
                {props.availabilities.map((arr, ind) => {
                  return arr.map((avail, index) => {
                    if(index % 2 === 0){
                      //start time
                      let availDate = DateTime.fromSeconds(Number(avail));
                      let midnight = availDate.set({hour: 0, minute: 0});
                      let duration = availDate.diff(midnight, ['hours']);
                      let eventDay = availDate.weekday;
                      let className = "relative mt-px flex col-start-" + eventDay; //this will put the event in the correct column corresponding to its day
                      let dur = 6*2*duration.hours;
                      let gridRow = {gridRow: 2 + ' / span ' + dur};
                      return (
                        <li className={className} style={gridRow}>
                          <a
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-200 p-2 text-xs leading-5 hover:bg-gray-300"
                          >
                            <p className="text-gray-500 group-hover:text-gray-900">
                              <time dateTime="2022-01-12T06:00">{availDate.toLocaleString(DateTime.TIME_SIMPLE)}</time>
                            </p>
                          </a>
                        </li>
                      );
                    } else {
                      //end time
                      let availDate = DateTime.fromSeconds(Number(avail));
                      let day = availDate.day;
                      let midnight = availDate.set({day: day + 1, hour: 0, minute: 0});
                      let duration = midnight.diff(availDate, ['hours']);
                      let eventDay = availDate.weekday;
                      let className = "relative mt-px flex col-start-" + eventDay; //this will put the event in the correct column corresponding to its day
                      let hour = availDate.hour;
                      let minutes = availDate.minute;
                      let start = 2 + 6*2*hour;
                      if(minutes > 0){
                        start = start + 6;
                      }
                      let dur = 6*2*duration.hours;
                      let gridRow = {gridRow: start + ' / span ' + dur};
                      return (
                        <li className={className} style={gridRow}>
                          <a
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-200 p-2 text-xs leading-5 hover:bg-gray-300"
                          >
                            <p className="text-gray-500 group-hover:text-gray-900">
                              <time dateTime="2022-01-12T06:00">{availDate.toLocaleString(DateTime.TIME_SIMPLE)}</time>
                            </p>
                          </a>
                        </li>
                      );
                    }
                  });
                })}
                {props.calendarEvents.map((event, index) => {
                  let eventDateTime = [DateTime.fromSeconds(event[0]), DateTime.fromSeconds(event[1])]
                  if(eventDateTime[0].weekNumber === week && eventDateTime[0].year === year){
                    let duration = eventDateTime[1].diff(eventDateTime[0], ['minutes']);
                    let eventDay = eventDateTime[0].weekday;
                    let className = "relative mt-px flex col-start-" + eventDay; //this will put the event in the correct column corresponding to its day
                    let hour = eventDateTime[0].hour;
                    let minutes = eventDateTime[0].minute;
                    let start = 2 + 6*2*hour;
                    if(minutes > 0){
                      start = start + Math.round(minutes/5);
                    }
                    //console.log(duration.minutes);
                    let dur = Math.round(duration.minutes/5);
                    //console.log(dur);
                    let gridRow = {gridRow: start + ' / span ' + dur};
                    if((bookings.replace("%40", "@") !== props.user.email) && (bookingsType === "user")){
                      return (
                        <li className={className} style={gridRow}>
                          <a
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-200 p-2 text-xs leading-5 hover:bg-gray-300"
                          >
                            <p className="text-gray-500 group-hover:text-gray-900">
                              <time dateTime="2022-01-12T06:00">{eventDateTime[0].toLocaleString(DateTime.TIME_SIMPLE)}</time>
                            </p>
                          </a>
                        </li>
                      );
                    } else{
                      return (
                        <li className={className} style={gridRow}>
                          <a
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-green-50 p-2 text-xs leading-5 hover:bg-green-100"
                          >
                            <p className="text-green-500 group-hover:text-green-700">
                              <time dateTime="2022-01-12T06:00">{eventDateTime[0].toLocaleString(DateTime.TIME_SIMPLE)}</time>
                            </p>
                          </a>
                        </li>
                      );
                    }
                  }
                })}
                {props.userCalEvents.map((event, index) => {
                  let eventDateTime = [DateTime.fromSeconds(event[0]), DateTime.fromSeconds(event[1])]
                  if(eventDateTime[0].weekNumber === week && eventDateTime[0].year === year){
                    let duration = eventDateTime[1].diff(eventDateTime[0], ['minutes']);
                    let eventDay = eventDateTime[0].weekday;
                    let className = "relative mt-px flex col-start-" + eventDay; //this will put the event in the correct column corresponding to its day
                    let hour = eventDateTime[0].hour;
                    let minutes = eventDateTime[0].minute;
                    let start = 2 + 6*2*hour;
                    if(minutes > 0){
                      start = start + Math.round(minutes/5);
                    }
                    //console.log(duration.minutes);
                    let dur = Math.round(duration.minutes/5);
                    //console.log(dur);
                    let gridRow = {gridRow: start + ' / span ' + dur};
                    return (
                      <li className={className} style={gridRow}>
                        <a
                          className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                        >
                          <p className="text-blue-500 group-hover:text-blue-700">
                            <time dateTime="2022-01-12T06:00">{eventDateTime[0].toLocaleString(DateTime.TIME_SIMPLE)}</time>
                          </p>
                        </a>
                      </li>
                    );
                    
                  }
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}