import { useSession, signIn } from "next-auth/react"
import Layout from "../components/layout"

export default function Example() {
    const { data: session } = useSession()
    return (
        <Layout>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h1 className="text-6xl font-bold inline-flex items-center">
                            <svg className="w-20 h-20 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15.5,4H14V2h-1.5v2h-5V2H6v2H4.5C3.67,4 3,4.68 3,5.5v11C3,17.32 3.67,18 4.5,18h11c0.83,0 1.5,-0.68 1.5,-1.5v-11C17,4.68 16.33,4 15.5,4zM15.5,16.5h-11V9h11V16.5zM15.5,7.5h-11v-2h11V7.5zM7.5,12H6v-1.5h1.5V12zM10.75,12h-1.5v-1.5h1.5V12zM14,12h-1.5v-1.5H14V12zM7.5,15H6v-1.5h1.5V15zM10.75,15h-1.5v-1.5h1.5V15zM14,15h-1.5v-1.5H14V15z" />
                            </svg>
                            <span>OpenCal</span>
                        </h1>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                    </div>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500"></span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a
                                href="#"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                onClick={() => signIn()}
                            >
                                <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                </svg>
                                <span>Sign in with GitHub</span>
                            </a>
                        </div>

                        {session ? "User is now logged in as: " + session.user.email + ". Sign out at http://localhost:3000/api/auth/signout" : ""}
                    </div>
                </div>
            </div>
        </Layout>
    )
}