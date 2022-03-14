import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import {CreateEvent} from "../../clients/cal-management/service.pb.js"
import Link from "next/link";
import { client } from "twirpscript";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { now } from "next-auth/client/_utils";
import urls from "../../clients/client-urls.json";

export default function NewEvent(props) {

    // const registerEvent = async Event => {
        // Event.preventDefault()

        // client.baseURL = urls.calendar_management;
        // // client.baseURL ="http://localhost:8080"

        // var t = Date.parse(Event.target.date.value)
        // console.log(t)

        // const e = {
        //     summary: "1:1 with " + Event.target.name.value ,
        //     location: "virtual",
        //     Start: Math.floor(t/1000),
        //     end: Math.floor(t/1000+Event.target.length.value*60),
        //     recurrence: [],
        //     attendees: [],
        // }

        // const uId = uuidv4().replaceAll('-', '')

        // const req = {
        //     calendarId: uId,
        //     eventId: uId,
        //     event: e,
        //     ownerOfEvent: props.email, // TODO: where to I get emails
        // }

        // console.log("Request, ", req)
        // const res = await CreateEvent(req)


        // // These are the values we get when we hit the Create Event button!
        // console.log("event.target.name.value: " + Event.target.name.value)
        // console.log("event.target.date.value: " + Event.target.date.value)
        // console.log("event.target.length.value: " + Event.target.length.value)
    // }

    return (
        <>
            <form className="bg-white py-6 px-4 space-y-6 sm:p-6" /*onSubmit={registerEvent}*/>
                <div className="space-y-8 divide-y divide-gray-200">
                    <div>
                        <div>
                            <h3 className="text-2xl leading-6 font-medium text-gray-900">New Event</h3>
                        </div>

                        <div className="mt-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="name"
                                        name="name"
                                        id="name"
                                        className="shadow-sm focus:ring-indigo-500 border focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <div className="mt-1">
                                    <Flatpickr
                                        type="date"
                                        name="date"
                                        id="date"
                                        // ref={date => (this.date = date)}
                                        className="shadow-sm focus:ring-indigo-500 border focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        data-enable-time
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                                    Length minutes (30 minute increments)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="length"
                                        name="length"
                                        id="length"
                                        // ref={length => (this.length = length)}
                                        className="shadow-sm focus:ring-indigo-500 border focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        placeholder="30"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <Link href={{
                            pathname: "/"
                        }}>
                            <a
                                type="cancel"
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

                            >
                                Cancel
                            </a>
                        </Link>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create event
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}