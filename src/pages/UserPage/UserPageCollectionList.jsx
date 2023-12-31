import UserPageCollectionItem from "./UserPageCollectionItem";
import {Link} from "react-router-dom";
import style from './UserPageCollectionItem.module.css'
function UserPageCollectionList({collections, username}) {

    if (!collections.length) {
        return (
            <div>
                No any collections
            </div>
        )
    }

    return (
        <div className={style.list}>
            {collections.map((c, index) =>
                <Link
                    key={index}
                    to={"/" + username + "/" + c.idCollection}
                >
                    <UserPageCollectionItem name={c.name} about={c.about} img={c.image}/>
                </Link>
            )}
        </div>
    );
}

export default UserPageCollectionList;