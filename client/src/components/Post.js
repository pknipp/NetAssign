import React from 'react';
import Comments from './Comments';

const Post = ({ currentUser, post }) => {
    // 736 desktop breakpoint for post with photo in its own container to left, everything else to the right
    // 736 img container becomes 359x359
    //
    // console.log("i'm in")
    // console.log(currentUser);
    // console.log(currentUser.posts[0]);
    if (!post) post = currentUser.posts[0]

    return (
        <div style={{
            // maxWidth: `935px`,
            border: `0.5px solid #dbdbdb`,
            border: `1px solid rgb(239, 239, 239)`,
            backgroundColor: `white`,
            // padding: ` 25px 0`,
            // padding: `6px 0px 30px 0px`,
            maxWidth: `600px`,
            margin: `20px auto`,
            borderRadius: `18px`
        }}>
            <header style={{ display: "flex", padding: `16px` }}>
                <img style={{ width: "32px", height: `32px`, verticaAlign: `middle`, borderRadius: `50%`, marginRight: `10px` }} src={currentUser.profilepic} />
                <div style={{ alignSelf: `center`, fontWeight: `600` }}>
                    <a href={currentUser.user}>{currentUser.user}</a></div>
            </header>
            <div>
                {/* <div className="center-cropped" style={{ backgroundImage: `url(${post.photo})` }} /> */}
                {/* <div style={{ backgroundImage: `url(${post.photo})` }} /> */}
                {/* <div style={{ backgroundImage: `url(require("images/img.svg"))` }} /> */}
                <img src={post.photo} style={{ width: `100%`, height: `auto` }}></img>
            </div>

            {/* <div>ui bar with heart comment paperplane share(start) (end)bookmark save</div> */}
            <div className="after-photo" style={{ padding: `0 16px` }} >
                <div className="level" style={{ marginBottom: `0` }}>
                    {/* <!-- Left side --> */}
                    <div className="level-left" >
                        <div className="level-item">
                            <button className="fontawe">
                                <i className="fas fa-paw"></i>
                            </button>
                        </div>
                        <div className="level-item">
                            <button className="fontawe">
                                <i className="far fa-comment"></i>
                            </button>
                        </div>
                        <div className="level-item">
                            <button className="fontawe">
                                <i className="fas fa-feather-alt"></i>
                                {/* <i className="far fa-paper-plane"></i> */}
                            </button>
                        </div>
                    </div>

                    {/* <!-- Right side --> */}
                    <div className="level-right" style={{ marginTop: `0` }}>
                        <div className="level-item">
                            <button className="fontawe">
                                <i className="far fa-bookmark"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <button style={{
                        backgroundColor: `#fff`,
                        border: `none`,
                        fontWeight: `800`,
                        fontSize: `1em`,
                        padding: `16px 0`
                    }}>
                        {post.likes} likes
                    </button>
                </div>
                <Comments postComments={post.comments} />
                {/* <div>July 31</div> */}
            </div>
        </div >
    );
};

export default Post;
