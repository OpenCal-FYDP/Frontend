import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { useSession, getSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import AccessDenied from '../../components/access-denied'
import "flatpickr/dist/themes/light.css";
import Flatpickr from "react-flatpickr";

export default function event(){
    return (<Layout>
        <>
            <form className="bg-white py-6 px-4 space-y-6 sm:p-6">
                <div className="space-y-8 divide-y divide-gray-200">
                    <div>
                        <div>
                            <h3 className="text-2xl leading-6 font-medium text-gray-900">Event</h3>
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
                        <Link href="../bookings">
                            <a className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Back</a>
                        </Link>
                        <Link href="../bookings">
                            <a className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Cancel Event</a>
                        </Link>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Reschedule event
                        </button>
                    </div>
                </div>
            </form>
        </>
    </Layout>)
}

export async function getServerSideProps(context){
    //call apis to get data for preferences
    return {
        props: {
          session: await getSession(context),
        },
    }
}