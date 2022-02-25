import { useRouter } from 'next/router'

export default function team(){
    const router = useRouter();
    const teamID = router.query.teamID;

    return <h1>Team {teamID}</h1>
}