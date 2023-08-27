import React from 'react';
import {Modal} from "react-bootstrap";
import style from "./MModalSearch.module.css"

function MModalSearch({children, visible, setShowModal}) {


    return (
        <Modal
            show={visible}
            onHide={() => setShowModal(false)}
        >
            <Modal.Body classname={style.body}>
                {children}
            </Modal.Body>
        </Modal>

    )
}

export default MModalSearch;