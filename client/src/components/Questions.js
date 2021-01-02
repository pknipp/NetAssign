import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth'

const Questions = _ => {
    const [followList, setFollowList] = useState([])
    const { currentUser } = useContext(AuthContext)
    const [show, setShow] = useState(false)
    const [suggestions, setSuggestions] = useState([]);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [followStatus, setFollowStatus] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/questions`)
                if (res.ok) {
                    const data = await res.json()
                    setFollowList(data.followerPosts[0].sort(() => Math.random() - 0.5))
                    // console.log(data);
                    if (data.following.length) {
                        setShow(false)
                    } else {
                        const getSuggestions = await fetch('/api/users/')
                        if (getSuggestions.ok) {
                            const response = await getSuggestions.json()
                            setSuggestions(response.users)
                            setShow(true)
                            // console.log(response.users)
                        }
                    }
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [setFollowList, show])

    const handleClose = () => {
        setShow(false)
        setFollowList([])
    }

    return (
        <div>
            FeedPost was here
        </div>
    )
}


export default Questions
