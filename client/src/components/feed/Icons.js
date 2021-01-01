import React, { useContext, useState, useEffect } from 'react'
import FeedPost from './FeedPost'
import AuthContext from '../../auth'

function Icons({ willRerender: rerender, postId, caption, likes, like_count, lat_like, showMe }) {

    const { currentUserId } = useContext(AuthContext)
    const [errors, setErrors] = useState([]);

    const willRerender = e => {
        rerender && rerender(e);

    };

    const handleLike = e => {
        e.preventDefault();

        async function removeLike(likes, i) {
            let url = `api/likes/${likes[i].id}`;
            // console.log(url);
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                // console.log(responseData)
                likes.splice(i, 1)
                // console.log(likes)
                like_count--
                willRerender()
            }
        }


        async function addLike() {
            const response = await fetch(`/api/likes/${currentUserId}/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                let { data } = responseData
                // console.log(data)
                likes.push(data)
                like_count++
                willRerender()
            }
        }
        for (let i = 0; i < likes.length; i++) {
            if (likes[i].user_id === currentUserId) {

                removeLike(likes, i);
                return "done"
            }
        }

        addLike()
    }


    // useEffect(() => {
    //     (async () => {
    //         const res = await fetch(`/api/posts/${postId}`)
    //         try {

    //             if (res.ok) {
    //                 const data = await res.json()
    //                 // postInfo setter
    //                 console.log(data)
    //             }
    //         } catch (err) {
    //             console.error(err)
    //         }
    //     })()
    // }, [])


    return (
        <div>
            <div className="after-photo" style={{ padding: `0 16px` }} >
                <div className="level" style={{ marginBottom: `0` }}>
                    {/* <!-- Left side --> */}
                    <div className="level-left" >
                        <div className="level-item">
                            <button className="fontawe" onClick={handleLike} >
                                <i className="fas fa-paw"></i>
                            </button>
                        </div>
                        <div className="level-item">
                            <button disabled className="fontawe disabled">
                                <i className="far fa-comment"></i>
                            </button>
                        </div>
                        <div className="level-item">
                            <button disabled className="fontawe disabled">
                                <i className="fas fa-feather-alt"></i>
                                {/* <i className="far fa-paper-plane"></i> */}
                            </button>
                        </div>
                    </div>

                    {/* <!-- Right side --> */}
                    <div className="level-right" style={{ marginTop: `0` }}>
                        <div className="level-item">
                            <button disabled className="fontawe disabled">
                                <i className="far fa-bookmark"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* showMe flag causes caption & likes to render at bottom of feedpost, but not single post */}
            {!showMe ? null : (like_count === 0 ? <div>
                <button style={{
                    backgroundColor: `#fff`,
                    border: `none`,
                    fontWeight: `800`,
                    fontSize: `1em`,
                    padding: `16px 0`
                }}>
                    Be the first to like this!
                </button>
            </div> :
                <div style={{
                    textAlign: "left",
                    marginLeft: "20px",
                    width: 'auto'
                    // width: '100%'
                }}>
                    <div style={{
                        backgroundColor: `#fff`,
                        border: `none`,
                        fontWeight: `800`,
                        fontSize: `1em`,
                        padding: `8px 0`,
                        // width: '342px'
                        maxWidth: '342px'

                    }}>{caption}</div>
                    <button style={{
                        backgroundColor: `#fff`,
                        border: `none`,
                        fontWeight: `800`,
                        fontSize: `1em`,
                        padding: `8px 0`,
                        color: "#489dcf",
                        maxWidth: "342px",
                        textAlign: "left"

                    }}>
                        {/* replace with likes from post  and latest like*/}

                        {lat_like} and {like_count} others liked this
                    </button>
                </div>
            )}
        </div>
    )
}

export default Icons
