import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditUser = props => {
    const { fetchWithCSRF, currentUser, setCurrentUserId } = useContext(AuthContext);
    const [email, setEmail] = useState(currentUser.email);
    const [username, setUsername] = useState(currentUser.user_name);
    const [fullname, setFullname] = useState(currentUser.full_name);
    const [canfollow, setCanfollow] = useState(currentUser.can_follow);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('')
    const [website, setWebsite] = useState(currentUser.website);
    const [bio, setBio] = useState(currentUser.bio);
    const [phone, setPhone] = useState(currentUser.phone);
    const [gender, setGender] = useState(currentUser.gender);
    // const token = useSelector(state => state.authentication.token);
    // const dispatch = useDispatch();

    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    let history = useHistory();

    const submitForm = e => {
        e.preventDefault();

        // Make the following an IIFE?
        async function editUser() {
            const response = await fetchWithCSRF(`/api/users/${props.currentUserId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    username,
                    fullname,
                    canfollow,
                    password,
                    password2,
                    website,
                    bio,
                    phone,
                    gender
                })
            });

            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages)
            } else {
                // setCurrentUserId(responseData.current_user_id)
                history.push('/')
            }
        }
        editUser();
    }

    const deleteUser = e => {
        e.preventDefault();

        // Make the following an IIFE?
        async function deleteUser() {
            const response = await fetchWithCSRF(`/api/users/${props.currentUserId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({})
            });

            console.log(response);
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages)
            }
            else {
                // setCurrentUserId(responseData.current_user_id)
                setCurrentUserId(null);
                // history.push('/')

            }
        }
        deleteUser();
    }

    return (
        <>
            <form onSubmit={submitForm}>
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                <input
                    type="text"
                    placeholder="Name"
                    value={fullname}
                    onChange={e => setFullname(e.target.value)} name="fullname" />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)} name="username" />
                <input
                    type="text"
                    placeholder="Website"
                    value={website}
                    onChange={e => setWebsite(e.target.value)} name="website" />
                <textarea
                    rows="4"
                    placeholder="Bio"
                    value={bio}
                    onChange={e => setBio(e.target.value)} name="bio"></textarea>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)} name="email" />
                <input
                    type="number"
                    placeholder="Phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)} name="phone" />
                <input
                    type="text"
                    placeholder="Gender"
                    value={gender}
                    onChange={e => setGender(e.target.value)} name="gender" />
                <input
                    type="password"
                    placeholder="New password (required)"
                    value={password}
                    onChange={e => setPassword(e.target.value)} name="password" />
                <input
                    type="password"
                    placeholder="Confirm new password (required)"
                    value={password2}
                    onChange={e => setPassword2(e.target.value)} name="password2" />
                <label className="checkbox" htmlFor="canfollow">
                    <input
                        type="checkbox"
                        checked={!canfollow}
                        onChange={e => setCanfollow(!e.target.checked)} name="canfollow" />
                    {/* Click to allow others to follow you. */}Make profile private?
                    </label>
                <button type="submit">Submit Changes</button>
            </form>
            <form onSubmit={deleteUser}>
                {messages.length ? messages.map(err => <li key={err}>{err}</li>) : ''}
                <h2>Would you like to delete your account?</h2>
                <button type="submit">Delete Account
                </button>
            </form>
        </>
    );
};

export default EditUser;
