import React, {useContext, useEffect, useState} from 'react';
import style from './AccountSettings.module.css'
import MInputWithText from "../../../components/UI/input/MInputWithText";
import SettingsEditButton from "../../../components/UI/button/SettingsEditButton";
import {useFetching} from "../../../hooks/useFetching";
import UserService from "../../../API/UserService";
import {UserContext} from "../../../context";
import MainLoader from "../../../components/UI/loader/MainLoader";
import MFileInput from "../../../components/UI/input/MFileInput";
import Edit from "../../../components/UI/svg/Edit";
import BooleanDiv from "../../../components/UI/div/BooleanDiv";
import MainMessage from "../../../components/UI/message/MainMessage";

function AccountSettings({userFirstName, setUserFirstName, userSurname, setUserSurname}) {
    const {username, setUsername, userImage, setUserImage} = useContext(UserContext)

    const [image, setImage] = useState("")
    const [showImage, setShowImage] = useState(userImage)

    const [name, setName] = useState(userFirstName)
    const [surname, setSurname] = useState(userSurname)
    const [uUsername, setUUsername] = useState(username)

    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const [isInputsClosed, setIsInputsClosed] = useState(false)

    const [fetchSettings, isLoading, error] = useFetching(async () => {
        let requestData = {}
        if (image !== '')
            requestData.image = image
        if (name !== userFirstName)
            requestData.name = name
        if (surname !== userSurname)
            requestData.surname = surname
        if (uUsername !== username)
            if (uUsername === "") {
                setErrorMessage("Username can't be empty")
                setUUsername(username)
            }
            else
                requestData.nickname = uUsername
        const response = await UserService.userAccountSettings(username, requestData)
        setErrorMessage("")
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
        setErrorMessage(error)
        setName(userFirstName)
        setSurname(userSurname)
        setUUsername(username)
    },[error])


    useEffect(() => {
        setSuccessMessage("")
    }, [errorMessage])


    useEffect(() => {
        if (image !== '')
            setShowImage(URL.createObjectURL(image))
    },[image])


    function declareUserData(e) {
        e.preventDefault()
        if (image === '' && name === userFirstName && surname === userSurname && uUsername === username) {
            setErrorMessage("Nothing are changed")
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
                        alt={"user Big"}
                    />
                    <div className={style.divSmImage}>
                        <img
                            src={showImage}
                            className={style.userImageSm}
                            alt={"user Small"}
                        />
                        <MFileInput
                            setImage={setImage}
                            maxSize={1}
                            setError={setErrorMessage}
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
                        text={"Save Changes"}
                        onClick={() => setIsInputsClosed(false)}
                    >
                        <BooleanDiv bool={isLoading} ifFalse={<Edit color='#3A325B'/>}>
                            <MainLoader />
                        </BooleanDiv>
                    </SettingsEditButton>
                </button>
            </div>
            <div>

                <BooleanDiv bool={!isLoading}>
                    <MainMessage                  //if error
                        type="error"
                        text={errorMessage}
                    />
                </BooleanDiv>

                <BooleanDiv bool={!isLoading}>
                    <MainMessage                  //if success
                        type="success"
                        text={successMessage}
                    />
                </BooleanDiv>
            </div>
        </form>
    );
}

export default AccountSettings;