/* This example requires Tailwind CSS v2.0+ */
import { useSession } from 'next-auth/react'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import CalendarWeekView from '../components/bookings/calendar-week-view'
import Details from '../components/bookings/details'

export default function Page() {

    const { data: session, status } = useSession()
    const loading = status === 'loading'

    // When rendering client side don't display anything until loading is complete
    if (typeof window !== 'undefined' && loading) return null

    // If no session exists, display access denied message
    if (!session) { return <Layout><AccessDenied /></Layout> }

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
                            {/* TODO: Insert calendar here! */}
                            <CalendarWeekView></CalendarWeekView>
                        </section>

                        {/* Secondary column (hidden on smaller screens) */}
                        <aside className="hidden lg:block lg:flex-shrink-0 lg:order-first">
                            <div className="h-full relative flex flex-col w-96 border-r border-gray-200 bg-white overflow-y-auto">
                                
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    {/* Your content */}
                                    <Details user={session.user}></Details>
                                </div>

                                {/* TODO: insert whatever Matt wanted here. Something team-related */}
                            </div>
                        </aside>
                    </main>
                </div>
            </div>
        </Layout>
    )
}
