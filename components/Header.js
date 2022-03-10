import { useSession } from "next-auth/react"

/* This example requires Tailwind CSS v2.0+ */
const navigation = [
  { name: 'Dashboard', href: '/user/self' },
  { name: 'Preferences', href: '/preferences' },
]

function SignInSignOut() {
  const { data: session } = useSession()
  if (session) {
    return (
      <a
        href="/api/auth/signout"
        className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
      >
        Sign out
      </a>
    )
  } else {
    return (
      <a
        href="/signin"
        className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
      >
        Sign in
      </a>
    )
  }
}

export default function Header() {
  return (
    <header className="bg-indigo-600">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <a href="/">
              <h1 className="text-4xl text-white font-bold inline-flex items-center">
                <svg className="w-14 h-14" fill="white" viewBox="0 0 20 20">
                  <path d="M15.5,4H14V2h-1.5v2h-5V2H6v2H4.5C3.67,4 3,4.68 3,5.5v11C3,17.32 3.67,18 4.5,18h11c0.83,0 1.5,-0.68 1.5,-1.5v-11C17,4.68 16.33,4 15.5,4zM15.5,16.5h-11V9h11V16.5zM15.5,7.5h-11v-2h11V7.5zM7.5,12H6v-1.5h1.5V12zM10.75,12h-1.5v-1.5h1.5V12zM14,12h-1.5v-1.5H14V12zM7.5,15H6v-1.5h1.5V15zM10.75,15h-1.5v-1.5h1.5V15zM14,15h-1.5v-1.5H14V15z" />
                </svg>
                <span>OpenCal</span>
              </h1>
            </a>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <a key={link.name} href={link.href} className="text-base font-medium text-white hover:text-indigo-50">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <SignInSignOut></SignInSignOut>
          </div>
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {navigation.map((link) => (
            <a key={link.name} href={link.href} className="text-base font-medium text-white hover:text-indigo-50">
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
