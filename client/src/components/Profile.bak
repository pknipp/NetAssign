import React, { useContext, useEffect, useState } from 'react'
// import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import GridFeed from './GridFeed';
import AuthContext from "../auth"
import PostContext from "../PostContext";

const Profile = ({ match }) => {
    // in Profile currentProfile is really "current profile being viewed"
    const { currentUserId } = useContext(AuthContext)
    const { updatedPosts } = useContext(PostContext);
    const [currentProfile, setCurrentProfile] = useState(null)
    const [followStatus, setFollowStatus] = useState("")
    let username = match.params.profile
    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/profile/${username}`)
            try {

                if (res.ok) {
                    const data = await res.json()
                    setCurrentProfile(data)
                    data.followers.includes(currentUserId) ? setFollowStatus("Following") : setFollowStatus("Not Following")
                    // console.log(followStatus);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [username, followStatus, updatedPosts])
    if (!currentProfile) return null


    const followUser = async () => {
        // console.log("plugged in to follow");
        const data = {
            profile_id: currentProfile.user.id,
            follower_id: currentUserId
        }
        try {
            const res = await fetch(`/api/profile/following`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!res.ok) {
                // console.log(res)
            }
            setFollowStatus("Following")
            // console.log(res)
        } catch (e) {
            console.error(e)
        }
    }


    const unfollowUser = async () => {
        // console.log("plugged in to unfollow");
        const data = {
            profile_id: currentProfile.user.id,
            follower_id: currentUserId
        }
        try {
            const res = await fetch(`/api/profile/unfollow`, {
                method: "DELETE",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!res.ok) {
                // console.log(res)
            }
            //    console.log(res.json())
            setFollowStatus("Follow")
        } catch (e) {
            console.error(e)
        }
    }

    // console.log(currentProfile);
    return (
        <main style={{
            backgroundColor: `#fafafa`,
            // display: `flex`,
            // flexDirection: `column`
        }}>
            <div style={{
                padding: `30px 20px 0`,
                // width: `calc(100% - 40px)`,
                // margin: `0 auto 30px`,
                // maxWidth: `935px`,
                // alignItems: `stretch`,
                border: `0 solid #000`,

            }}>
                <header style={{
                    display: `flex`,
                    margin: `0 auto`,
                    marginBottom: `44px`,
                    flexDirection: `row`,
                    maxWidth: `fit-content`
                }}>
                    <div style={{
                        marginRight: `30px`
                    }}>
                        <div style={{
                            alignItems: `center`,
                            alignSelf: `center`,
                            display: `block`
                        }}>
                            <span style={{
                                width: `150px`,
                                height: `150px`,
                                backgroundColor: `#fafafa`,
                                borderRadius: `50%`,
                                display: `block`,
                                flex: `0 0 auto`,
                                overflow: `hidden`,
                                position: `relative`
                            }}>
                                <img src='https://images.unsplash.com/photo-1526660690293-bcd32dc3b123?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80' style={{
                                    // <img src={currentProfile.profilepic} style={{
                                    height: `100%`,
                                    width: `100%`,
                                    objectFit: `cover`
                                }} />
                            </span>
                            {/* </div> */}
                        </div>
                    </div>
                    <section style={{
                        // height: `100%`,
                        // -webkit-touch-callout: none;
                        width: `100%`,
                        // objectFit: `cover`
                    }}>
                        <div style={{
                            display: `flex`,
                            marginBottom: `20px`,
                            alignItems: `center`
                        }}>
                            <h2 style={{
                                fontSize: `28px`,
                                lineHeight: `32px`,
                                margin: `-5px 0 -6px`,
                                color: `#262626`
                            }}>{currentProfile.user.user_name}</h2>

                            {currentProfile.user.id === currentUserId ?
                                <button disabled className="button is-info" style={{
                                    marginLeft: `20px`,
                                    fontWeight: `600`
                                }}>
                                    Follow
                                </button>
                                :
                                <button className="button is-info"
                                    onClick={currentProfile.followers.includes(currentUserId) ? () => unfollowUser() : () => followUser()}
                                    style={{
                                        marginLeft: `20px`,
                                        fontWeight: `600`
                                    }}>
                                    {currentProfile.followers.includes(currentUserId) ?
                                        "Following"
                                        : "Follow"}
                                </button>
                            }
                        </div>
                        <div style={{
                            display: `flex`,
                            marginBottom: `20px`,
                            alignItems: `center`
                        }}>
                            <div className="" style={{
                                fontSize: `16px`,
                                marginRight: `40px`
                            }}>
                                {/* <div> */}
                                {/* <a href={`${currentProfile.user.user_name}/feed`}> */}
                                <span style={{
                                    fontWeight: `bold`
                                }}>{currentProfile.posts.length} </span>
                                posts
                                {/* </div> */}
                                {/* </a> */}
                            </div>
                            <div className="" style={{
                                fontSize: `16px`,
                                marginRight: `40px`
                            }}>
                                {/* <div> */}
                                {/* <a href={`${currentProfile.user.user_name}/followers`}> */}
                                <span style={{
                                    fontWeight: `bold`
                                }}>{currentProfile.followers.length} </span>
                                 followers
                                {/* </a> */}
                                {/* </div> */}
                            </div>
                            <div className="" style={{
                                fontSize: `16px`,
                                marginRight: `40px`
                            }}>
                                {/* <div> */}
                                {/* <a href={`${currentProfile.user.user_name}/following`}> */}
                                <span style={{
                                    fontWeight: `bold`
                                }}>{currentProfile.following.length} </span>
                                 following
                                {/* </a> */}
                                {/* </div> */}
                            </div>

                        </div>
                        <div>
                            <span>{currentProfile.user.full_name}</span>
                            <br />
                            <span>{currentProfile.user.bio ? currentProfile.user.bio : currentProfile.user.email}</span>
                        </div>
                    </section>
                </header>
                <div className='row-container'>
                    <GridFeed currentProfile={currentProfile} />
                </div>
            </div>
        </main>
    );
};

export default Profile;
