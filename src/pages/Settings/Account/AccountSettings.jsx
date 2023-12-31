import {useContext, useEffect, useState} from 'react';
import style from './AccountSettings.module.css'
import MInputWithText from "../../../components/UI/input/MInputWithText";
import SettingsEditButton from "../../../components/UI/button/SettingsEditButton";
import {useFetching} from "../../../hooks/useFetching";
import UserService from "../../../API/UserService";
import {UserContext} from "../../../context";
import MainLoader from "../../../components/UI/loader/MainLoader";
import MFileInput from "../../../components/UI/input/MFileInput";
import Edit from "../../../components/UI/svg/Edit";
import MainMessage from "../../../components/UI/message/MainMessage";

function AccountSettings({userFirstName, setUserFirstName, userSurname, setUserSurname}) {
    const {username, setUsername, userImage, setUserImage} = useContext(UserContext)

    const [image, setImage] = useState("")
    const [showImage, setShowImage] = useState(userImage)

    const [name, setName] = useState(userFirstName)
    const [surname, setSurname] = useState(userSurname)
    const [uUsername, setUUsername] = useState(username)

    const [error, setError] = useState("")

    const [successMessage, setSuccessMessage] = useState("")

    const [isInputsClosed, setIsInputsClosed] = useState(false)

    const [fetchSettings, isLoading, settingsError] = useFetching(async () => {
        let requestData = {}
        if (image !== "")
            requestData.image = image
        if (name !== userFirstName)
            requestData.name = name
        if (surname !== userSurname)
            requestData.surname = surname
        if (uUsername !== username)
            requestData.nickname = uUsername
        const response = await UserService.userAccountSettings(username, requestData)
        setError("")
        setSuccessMessage(response)
        setIsInputsClosed(true)

        if (requestData.image)
            setUserImage(URL.createObjectURL(image))
        if (requestData.name)
            setUserFirstName(name)
        if (requestData.surname)
            setUserSurname(surname)
        if (requestData.nickname)
            setUsername(uUsername)

    })

    useEffect(() => {
        setError(error)
        setName(userFirstName)
        setSurname(userSurname)
        setUUsername(username)
    },[settingsError])


    useEffect(() => {
        setSuccessMessage("")
    }, [error])


    useEffect(() => {
        if (image !== '')
            setShowImage(URL.createObjectURL(image))
    },[image])



    function declareUserData(e) {
        e.preventDefault()
        if (image === '' && name === userFirstName && surname === userSurname && uUsername === username) {
            setError("Nothing are changed")
        }
        else if (uUsername === "") {
            setError("Username can't be empty")
            setUUsername(username)
        }
        else
            fetchSettings()
    }

    const inputsList = [
        {placeholder: "Change Username", text: uUsername, onChange: setUUsername},
        {placeholder: "Change Name", text: name, onChange: setName},
        {placeholder: "Change Surname", text: surname, onChange: setSurname}
    ]

    return (
        <form onSubmit={declareUserData}>
            <div className={style.divCenter}>
                <div className={style.divImages}>
                    <img
                        src={showImage}
                        className={style.userImageBig}
                        alt=""
                    />
                    <div className={style.divSmImage}>
                        <img
                            src={showImage}
                            className={style.userImageSm}
                            alt=""
                        />
                        <MFileInput
                            setImage={setImage}
                            maxSize={1}
                            setError={setError}
                        >
                            <SettingsEditButton>
                                Choose image
                            </SettingsEditButton>
                        </MFileInput>
                    </div>
                </div>

                {inputsList.map((c, index) =>
                    <MInputWithText
                        key={index}
                        type="name"
                        placeholder={c.placeholder}
                        value={c.text}
                        onChange={event => c.onChange(event.target.value)}
                        onClose={() => c.onChange(c.text)}
                        isInputsClosed={isInputsClosed}
                        defaultValue={c.text}
                    />
                )}
            </div>

            <div className={style.saveChanges}>
                <button>
                    <SettingsEditButton
                        text="Save Changes"
                        onClick={() => setIsInputsClosed(false)}
                    >
                        { isLoading
                            ? <MainLoader />
                            : <Edit color="#3A325B"/>
                        }
                    </SettingsEditButton>
                </button>
            </div>
            <div>
                <MainMessage                  //if error
                    type="error"
                    text={error}
                />
                <MainMessage                  //if success
                    type="success"
                    text={successMessage}
                />
            </div>
        </form>
    );
}

export default AccountSettings;