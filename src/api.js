import axios from 'axios';

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
        `http://localhost:4000/twin/${id}`
    );
    return response.data;
}


export async function getEntity(id) {
    const response = await axios.get(
        `http://localhost:4000/entity/${id}`
    );
    return response.data;
}


export async function removeTwin(data) {
    const response = await axios.delete(
        'http://localhost:4000/twin', {
        data
    }
    );
    return response.data;
}

export async function getAllInfos() {
    const response = await axios.get(
        'http://localhost:4000/allInfos'
    );

    return response.data;
}


export async function getPlicyInfos() {
    const response = await axios.get(
        'http://localhost:4000/policyInfos'
    );

    return response.data;
}

export async function updatePolicy(data) {
    const response = await axios.put(
        'http://localhost:4000/policyUpdate',data
    );
    return response.data;
}
