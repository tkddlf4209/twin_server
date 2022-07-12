import axios from 'axios';
const PORT = 2000;
const HOST = '';//`${HOST}`

export async function getUsers() {
    const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
    );
    return response.data;
}

export async function getUser(id) {
    const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${id}`
    );
    return response.data;
}

export async function getTwin(id) {
    const response = await axios.get(
        `${HOST}/twin/${id}`
    );
    return response.data;
}


export async function getEntity(id) {
    const response = await axios.get(
        `${HOST}/entity/${id}`
    );
    return response.data;
}


export async function removeEntity(data) {
    const response = await axios.delete(
        `${HOST}/entity`, data
    );
    return response.data;
}



export async function removeTwin(data) {
    const response = await axios.delete(
        `${HOST}/twin`, {
        data
    }
    );
    return response.data;
}

export async function getAllInfos() {
    const response = await axios.get(
        `${HOST}/allInfos`
    );

    return response.data;
}


export async function getPlicyInfos() {
    const response = await axios.get(
        `${HOST}/policyInfos`
    );

    return response.data;
}

export async function updatePolicy(data) {
    const response = await axios.put(
        `${HOST}/policyUpdate`, data
    );
    return response.data;
}


export async function checkInit(id) {
    const response = await axios.get(
        `${HOST}/init`
    );
    return response.data;
}

export async function twinInit(data) {
    const response = await axios.put(
        `${HOST}/init`, data
    );
    return response.data;
}

export async function updateEntity(data) {
    const response = await axios.put(
        `${HOST}/entity`, data
    );
    return response.data;
}


export async function editEntity(data) {
    const response = await axios.put(
        `${HOST}/entityEdit`, data
    );
    return response.data;
}

export async function updateSimulation(data) {
    const response = await axios.put(
        `${HOST}/simulation`, data
    );
    return response.data;
}
