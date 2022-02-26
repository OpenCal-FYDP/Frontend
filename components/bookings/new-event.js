import Link from "next/link";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";

export default function NewEvent() {

    return (
        <>
            <form className="bg-white py-6 px-4 space-y-6 sm:p-6">
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
                                        placeholder="you@example.com"
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
                                        className="shadow-sm focus:ring-indigo-500 border focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        data-enable-time
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                                    Length (minutes)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="length"
                                        name="length"
                                        id="length"
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
                            query: {},
                        }}>
                            <a className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</a>
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