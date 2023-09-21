import {getRequest, postBodyRequestWithAuth} from "./RequestFunction";

export default class ItemService {

    static async newItem(data, images) {
        const formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i])
        }
        return await postBodyRequestWithAuth("/item/new", formData)
    }

    static async getItem(idCollection, idItem) {
        return await getRequest("/item/" + idCollection + "/" + idItem)
    }

    static async getItemForEditor(idCollection, idItem) {
        return await getRequest("/auth/itemForEditor/" + idCollection + "/" + idItem)
    }

}